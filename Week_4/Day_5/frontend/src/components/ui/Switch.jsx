import { useState } from "react"

const Switch = ({ checked = false, onCheckedChange }) => {
  const [isChecked, setIsChecked] = useState(checked)

  const toggle = () => {
    const newVal = !isChecked
    setIsChecked(newVal)
    onCheckedChange?.(newVal)
  }

  return (
    <button
      onClick={toggle}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors
        ${isChecked ? "bg-green-500" : "bg-gray-400"}`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform
          ${isChecked ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  )
}

export default Switch
