import ServiceCard from "./ServiceCard";

const ServiceSection = () => {
  const services = [
    {
      title: "Academic Roadmapping",
      description:
        "We help students create personalized academic paths aligned with their goals, strengths, and learning styles for long-term success.",
      icon: "strategy",
      variant: "light",
    },
    {
      title: "Goal Tracking & Feedback",
      description:
        "Our tools enable students and mentors to set clear learning goals, track progress, and give constructive feedback throughout the journey.",
      icon: "goal",
      variant: "light",
    },
    {
      title: "Study Resource Planning",
      description:
        "EduSolve offers curated study plans, notes, and assessments to help students stay organized and prepared throughout the academic year.",
      icon: "investment",
      variant: "light",
    },
    {
      title: "Performance Insights",
      description:
        "Track student performance with detailed analytics that help identify strengths, weak areas, and guide timely interventions.",
      icon: "stats",
      variant: "light",
    },
    {
      title: "Live Doubt Sessions",
      description:
        "Connect students with educators in real time to clear doubts, strengthen understanding, and boost confidence before assessments.",
      icon: "events",
      variant: "light",
    },
    {
      title: "One-on-One Guidance",
      description:
        "Book consultation sessions with experienced mentors and educators for academic advice, career guidance, and emotional support.",
      icon: "phone",
      variant: "light",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-blue-900 rounded"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            How EduSolve Helps
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            EduSolve empowers students, teachers, and parents with{" "}
            <span className="font-semibold text-gray-800">smart academic tools</span> and{" "}
            <span className="font-semibold text-gray-800">personalized support</span> for improved learning outcomes.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              variant={service.variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
