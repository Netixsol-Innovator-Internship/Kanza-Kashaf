const Button = ({ children, onClick, disabled, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors
        ${disabled
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white"}
        ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
