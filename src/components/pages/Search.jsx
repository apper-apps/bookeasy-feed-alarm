import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import BusinessCard from '@/components/molecules/BusinessCard'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import EmptyState from '@/components/atoms/EmptyState'
import ErrorState from '@/components/atoms/ErrorState'
import ApperIcon from '@/components/ApperIcon'
import { businessService } from '@/services/api/businessService'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('rating')
  const [filterPrice, setFilterPrice] = useState('all')
  const [viewMode, setViewMode] = useState('grid')

  const query = searchParams.get('q') || ''
  const location = searchParams.get('location') || ''
  const category = searchParams.get('category') || 'all'

  useEffect(() => {
    performSearch()
  }, [query, location, category, sortBy])

  const performSearch = async () => {
    setLoading(true)
    setError(null)
    try {
      let results = await businessService.searchBusinesses(query, location, category)
      
      // Apply sorting
      results = sortBusinesses(results, sortBy)
      
      // Apply price filter
      if (filterPrice !== 'all') {
        results = filterByPrice(results, filterPrice)
      }
      
      setBusinesses(results)
    } catch (err) {
      setError(err.message || 'Failed to search businesses')
    } finally {
      setLoading(false)
    }
  }

  const sortBusinesses = (businesses, sortBy) => {
    const sorted = [...businesses]
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating)
      case 'price-low':
        return sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b))
      case 'price-high':
        return sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a))
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return sorted
    }
  }

  const filterByPrice = (businesses, priceRange) => {
    return businesses.filter(business => {
      const minPrice = getMinPrice(business)
      switch (priceRange) {
        case 'low':
          return minPrice < 50
        case 'medium':
          return minPrice >= 50 && minPrice < 150
        case 'high':
          return minPrice >= 150
        default:
          return true
      }
    })
  }

  const getMinPrice = (business) => {
    return Math.min(...business.services.map(s => s.price))
  }

  const handleSearch = (searchParams) => {
    const params = new URLSearchParams()
    if (searchParams.query) params.set('q', searchParams.query)
    if (searchParams.location) params.set('location', searchParams.location)
    if (searchParams.category && searchParams.category !== 'all') {
      params.set('category', searchParams.category)
    }
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSortBy('rating')
    setFilterPrice('all')
    setSearchParams(new URLSearchParams())
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="min-h-full"
    >
      {/* Search Header */}
      <section className="bg-white border-b border-surface-200 py-6">
        <div className="container mx-auto px-4">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search for services, businesses, or treatments..."
          />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'low', label: 'Under $50' },
                    { value: 'medium', label: '$50 - $150' },
                    { value: 'high', label: '$150+' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={option.value}
                        checked={filterPrice === option.value}
                        onChange={(e) => setFilterPrice(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  View
                </label>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                    size="sm"
                    icon="Grid3x3"
                    onClick={() => setViewMode('grid')}
                  />
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="sm"
                    icon="List"
                    onClick={() => setViewMode('list')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {query ? `Results for "${query}"` : 'All Businesses'}
                </h1>
                {!loading && (
                  <p className="text-gray-600 mt-1">
                    {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'} found
                    {location && ` in ${location}`}
                  </p>
                )}
              </div>

              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {category !== 'all' && (
                  <Badge variant="primary" className="flex items-center">
                    {category}
                    <button
                      onClick={() => setSearchParams(new URLSearchParams())}
                      className="ml-2 hover:text-white"
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {location && (
                  <Badge variant="secondary" className="flex items-center">
                    {location}
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams)
                        params.delete('location')
                        setSearchParams(params)
                      }}
                      className="ml-2 hover:text-white"
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, index) => (
                  <SkeletonLoader key={index} className="h-80 rounded-lg" />
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <ErrorState
                message={error}
                onRetry={performSearch}
              />
            )}

            {/* Empty State */}
            {!loading && !error && businesses.length === 0 && (
              <EmptyState
                icon="Search"
                title="No businesses found"
                description="Try adjusting your search criteria or browse our categories to find what you're looking for."
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            )}

            {/* Results Grid */}
            {!loading && !error && businesses.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
              >
                {businesses.map((business) => (
                  <motion.div key={business.Id} variants={itemVariants}>
                    <BusinessCard business={business} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Search