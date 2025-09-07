import { ArrowRight, Phone, Mail } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24  px-12 bg-blue-900 text-white mb-6 rounded-t-2xl shadow-lg">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Empower Your Learning Journey with EduSolver</h2>
            <p className="text-orange-100 text-xl mb-8 leading-relaxed">
              Unlock your academic potential with personalized guidance and support. Whether you're a student or an educator, EduSolver is here to make learning smarter and more effective.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center group">
                Join EduSolver Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button className="border-2 border-white  bg-whtext-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors duration-200">
                Talk to a Mentor
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Connect by Phone</p>
                <p className="text-orange-100">+977-9812855741</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Send an Email</p>
                <p className="text-orange-100">edusolver@171gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
