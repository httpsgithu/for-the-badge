import { ref, reactive, computed, watch } from 'vue'

export interface CookieCategory {
  id: string
  name: string
  description: string
  required: boolean
  enabled: boolean
}

export interface CookieConsent {
  hasConsented: boolean
  consentDate?: Date
  categories: Record<string, boolean>
}

const STORAGE_KEY = 'ftb_cookie_consent'

// Default cookie categories based on actual For the Badge usage
const defaultCategories: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    description: 'Required for authentication, security, and basic website functionality. These cannot be disabled.',
    required: true,
    enabled: true
  },
  {
    id: 'security',
    name: 'Security Cookies', 
    description: 'CSRF protection tokens and rate limiting counters to prevent abuse and keep the site secure.',
    required: true,
    enabled: true
  }
]

// Global state
const categories = ref<CookieCategory[]>([...defaultCategories])
const consent = ref<CookieConsent>({
  hasConsented: false,
  categories: {}
})
const showBanner = ref(false)
const showPreferences = ref(false)

export const useCookieConsent = () => {
  // Load consent from localStorage on first use
  const loadConsent = () => {
    if (!import.meta.client) return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CookieConsent
        consent.value = {
          ...parsed,
          consentDate: parsed.consentDate ? new Date(parsed.consentDate) : undefined
        }
        
        // Update categories based on stored consent
        categories.value = categories.value.map(category => ({
          ...category,
          enabled: category.required || parsed.categories[category.id] || false
        }))
      } else {
        // First visit - show banner
        showBanner.value = true
      }
    } catch (error) {
      console.error('Error loading cookie consent:', error)
      showBanner.value = true
    }
  }

  // Save consent to localStorage
  const saveConsent = () => {
    if (!import.meta.client) return

    try {
      const consentData: CookieConsent = {
        hasConsented: consent.value.hasConsented,
        consentDate: consent.value.consentDate || new Date(),
        categories: Object.fromEntries(
          categories.value.map(cat => [cat.id, cat.enabled])
        )
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData))
      consent.value = consentData
    } catch (error) {
      console.error('Error saving cookie consent:', error)
    }
  }

  // Accept all cookies
  const acceptAll = () => {
    categories.value = categories.value.map(category => ({
      ...category,
      enabled: true
    }))
    
    consent.value.hasConsented = true
    consent.value.consentDate = new Date()
    saveConsent()
    showBanner.value = false
    showPreferences.value = false
  }

  // Accept only essential cookies
  const acceptEssential = () => {
    categories.value = categories.value.map(category => ({
      ...category,
      enabled: category.required
    }))
    
    consent.value.hasConsented = true
    consent.value.consentDate = new Date()
    saveConsent()
    showBanner.value = false
    showPreferences.value = false
  }

  // Save current preferences
  const savePreferences = () => {
    consent.value.hasConsented = true
    consent.value.consentDate = new Date()
    saveConsent()
    showBanner.value = false
    showPreferences.value = false
  }

  // Update a specific category
  const updateCategory = (categoryId: string, enabled: boolean) => {
    const category = categories.value.find(cat => cat.id === categoryId)
    if (category && !category.required) {
      category.enabled = enabled
    }
  }

  // Reset consent (for testing)
  const resetConsent = () => {
    if (!import.meta.client) return
    
    localStorage.removeItem(STORAGE_KEY)
    consent.value = {
      hasConsented: false,
      categories: {}
    }
    categories.value = [...defaultCategories]
    showBanner.value = true
    showPreferences.value = false
  }

  // Check if a specific category is enabled
  const isCategoryEnabled = (categoryId: string): boolean => {
    const category = categories.value.find(cat => cat.id === categoryId)
    return category?.enabled || false
  }

  // All cookies are required for For the Badge's minimal approach
  const allCookiesRequired = computed(() => true)

  // Initialize on client
  if (import.meta.client && !consent.value.hasConsented) {
    loadConsent()
  }

  // Watch for changes to save automatically
  watch(categories, saveConsent, { deep: true })

  return {
    // State
    categories: readonly(categories),
    consent: readonly(consent),
    showBanner,
    showPreferences,
    
    // Computed
    allCookiesRequired,
    
    // Methods
    acceptAll,
    acceptEssential,
    savePreferences,
    updateCategory,
    resetConsent,
    isCategoryEnabled,
    loadConsent
  }
}

// For debugging in development
if (import.meta.dev) {
  (globalThis as any).__resetCookieConsent = () => {
    const { resetConsent } = useCookieConsent()
    resetConsent()
  }
}