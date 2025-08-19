import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      filters: [],
      darkMode: false,
      searchQuery: '',
      
      addFilter: (filter) => {
        const { filters } = get()
        if (!filters.includes(filter)) {
          const newFilters = [...filters, filter]
          set({ filters: newFilters })
        }
      },
      
      removeFilter: (filter) => {
        const { filters } = get()
        const newFilters = filters.filter(f => f !== filter)
        set({ filters: newFilters })
      },
      
      clearFilters: () => {
        set({ filters: [] })
      },
      
      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }))
      },
      
      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },
      
      // Function to add multiple filters from comma-separated input
      addMultipleFilters: (filterString) => {
        const { filters } = get()
        const newFilters = filterString
          .split(',')
          .map(f => f.trim())
          .filter(f => f.length > 0 && !filters.includes(f))
        
        if (newFilters.length > 0) {
          set({ filters: [...filters, ...newFilters] })
        }
      }
    }),
    {
      name: 'job-filters-storage',
    }
  )
)