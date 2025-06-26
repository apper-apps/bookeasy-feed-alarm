import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  iconPosition = 'left',
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false)

  const hasValue = value && value.length > 0
  const showFloatingLabel = focused || hasValue

  return (
    <div className={`relative ${className}`}>
      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${
            iconPosition === 'left' ? 'left-3' : 'right-3'
          }`}>
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}
        
        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error 
              ? 'border-error focus:border-error focus:ring-error/20' 
              : focused 
                ? 'border-primary focus:border-primary focus:ring-primary/20'
                : 'border-surface-300 hover:border-surface-400'
            }
            ${disabled ? 'bg-surface-100 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-4
            placeholder-transparent
          `}
          placeholder={placeholder || label}
          {...props}
        />
        
        {/* Floating Label */}
        {label && (
          <label
            className={`
              absolute left-4 transition-all duration-200 pointer-events-none
              ${showFloatingLabel
                ? 'top-2 text-xs text-gray-600 bg-white px-1 -ml-1'
                : 'top-1/2 transform -translate-y-1/2 text-gray-500'
              }
              ${icon && iconPosition === 'left' && !showFloatingLabel ? 'left-10' : ''}
              ${error ? 'text-error' : focused ? 'text-primary' : ''}
            `}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Input