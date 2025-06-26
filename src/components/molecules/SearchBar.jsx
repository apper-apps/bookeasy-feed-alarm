import { useState } from 'react'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search services...", 
  showLocation = true,
  showCategory = true,
  className = '' 
}) => {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('all')

  const categories = [
    { value: 'all', label: 'All Services' },
    { value: 'salon', label: 'Hair & Beauty' },
    { value: 'dental', label: 'Dental' },
    { value: 'spa', label: 'Spa & Wellness' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'medical', label: 'Medical' }
  ]

  const handleSearch = () => {
    onSearch({ query, location, category })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            icon="Search"
          />
        </div>

        {/* Location Input */}
        {showLocation && (
          <div className="flex-1">
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              icon="MapPin"
            />
          </div>
        )}

        {/* Category Select */}
        {showCategory && (
          <div className="flex-1">
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-surface-300 rounded-lg bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <ApperIcon 
                name="ChevronDown" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
              />
            </div>
          </div>
        )}

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          variant="primary"
          size="lg"
          icon="Search"
          className="whitespace-nowrap"
        >
          Search
        </Button>
      </div>
    </div>
  )
}

export default SearchBar