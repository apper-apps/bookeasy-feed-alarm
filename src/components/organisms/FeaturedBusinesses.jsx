import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import BusinessCard from '@/components/molecules/BusinessCard'
import { businessService } from '@/services/api/businessService'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'

const FeaturedBusinesses = ({ className = '' }) => {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadFeaturedBusinesses = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await businessService.getFeaturedBusinesses()
        setBusinesses(data)
      } catch (err) {
        setError(err.message || 'Failed to load featured businesses')
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedBusinesses()
  }, [])

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

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Businesses</h2>
          <p className="text-gray-600">Discover top-rated service providers in your area</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <SkeletonLoader key={index} className="h-80" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => window.location.reload()}
        className={className}
      />
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Featured Businesses</h2>
        <p className="text-gray-600">Discover top-rated service providers in your area</p>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {businesses.map((business) => (
          <motion.div key={business.Id} variants={itemVariants}>
            <BusinessCard business={business} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default FeaturedBusinesses