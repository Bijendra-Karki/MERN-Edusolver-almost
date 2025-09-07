import { CircleIcon } from "../about/CircleIcon"

const ServiceCard = ({ title, description, icon, variant = "light" }) => {
  const isDark = variant === "dark"

  return (
    <div
      className={`rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-8 text-center group ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Orange Circle Icon */}
      <div className="flex justify-center mb-6">
        <CircleIcon icon={icon} />
      </div>

      {/* Title */}
      <h3 className={`text-xl font-bold mb-4 ${isDark ? "text-blue-400" : "text-gray-900"}`}>{title}</h3>

      {/* Description */}
      <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>{description}</p>
    </div>
  )
}

export default ServiceCard