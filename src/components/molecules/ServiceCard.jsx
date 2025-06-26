import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ServiceCard = ({ service, onSelect, selected = false, className = '' }) => {
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${mins}m`
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${selected 
          ? 'border-primary bg-primary/5 shadow-md' 
          : 'border-surface-200 bg-white hover:border-primary/50 hover:shadow-sm'
        }
        ${className}
      `}
      onClick={() => onSelect(service)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">
            {service.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {service.description}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
              {formatDuration(service.duration)}
            </div>
            <div className="flex items-center font-semibold text-primary">
              <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
              {service.price}
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-4">
          {selected ? (
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <ApperIcon name="Check" className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-6 h-6 border-2 border-surface-300 rounded-full" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ServiceCard