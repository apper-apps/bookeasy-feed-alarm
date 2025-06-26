const SkeletonLoader = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '',
  count = 1 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div key={index} className={`${width} ${height} bg-surface-200 rounded mb-2`} />
      ))}
    </div>
  )
}

export default SkeletonLoader