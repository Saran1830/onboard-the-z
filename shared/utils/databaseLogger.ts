/**
 * Database logging utility for persistent log storage
 * Handles structured logging to database for production environments
 */

import { supabaseServerClient } from '../../server/utils/supabase/serverClient'
import type { LogEntry } from './logger'

export interface DatabaseLogEntry {
  id?: string
  timestamp: string
  level: string
  message: string
  context?: string
  metadata?: Record<string, string | number | boolean | null>
  error_message?: string
  error_stack?: string
  created_at?: string
}

class DatabaseLogger {
  private supabase = supabaseServerClient()

  /**
   * Log entry to database
   * @param entry - Log entry to store
   */
  async log(entry: LogEntry): Promise<void> {
    try {
      const dbEntry: DatabaseLogEntry = {
        timestamp: entry.timestamp,
        level: this.getLevelString(entry.level),
        message: entry.message,
        context: entry.context,
        metadata: entry.metadata ? JSON.parse(JSON.stringify(entry.metadata)) : null,
        error_message: entry.error?.message,
        error_stack: entry.error?.stack
      }

      const { error } = await this.supabase
        .from('application_logs')
        .insert([dbEntry])

      if (error) {
        // Don't throw here to avoid infinite logging loops
        console.error('Failed to insert log into database:', error)
      }
    } catch (error) {
      // Silently fail to prevent infinite logging loops
      console.error('Database logging error:', error)
    }
  }

  /**
   * Retrieve logs from database with filtering
   * @param options - Filter options
   */
  async getLogs(options: {
    level?: string
    context?: string
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  } = {}): Promise<DatabaseLogEntry[]> {
    try {
      let query = this.supabase
        .from('application_logs')
        .select('*')

      if (options.level) {
        query = query.eq('level', options.level)
      }

      if (options.context) {
        query = query.eq('context', options.context)
      }

      if (options.startDate) {
        query = query.gte('timestamp', options.startDate)
      }

      if (options.endDate) {
        query = query.lte('timestamp', options.endDate)
      }

      query = query
        .order('timestamp', { ascending: false })
        .limit(options.limit || 100)

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 100) - 1)
      }

      const { data, error } = await query

      if (error) {
        console.error('Failed to retrieve logs from database:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Database log retrieval error:', error)
      return []
    }
  }

  /**
   * Clean up old logs (retention policy)
   * @param daysToKeep - Number of days to keep logs
   */
  async cleanupOldLogs(daysToKeep: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const { error } = await this.supabase
        .from('application_logs')
        .delete()
        .lt('timestamp', cutoffDate.toISOString())

      if (error) {
        console.error('Failed to cleanup old logs:', error)
      }
    } catch (error) {
      console.error('Log cleanup error:', error)
    }
  }

  /**
   * Get log statistics
   */
  async getLogStats(startDate?: string, endDate?: string): Promise<{
    total: number
    byLevel: Record<string, number>
    byContext: Record<string, number>
  }> {
    try {
      let query = this.supabase
        .from('application_logs')
        .select('level, context')

      if (startDate) {
        query = query.gte('timestamp', startDate)
      }

      if (endDate) {
        query = query.lte('timestamp', endDate)
      }

      const { data, error } = await query

      if (error) {
        console.error('Failed to get log stats:', error)
        return { total: 0, byLevel: {}, byContext: {} }
      }

      const logs = data || []
      const byLevel: Record<string, number> = {}
      const byContext: Record<string, number> = {}

      logs.forEach(log => {
        byLevel[log.level] = (byLevel[log.level] || 0) + 1
        if (log.context) {
          byContext[log.context] = (byContext[log.context] || 0) + 1
        }
      })

      return {
        total: logs.length,
        byLevel,
        byContext
      }
    } catch (error) {
      console.error('Log stats error:', error)
      return { total: 0, byLevel: {}, byContext: {} }
    }
  }

  /**
   * Convert numeric log level to string
   */
  private getLevelString(level: number): string {
    const levels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']
    return levels[level] || 'UNKNOWN'
  }
}

// Export singleton instance
export const databaseLogger = new DatabaseLogger()

// Export class for testing
export { DatabaseLogger }
