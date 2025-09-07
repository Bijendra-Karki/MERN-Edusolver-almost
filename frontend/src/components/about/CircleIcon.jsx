import { BarChart3, Target, DollarSign, TrendingUp, Users, Phone } from 'lucide-react'

export const CircleIcon = ({ icon }) => {
  const getIcon = () => {
    switch (icon) {
      case "Roadmap":
        return <BarChart3 className="w-8 h-8 text-blue-900" />
      case "goal":
        return <Target className="w-8 h-8 text-blue-900" />
      case "Resource":
        return <DollarSign className="w-8 h-8 text-white" />
      case "insights":
        return <TrendingUp className="w-8 h-8text-blue-900" />
      case "doubt":
        return <Users className="w-8 h-8 text-blue-900" />
      case "guide":
        return <Phone className="w-8 h-8 text-blue-900" />
      default:
        return <BarChart3 className="w-8 h-8 text-blue-900" />
    }
  }

  return (
    <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
      {getIcon()}
    </div>
  )
}