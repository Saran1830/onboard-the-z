'use client'

import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'glass' | 'solid' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  variant = 'glass',
  padding = 'md' 
}) => {
  const variants = {
    glass: 'glass-card',
    solid: 'bg-white shadow-lg border border-gray-200',
    outlined: 'bg-white border-2 border-gray-200'
  }
  
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  // For glass variant, padding is built into the glass-card class
  const paddingClass = variant === 'glass' ? '' : paddings[padding]
  
  return (
    <div className={`${variants[variant]} ${paddingClass} ${className}`}>
      {children}
    </div>
  )
}

export { Card }