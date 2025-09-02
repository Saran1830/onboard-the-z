/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { describe, it } from 'mocha'
import { expect } from 'chai'

// Mock utility functions based on project structure
const utils = {
  // Format date for display
  formatDate: (dateString: string): string => {
    if (!dateString) return ''
    try {
      // Parse date string and handle timezone issues
      const [year, month, day] = dateString.split('-').map(Number)
      if (year && month && day) {
        const date = new Date(year, month - 1, day) // month is 0-indexed
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Invalid Date'
    }
  },

  // Validate step number
  isValidStep: (step: string | number): boolean => {
    const stepNum = typeof step === 'string' ? parseInt(step, 10) : step
    return !isNaN(stepNum) && stepNum >= 1 && stepNum <= 3
  },

  // Get next step in onboarding flow
  getNextStep: (currentStep: number): number | null => {
    if (currentStep === 1) return 2
    if (currentStep === 2) return 3
    if (currentStep === 3) return null // Last step
    return null
  },

  // Get previous step in onboarding flow
  getPreviousStep: (currentStep: number): number | null => {
    if (currentStep === 2) return 1
    if (currentStep === 3) return 2
    return null // First step
  },

  // Clean form data by removing empty strings and null values
  cleanFormData: (data: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {}
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const cleanedNested = utils.cleanFormData(value)
          if (Object.keys(cleanedNested).length > 0) {
            cleaned[key] = cleanedNested
          }
        } else {
          cleaned[key] = value
        }
      }
    }
    return cleaned
  },

  // Generate component ID
  generateComponentId: (name: string): string => {
    if (!name) return 'comp_' + Date.now()
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now()
  },

  // Validate component name
  isValidComponentName: (name: string): boolean => {
    if (!name || typeof name !== 'string') return false
    if (name.length < 2 || name.length > 50) return false
    // Must start with letter, can contain letters, numbers, underscores
    return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)
  },

  // Deep clone object
  deepClone: <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as any
    if (Array.isArray(obj)) return obj.map(item => utils.deepClone(item)) as any
    
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = utils.deepClone(obj[key])
      }
    }
    return cloned
  }
}

// Mock localStorage hook functionality
const mockLocalStorage = {
  storage: new Map<string, string>(),
  
  getItem: (key: string): string | null => {
    return mockLocalStorage.storage.get(key) || null
  },
  
  setItem: (key: string, value: string): void => {
    mockLocalStorage.storage.set(key, value)
  },
  
  removeItem: (key: string): void => {
    mockLocalStorage.storage.delete(key)
  },
  
  clear: (): void => {
    mockLocalStorage.storage.clear()
  }
}

// Mock useLocalStorage hook
const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const storedValue = mockLocalStorage.getItem(key)
  let parsedValue: T
  
  try {
    parsedValue = storedValue ? JSON.parse(storedValue) : initialValue
  } catch {
    parsedValue = initialValue
  }
  
  const setValue = (value: T) => {
    mockLocalStorage.setItem(key, JSON.stringify(value))
  }
  
  return [parsedValue, setValue]
}

