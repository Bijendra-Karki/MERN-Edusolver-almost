import { Check } from 'lucide-react'
import Image from '../../assets/Img/img1.jpg'
export function About() {
  return (
    <section className="py-20 bg-blue-100 ">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">About EduSolver</h1>
              <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                <p>
                  EduSolver is an innovative <strong className="text-gray-900">educational platform</strong> designed to help students and educators with comprehensive learning solutions and academic support.
                </p>
                <p>
                  Our <strong className="text-gray-900">mission</strong> is to bridge the gap between traditional learning and modern technology, providing tools and resources that enhance the educational experience for everyone.
                </p>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { name: "Tutoring", icon: Check },
                { name: "Homework Help", icon: Check },
                { name: "Test Prep", icon: Check },
                { name: "Study Tools", icon: Check },
              ].map((service, index) => (
                <div key={index} className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-200">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-800 font-semibold text-lg">{service.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Experience Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={Image} 
                alt="Students collaborating on educational projects"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-8xl font-bold text-blue-400 mb-4 drop-shadow-lg">5</div>
                  <div className="text-2xl font-semibold drop-shadow-md">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}