import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Rating from '@/components/atoms/Rating'
import ApperIcon from '@/components/ApperIcon'

const BusinessCard = ({ business, className = '' }) => {
  const navigate = useNavigate()

  const handleViewProfile = () => {
    navigate(`/business/${business.Id}`)
  }

  const handleQuickBook = (e) => {
    e.stopPropagation()
    navigate(`/book/${business.Id}`)
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

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer ${className}`}
      onClick={handleViewProfile}
    >
      {/* Business Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={business.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop'}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={getCategoryColor(business.type)} className="flex items-center">
            <ApperIcon name={getCategoryIcon(business.type)} className="w-3 h-3 mr-1" />
            {business.type.charAt(0).toUpperCase() + business.type.slice(1)}
          </Badge>
        </div>
        {business.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="warning" className="flex items-center">
              <ApperIcon name="Star" className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Business Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {business.name}
          </h3>
          <Rating 
            rating={business.rating} 
            showCount={true} 
            count={business.reviewCount}
            size="sm"
          />
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
          <span className="text-sm line-clamp-1">
            {business.location.area}, {business.location.city}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {business.description}
        </p>

        {/* Services Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {business.services.slice(0, 3).map((service) => (
              <Badge key={service.Id} variant="default" size="xs">
                {service.name}
              </Badge>
            ))}
            {business.services.length > 3 && (
              <Badge variant="default" size="xs">
                +{business.services.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            From ${Math.min(...business.services.map(s => s.price))}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
            {Math.min(...business.services.map(s => s.duration))}min
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={handleQuickBook}
          >
            Quick Book
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default BusinessCard