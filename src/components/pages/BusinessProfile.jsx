import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Rating from '@/components/atoms/Rating'
import ServiceCard from '@/components/molecules/ServiceCard'
import SkeletonLoader from '@/components/atoms/SkeletonLoader'
import ErrorState from '@/components/atoms/ErrorState'
import ApperIcon from '@/components/ApperIcon'
import { businessService } from '@/services/api/businessService'

const BusinessProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [activeTab, setActiveTab] = useState('services')

  useEffect(() => {
    loadBusiness()
  }, [id])

  const loadBusiness = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await businessService.getById(id)
      setBusiness(data)
    } catch (err) {
      setError(err.message || 'Failed to load business')
    } finally {
      setLoading(false)
    }
  }

  const handleBookService = (service) => {
    setSelectedService(service)
    navigate(`/book/${id}`, { state: { selectedService: service } })
  }

  const formatHours = (hours) => {
    if (!hours) return 'Hours not available'
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const todayHours = hours[today]
    
    if (todayHours?.closed) {
      return 'Closed today'
    }
    
    if (todayHours?.open && todayHours?.close) {
      return `Open today: ${todayHours.open} - ${todayHours.close}`
    }
    
    return 'Hours not available'
  }

  const getCategoryIcon = (type) => {
    const icons = {
      salon: 'Scissors',
      dental: 'Heart',
      spa: 'Flower',
      fitness: 'Dumbbell',
      medical: 'Stethoscope'
    }
    return icons[type] || 'Building2'
  }

  const getCategoryColor = (type) => {
    const colors = {
      salon: 'accent',
      dental: 'info',
      spa: 'secondary',
      fitness: 'success',
      medical: 'primary'
    }
    return colors[type] || 'default'
  }

  const tabs = [
    { id: 'services', label: 'Services', icon: 'List' },
    { id: 'about', label: 'About', icon: 'Info' },
    { id: 'reviews', label: 'Reviews', icon: 'Star' },
    { id: 'contact', label: 'Contact', icon: 'Phone' }
  ]

  if (loading) {
    return (
      <div className="min-h-full">
        <SkeletonLoader className="h-64 w-full" />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <SkeletonLoader count={3} className="h-24" />
            </div>
            <div className="space-y-4">
              <SkeletonLoader count={2} className="h-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          message={error}
          onRetry={loadBusiness}
        />
      </div>
    )
  }

  if (!business) {
    return null
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
      <section className="relative h-64 overflow-hidden">
        <img
          src={business.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop'}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant={getCategoryColor(business.type)} className="flex items-center">
                <ApperIcon name={getCategoryIcon(business.type)} className="w-3 h-3 mr-1" />
                {business.type.charAt(0).toUpperCase() + business.type.slice(1)}
              </Badge>
              {business.featured && (
                <Badge variant="warning" className="flex items-center">
                  <ApperIcon name="Star" className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
            <div className="flex items-center space-x-4">
              <Rating 
                rating={business.rating} 
                showCount={true} 
                count={business.reviewCount}
                size="md"
              />
              <div className="flex items-center">
                <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                <span>{business.location.area}, {business.location.city}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <nav className="flex space-x-8 border-b border-surface-200 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'services' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Services</h2>
                  {business.services.map((service) => (
                    <ServiceCard
                      key={service.Id}
                      service={service}
                      onSelect={() => handleBookService(service)}
                      selected={selectedService?.Id === service.Id}
                    />
                  ))}
                </motion.div>
              )}

              {activeTab === 'about' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">About {business.name}</h2>
                    <p className="text-gray-600 leading-relaxed">{business.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Opening Hours</h3>
                    <div className="bg-surface-50 rounded-lg p-4 space-y-2">
                      {Object.entries(business.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between items-center">
                          <span className="capitalize font-medium text-gray-700">{day}</span>
                          <span className="text-gray-600">
                            {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
                  <div className="text-center py-12">
                    <ApperIcon name="Star" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                    <p className="text-gray-600">Reviews feature coming soon!</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
                  <div className="bg-surface-50 rounded-lg p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Phone" className="w-5 h-5 text-primary" />
                      <span className="text-gray-700">{business.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ApperIcon name="Mail" className="w-5 h-5 text-primary" />
                      <span className="text-gray-700">{business.email}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ApperIcon name="MapPin" className="w-5 h-5 text-primary mt-1" />
                      <div className="text-gray-700">
                        <p>{business.location.address}</p>
                        <p>{business.location.area}, {business.location.city} {business.location.zipCode}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                  {formatHours(business.hours)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="DollarSign" className="w-4 h-4 mr-2" />
                  From ${Math.min(...business.services.map(s => s.price))}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                  {business.services.length} services available
                </div>
              </div>
            </div>

            {/* Book Now Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ready to book?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Choose a service and pick your preferred time slot.
              </p>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon="Calendar"
                onClick={() => navigate(`/book/${business.Id}`)}
              >
                Book Now
              </Button>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  icon="Phone"
                  onClick={() => window.open(`tel:${business.phone}`)}
                >
                  Call Now
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  icon="Mail"
                  onClick={() => window.open(`mailto:${business.email}`)}
                >
                  Send Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BusinessProfile