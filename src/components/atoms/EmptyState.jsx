import { motion } from 'framer-motion'
import Button from './Button'
import ApperIcon from '@/components/ApperIcon'

const EmptyState = ({ 
  title = 'No items found',
  description = 'There are no items to display right now.',
  actionLabel,
  onAction,
  icon = 'Package',
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto mb-4" />
      </motion.div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default EmptyState