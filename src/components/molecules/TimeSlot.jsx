import { motion } from 'framer-motion'
import { formatTime } from '@/services/utils'

const TimeSlot = ({ 
  time, 
  available = true, 
  selected = false, 
  onSelect,
  className = ''
}) => {
  const handleClick = () => {
    if (available && onSelect) {
      onSelect(time)
    }
  }

  return (
    <motion.button
      whileHover={available ? { scale: 1.05 } : {}}
      whileTap={available ? { scale: 0.95 } : {}}
      onClick={handleClick}
      disabled={!available}
      className={`
        px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${available 
          ? selected
            ? 'bg-primary text-white shadow-md'
            : 'bg-white text-gray-700 border border-surface-300 hover:border-primary hover:text-primary'
          : 'bg-surface-100 text-surface-400 cursor-not-allowed'
        }
        ${className}
      `}
    >
      {formatTime(time)}
    </motion.button>
  )
}

export default TimeSlot