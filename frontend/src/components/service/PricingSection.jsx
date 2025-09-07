import { useState } from 'react'
import { Check, Star, ArrowRight } from 'lucide-react'

const PricingCard = ({ 
  title, 
  price, 
  period, 
  features, 
  variant = 'orange', 
  buttonText = 'Get Started',
  isPopular = false,
  onButtonClick,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const isDark = variant === 'dark'
  const isOrange = variant === 'blue'

  const cardClasses = `
    relative transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
    ${isHovered ? 'translate-y-[-8px]' : ''}
    ${className}
  `

  const headerClasses = `
    relative rounded-t-lg px-8 py-6 text-center
    ${isDark ? 'bg-gray-800 text-white' : 'bg-blue-900 text-white'}
  `

  const bodyClasses = `
    bg-white rounded-b-lg px-8 py-8 shadow-lg
    ${isDark ? 'border-t-2 border-gray-700' : 'border-t-2 border-blue-900'}
  `

  const buttonClasses = `
    w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 
    flex items-center justify-center group
    ${isDark 
      ? 'bg-gray-800 text-white hover:bg-gray-700 hover:shadow-lg' 
      : 'bg-blue-900 text-white hover:bg-orange-600 hover:shadow-lg'
    }
  `

  return (
    <div 
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current" />
            Most Popular
          </div>
        </div>
      )}

    
     
      {/* Header */}
      <div className={headerClasses}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-blue-400' : 'text-white'}`}>
          {title}
        </h3>
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-lg ml-1 opacity-90">{period}</span>
        </div>
      </div>

      {/* Body */}
      <div className={bodyClasses}>
        {/* Features */}
        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-gray-600">
              <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Button */}
        <button 
          className={buttonClasses}
          onClick={() => onButtonClick && onButtonClick(title, price)}
        >
          {buttonText}
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      {/* Bottom Accent Line */}
      <div className={`h-1 rounded-b-lg ${isDark ? 'bg-gray-700' : 'bg-blue-900'}`} />
    </div>
  )
}

const PricingSection = ({ 
  title = "Pricing",
  subtitle = "No any extra hidden fees.",
  plans = [],
  onPlanSelect,
  className = ""
}) => {
  const defaultPlans = [
    {
      title: "Business Consulting",
      price: "$25",
      period: "/hour",
      features: [
        "Business Strategy",
        "Stock Market",
        "Investing Plan", 
        "Business Plan",
        "Loan and Finance",
        "24/7 Support"
      ],
      variant: "orange",
      buttonText: "Get Started"
    },
    {
      title: "Life Coach",
      price: "$299", 
      period: "/month",
      features: [
        "Loan and Finance",
        "24/7 Support",
        "Business Strategy",
        "Stock Market", 
        "Investing Plan",
        "Business Plan",
        "Loan and Finance",
        "24/7 Support"
      ],
      variant: "dark",
      buttonText: "Get Started",
      isPopular: true
    },
    {
      title: "Stock Market Consulting",
      price: "$99",
      period: "/day", 
      features: [
        "Business Strategy",
        "Stock Market",
        "Investing Plan",
        "Business Plan", 
        "Loan and Finance",
        "24/7 Support"
      ],
      variant: "orange",
      buttonText: "Get Started"
    }
  ]

  const pricingPlans = plans.length > 0 ? plans : defaultPlans

  const handlePlanSelect = (planTitle, price) => {
    if (onPlanSelect) {
      onPlanSelect({ title: planTitle, price })
    } else {
      console.log(`Selected plan: ${planTitle} - ${price}`)
    }
  }

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-blue-500 rounded" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              variant={plan.variant}
              buttonText={plan.buttonText}
              isPopular={plan.isPopular}
              onButtonClick={handlePlanSelect}
              className={index === 1 ? 'md:mt-[-20px]' : ''} // Elevate center card
            />
          ))}
        </div>

        
      </div>
    </section>
  )
}

export default PricingSection