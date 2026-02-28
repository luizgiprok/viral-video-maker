import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'

const Checkbox = ({ 
  id, 
  checked = false, 
  onChange, 
  disabled = false,
  className = '',
  children,
  ...props 
}) => {
  const MotionCheckbox = motion.input
  
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <MotionCheckbox
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
          {...props}
        />
      </div>
      {children && (
        <label 
          htmlFor={id}
          className={`ml-3 text-sm ${
            disabled 
              ? 'text-gray-500' 
              : 'text-gray-700'
          }`}
        >
          {children}
        </label>
      )}
    </div>
  )
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
}

export default Checkbox