import { Target, Eye, Award } from "lucide-react"

export function OurMission() {
  const values = [
  {
      icon: Target,
      title: "Our Mission",
      description:
        "To empower students and educators with accessible, innovative, and personalized learning solutions that foster academic growth and success.",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To be a trusted educational platform that transforms how students learn and how teachers teach—driven by technology, insight, and a passion for progress.",
    },
    {
      icon: Award,
      title: "Our Values",
      description:
        "Commitment to learning, integrity in service, innovation in approach, and a deep focus on student and teacher success form the core of EduSolver.",
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-6">Our Foundation</h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
             Rooted in strong educational principles and driven by the desire to make learning effective, we guide every learner and educator toward lasting success.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {values.map((value, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transform group-hover:scale-105 transition-all duration-300">
                <value.icon className="w-10 h-10 text-blue-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
