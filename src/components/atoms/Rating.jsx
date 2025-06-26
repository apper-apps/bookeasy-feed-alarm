import ApperIcon from '@/components/ApperIcon'

const Rating = ({ rating, maxRating = 5, showCount = false, count = 0, size = 'sm' }) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => (
          <ApperIcon
            key={index}
            name="Star"
            className={`${sizes[size]} ${
              index < Math.floor(rating)
                ? 'text-warning fill-current'
                : index < rating
                  ? 'text-warning/50 fill-current'
                  : 'text-surface-300'
            }`}
          />
        ))}
      </div>
      <span className={`font-medium text-gray-700 ${textSizes[size]}`}>
        {rating.toFixed(1)}
      </span>
      {showCount && count > 0 && (
        <span className={`text-gray-500 ${textSizes[size]}`}>
          ({count})
        </span>
      )}
    </div>
  )
}

export default Rating