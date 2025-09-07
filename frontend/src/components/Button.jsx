import React from 'react'

function Button(props) {
  const { label, onClick, disabled, icon, className = "", size = "default", variant = "primary" } = props

  // Size variants
  const sizeClasses = {
    small: "px-2 py-1 text-xs sm:text-sm",
    default: "px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base",
    large: "px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg"
  }

  // Variant styles
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-600 hover:to-blue-700 
      text-white border-2 border-white shadow-blue-500/25
    `,
    secondary: `
      bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 
      text-white border-2 border-gray-300 shadow-gray-500/25
    `,
    outline: `
      bg-transparent hover:bg-blue-50 
      text-blue-700 border-2 border-blue-700 hover:border-blue-600 shadow-blue-500/10
    `
  }

  return (
    <button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        rounded-lg sm:rounded-xl font-semibold cursor-pointer
        transition-all duration-300 shadow-lg
        hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]
        active:translate-y-0 active:scale-[0.98] active:duration-75
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg
        flex items-center justify-center gap-1 sm:gap-2 relative overflow-hidden
        before:absolute before:inset-0 
        before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
        before:translate-x-[-100%] before:transition-transform before:duration-700
        hover:before:translate-x-[100%]
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
        min-w-0 whitespace-nowrap
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="relative z-10 flex items-center gap-1 sm:gap-2 truncate">
        {icon && (
          <span className="flex-shrink-0 text-sm sm:text-base lg:text-lg">
            {icon}
          </span>
        )}
        <span className="truncate">{label}</span>
      </span>
    </button>
  )
}

export default Button