describe('Utility Functions', () => {
  describe('Date Formatting', () => {
    it('should format valid date string', () => {
      expect(utils.formatDate('2023-05-15')).to.equal('May 15, 2023')
      expect(utils.formatDate('1990-12-25')).to.equal('December 25, 1990')
    })

    it('should handle invalid date strings', () => {
      expect(utils.formatDate('invalid-date')).to.equal('Invalid Date')
      expect(utils.formatDate('')).to.equal('')
    })
  })

  describe('Step Validation', () => {
    it('should validate valid step numbers', () => {
      expect(utils.isValidStep(1)).to.be.true
      expect(utils.isValidStep(2)).to.be.true
      expect(utils.isValidStep(3)).to.be.true
      expect(utils.isValidStep('2')).to.be.true
    })

    it('should reject invalid step numbers', () => {
      expect(utils.isValidStep(0)).to.be.false
      expect(utils.isValidStep(4)).to.be.false
      expect(utils.isValidStep(-1)).to.be.false
      expect(utils.isValidStep('invalid')).to.be.false
    })
  })

  describe('Step Navigation', () => {
    it('should return correct next step', () => {
      expect(utils.getNextStep(1)).to.equal(2)
      expect(utils.getNextStep(2)).to.equal(3)
      expect(utils.getNextStep(3)).to.be.null
    })

    it('should return correct previous step', () => {
      expect(utils.getPreviousStep(2)).to.equal(1)
      expect(utils.getPreviousStep(3)).to.equal(2)
      expect(utils.getPreviousStep(1)).to.be.null
    })
  })

  describe('Form Data Cleaning', () => {
    it('should remove empty strings and null values', () => {
      const input = {
        name: 'John',
        email: '',
        phone: null,
        age: 25,
        address: ''
      }
      const expected = {
        name: 'John',
        age: 25
      }
      expect(utils.cleanFormData(input)).to.deep.equal(expected)
    })

    it('should clean nested objects', () => {
      const input = {
        user: {
          name: 'John',
          email: '',
          profile: {
            bio: 'Developer',
            website: ''
          }
        },
        settings: {
          theme: '',
          notifications: null
        }
      }
      const expected = {
        user: {
          name: 'John',
          profile: {
            bio: 'Developer'
          }
        }
      }
      expect(utils.cleanFormData(input)).to.deep.equal(expected)
    })
  })

  describe('Component ID Generation', () => {
    it('should generate valid component IDs', () => {
      const id1 = utils.generateComponentId('aboutme')
      const id2 = utils.generateComponentId('birth-date')
      
      expect(id1).to.match(/^aboutme_\d+$/)
      expect(id2).to.match(/^birth_date_\d+$/)
      expect(id1).to.not.equal(id2)
    })

    it('should handle empty names', () => {
      const id = utils.generateComponentId('')
      expect(id).to.match(/^comp_\d+$/)
    })
  })

  describe('Component Name Validation', () => {
    it('should validate correct component names', () => {
      expect(utils.isValidComponentName('aboutme')).to.be.true
      expect(utils.isValidComponentName('birth_date')).to.be.true
      expect(utils.isValidComponentName('phoneNumber123')).to.be.true
    })

    it('should reject invalid component names', () => {
      expect(utils.isValidComponentName('')).to.be.false
      expect(utils.isValidComponentName('a')).to.be.false // too short
      expect(utils.isValidComponentName('123name')).to.be.false // starts with number
      expect(utils.isValidComponentName('name-with-dash')).to.be.false // contains dash
      expect(utils.isValidComponentName('name with space')).to.be.false // contains space
    })
  })

  describe('Deep Clone', () => {
    it('should clone primitive values', () => {
      expect(utils.deepClone('string')).to.equal('string')
      expect(utils.deepClone(123)).to.equal(123)
      expect(utils.deepClone(true)).to.equal(true)
      expect(utils.deepClone(null)).to.equal(null)
    })

    it('should clone arrays', () => {
      const arr = [1, 2, { a: 3 }]
      const cloned = utils.deepClone(arr)
      
      expect(cloned).to.deep.equal(arr)
      expect(cloned).to.not.equal(arr) // Different reference
      expect(cloned[2]).to.not.equal(arr[2]) // Nested objects are also cloned
    })

    it('should clone objects', () => {
      const obj = {
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'New York'
        }
      }
      const cloned = utils.deepClone(obj)
      
      expect(cloned).to.deep.equal(obj)
      expect(cloned).to.not.equal(obj)
      expect(cloned.address).to.not.equal(obj.address)
    })

    it('should clone dates', () => {
      const date = new Date('2023-05-15')
      const cloned = utils.deepClone(date)
      
      expect(cloned.getTime()).to.equal(date.getTime())
      expect(cloned).to.not.equal(date)
    })
  })
})

describe('Local Storage Hook', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
  })

  it('should return initial value when no stored value exists', () => {
    const [value] = useLocalStorage('test-key', 'default')
    expect(value).to.equal('default')
  })

  it('should store and retrieve values', () => {
    const [, setValue] = useLocalStorage('test-key', 'default')
    setValue('new value')
    
    const [value] = useLocalStorage('test-key', 'default')
    expect(value).to.equal('new value')
  })

  it('should handle complex objects', () => {
    const initialValue = { name: 'John', age: 30 }
    const [, setValue] = useLocalStorage('user', initialValue)
    
    const newValue = { name: 'Jane', age: 25 }
    setValue(newValue)
    
    const [value] = useLocalStorage('user', initialValue)
    expect(value).to.deep.equal(newValue)
  })

  it('should fallback to initial value on JSON parse error', () => {
    mockLocalStorage.setItem('corrupt-key', 'invalid json')
    const [value] = useLocalStorage('corrupt-key', 'fallback')
    expect(value).to.equal('fallback')
  })
})
