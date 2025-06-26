import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategoryGrid = ({ onCategorySelect, className = '' }) => {
  const categories = [
    {
      id: 'salon',
      name: 'Hair & Beauty',
      icon: 'Scissors',
      color: 'bg-gradient-to-br from-accent/20 to-accent/10',
      iconColor: 'text-accent',
      description: 'Haircuts, styling, coloring'
    },
    {
      id: 'dental',
      name: 'Dental Care',
      icon: 'Heart',
      color: 'bg-gradient-to-br from-info/20 to-info/10',
      iconColor: 'text-info',
      description: 'Cleanings, checkups, treatments'
    },
    {
      id: 'spa',
      name: 'Spa & Wellness',
      icon: 'Flower',
      color: 'bg-gradient-to-br from-secondary/20 to-secondary/10',
      iconColor: 'text-secondary',
      description: 'Massage, facials, relaxation'
    },
    {
      id: 'fitness',
      name: 'Fitness',
      icon: 'Dumbbell',
      color: 'bg-gradient-to-br from-success/20 to-success/10',
      iconColor: 'text-success',
      description: 'Personal training, classes'
    },
    {
      id: 'medical',
      name: 'Medical Services',
      icon: 'Stethoscope',
      color: 'bg-gradient-to-br from-primary/20 to-primary/10',
      iconColor: 'text-primary',
      description: 'Consultations, treatments'
    },
    {
      id: 'other',
      name: 'Other Services',
      icon: 'MoreHorizontal',
      color: 'bg-gradient-to-br from-surface-300/20 to-surface-200/10',
      iconColor: 'text-surface-600',
      description: 'Various professional services'
    }
  ]

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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {categories.map((category) => (
        <motion.div
          key={category.id}
          variants={itemVariants}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategorySelect(category.id)}
          className={`
            p-6 rounded-lg cursor-pointer transition-all duration-200
            ${category.color}
            hover:shadow-lg
          `}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
              <ApperIcon name={category.icon} className={`w-6 h-6 ${category.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {category.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default CategoryGrid