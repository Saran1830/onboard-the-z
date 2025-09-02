/**
 * Component Repository
 * @module ComponentRepository
 * @author Board the Z Team
 * @version 1.0.0
 */

import { supabaseServerClient } from "../utils/supabase/serverClient"
import { BaseRepository, RepositoryResult } from "./BaseRepository"
import type { 
  CustomComponent, 
  PageConfig, 
  ComponentType
} from "../../src/types/components"
import { COMPONENT_TYPES } from "../../src/types/components"
import type {
  CreateComponentData,
  UpdatePageConfigData
} from "../types/component"

// Shape coming from Supabase (type is string in the DB)
type DbCustomComponent = Omit<CustomComponent, "type"> & { type: string }

function toCustomComponent(row: DbCustomComponent): CustomComponent {
  // Validate & coerce DB string -> union
  if (!COMPONENT_TYPES.includes(row.type as ComponentType)) {
    throw new Error(`Invalid component type from DB: ${row.type}`)
  }
  return { ...row, type: row.type as ComponentType }
}

export class ComponentRepository extends BaseRepository<CustomComponent, string> {
  private supabase = supabaseServerClient()

  async findById(id: string): Promise<RepositoryResult<CustomComponent | null>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("custom_components")
          .select("*")
          .eq("id", id)
          .single()

        if (error && error.code !== 'PGRST116') {
          throw error
        }
        
        return data ? toCustomComponent(data as DbCustomComponent) : null
      } catch (error) {
        console.error('ComponentRepository.findById error:', error)
        throw error instanceof Error ? error : new Error('Find component by ID operation failed')
      }
    }, 'findById')
  }

  async findByName(name: string): Promise<RepositoryResult<CustomComponent | null>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("custom_components")
          .select("*")
          .eq("name", name)
          .maybeSingle()

        if (error) {
          throw error
        }
        
        return data ? toCustomComponent(data as DbCustomComponent) : null
      } catch (error) {
        console.error('ComponentRepository.findByName error:', error)
        throw error instanceof Error ? error : new Error('Find component by name operation failed')
      }
    }, 'findByName')
  }

  async create(componentData: CreateComponentData): Promise<RepositoryResult<CustomComponent>> {
    return this.handleOperation(async () => {
      try {
        // Validate component name
        if (!componentData.name || !/^[a-z_]+$/.test(componentData.name)) {
          throw new Error('Component name must contain only lowercase letters and underscores')
        }

        // Check if component name already exists
        const { data: existing } = await this.supabase
          .from('custom_components')
          .select('name')
          .eq('name', componentData.name)
          .single()

        if (existing) {
          throw new Error('Component name already exists')
        }

        const { data, error } = await this.supabase
          .from("custom_components")
          .insert(componentData)
          .select()
          .single()

        if (error || !data) {
          throw error || new Error('Failed to create component')
        }
        
        return toCustomComponent(data as DbCustomComponent)
      } catch (error) {
        console.error('ComponentRepository.create error:', error)
        throw error instanceof Error ? error : new Error('Create component operation failed')
      }
    }, 'create')
  }

  async update(id: string, componentData: Partial<CustomComponent>): Promise<RepositoryResult<CustomComponent>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("custom_components")
          .update(componentData)
          .eq("id", id)
          .select()
          .single()

        if (error || !data) {
          throw error || new Error('Failed to update component')
        }
        
        return toCustomComponent(data as DbCustomComponent)
      } catch (error) {
        console.error('ComponentRepository.update error:', error)
        throw error instanceof Error ? error : new Error('Update component operation failed')
      }
    }, 'update')
  }

  async delete(id: string): Promise<RepositoryResult<boolean>> {
    return this.handleOperation(async () => {
      try {
        const { error } = await this.supabase
          .from("custom_components")
          .delete()
          .eq("id", id)

        if (error) {
          throw error
        }
        
        return true
      } catch (error) {
        console.error('ComponentRepository.delete error:', error)
        throw error instanceof Error ? error : new Error('Delete component operation failed')
      }
    }, 'delete')
  }

  async findAll(): Promise<RepositoryResult<CustomComponent[]>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("custom_components")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          throw error
        }
        
        const rows = (data || []) as DbCustomComponent[]
        return rows.map(toCustomComponent)
      } catch (error) {
        console.error('ComponentRepository.findAll error:', error)
        throw error instanceof Error ? error : new Error('Find all components operation failed')
      }
    }, 'findAll')
  }

  // Page Config methods
  async findPageConfigByPage(page: number): Promise<RepositoryResult<PageConfig | null>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("page_components")
          .select("*")
          .eq("page", page)
          .maybeSingle()

        if (error) {
          throw error
        }
        
        return data as PageConfig | null
      } catch (error) {
        console.error('ComponentRepository.findPageConfigByPage error:', error)
        throw error instanceof Error ? error : new Error('Find page config operation failed')
      }
    }, 'findPageConfigByPage')
  }

  async findAllPageConfigs(): Promise<RepositoryResult<PageConfig[]>> {
    return this.handleOperation(async () => {
      try {
        const { data, error } = await this.supabase
          .from("page_components")
          .select("*")
          .order("page")

        if (error) {
          throw error
        }
        
        return (data || []) as PageConfig[]
      } catch (error) {
        console.error('ComponentRepository.findAllPageConfigs error:', error)
        throw error instanceof Error ? error : new Error('Find all page configs operation failed')
      }
    }, 'findAllPageConfigs')
  }

  async updatePageConfig(page: number, updateData: UpdatePageConfigData): Promise<RepositoryResult<PageConfig>> {
    return this.handleOperation(async () => {
      try {
        // Validate that all components exist
        if (updateData.components.length > 0) {
          const { data: existingComponents } = await this.supabase
            .from("custom_components")
            .select("name")

          const existingNames = existingComponents?.map((c) => c.name) || []
          const invalidComponents = updateData.components.filter(
            (name) => !existingNames.includes(name)
          )

          if (invalidComponents.length > 0) {
            throw new Error(`Invalid components: ${invalidComponents.join(", ")}`)
          }
        }

        const { data, error } = await this.supabase
          .from("page_components")
          .upsert([{
            page,
            components: updateData.components,
            updated_at: new Date().toISOString()
          }], { onConflict: "page" })
          .select()
          .single()

        if (error || !data) {
          throw error || new Error('Failed to update page config')
        }
        
        return data as PageConfig
      } catch (error) {
        console.error('ComponentRepository.updatePageConfig error:', error)
        throw error instanceof Error ? error : new Error('Update page config operation failed')
      }
    }, 'updatePageConfig')
  }

  async validateComponentsExist(componentNames: string[]): Promise<RepositoryResult<boolean>> {
    return this.handleOperation(async () => {
      try {
        if (componentNames.length === 0) {
          return true
        }

        const { data: existingComponents } = await this.supabase
          .from("custom_components")
          .select("name")

        const existingNames = existingComponents?.map((c) => c.name) || []
        const invalidComponents = componentNames.filter(
          (name) => !existingNames.includes(name)
        )

        if (invalidComponents.length > 0) {
          throw new Error(`Components do not exist: ${invalidComponents.join(", ")}`)
        }

        return true
      } catch (error) {
        console.error('ComponentRepository.validateComponentsExist error:', error)
        throw error instanceof Error ? error : new Error('Component validation operation failed')
      }
    }, 'validateComponentsExist')
  }
}
