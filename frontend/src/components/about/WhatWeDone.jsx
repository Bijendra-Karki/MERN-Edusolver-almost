export function WhatWeDone() {
  const stats = [
    { number: "40", label: "Projects Completed" },
    { number: "40", label: "Happy Clients" },
    { number: "97", label: "Success Rate" },
    { number: "90", label: "Awards Won" },
  ]

  return (
    <section className="bg-blue-900 text-white py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold mb-6">What We've Accomplished</h2>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            At EduSolver, we’re committed to helping you discover the best path to reach your goals and elevate your educational journey.
          </p>

        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-6xl md:text-7xl font-bold text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-300 text-lg font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
