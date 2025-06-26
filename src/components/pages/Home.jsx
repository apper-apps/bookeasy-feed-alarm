import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '@/components/molecules/SearchBar'
import CategoryGrid from '@/components/organisms/CategoryGrid'
import FeaturedBusinesses from '@/components/organisms/FeaturedBusinesses'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Home = () => {
  const navigate = useNavigate()

  const handleSearch = (searchParams) => {
    const params = new URLSearchParams()
    if (searchParams.query) params.set('q', searchParams.query)
    if (searchParams.location) params.set('location', searchParams.location)
    if (searchParams.category && searchParams.category !== 'all') {
      params.set('category', searchParams.category)
    }
    
    navigate(`/search?${params.toString()}`)
  }

  const handleCategorySelect = (categoryId) => {
    navigate(`/search?category=${categoryId}`)
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6"
            >
              Book Your Perfect
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Appointment
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Discover and book appointments with top-rated service providers in your area. 
              From salons to spas, dental to fitness - we've got you covered.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect service provider for your needs. 
              Explore our wide range of categories and book with confidence.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <CategoryGrid onCategorySelect={handleCategorySelect} />
          </motion.div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 bg-surface-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <FeaturedBusinesses />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to grow your business?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of service providers who use BookEasy to manage their appointments 
              and grow their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="accent"
                size="lg"
                icon="Building"
                onClick={() => navigate('/for-business')}
              >
                Get Started for Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon="Phone"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home