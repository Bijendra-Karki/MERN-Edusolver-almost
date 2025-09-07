import { ArrowRight } from "lucide-react"
import img from '../../assets/Img/0.png'
import img1 from '../../assets/Img/img1.jpg'


const HowWeWorkSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-2 bg-blue-900 rounded"></div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">How EduSolver Works</h2>
              <p className="text-lg text-gray-400">Our Approach to Student Success</p>
            </div>

            <p className="text-gray-300 leading-relaxed text-lg">
              At EduSolver, we follow a student-centered approach that blends technology, mentorship, and evaluation.
              Our platform connects learners with the right resources and guidance—from quizzes and doubt-solving to personalized support—
              helping them grow confidently in their academic journey.
            </p>

            <button className="bg-blue-900 hover:bg-blue-900  text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center group">
              Learn More
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Right Content - Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt="Online mentoring"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={img1}
                  alt="Learning platform interface"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowWeWorkSection
