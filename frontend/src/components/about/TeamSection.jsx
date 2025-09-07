import { Linkedin, Twitter, Mail } from "lucide-react"

// Import team member images
import img1 from "../../assets/Img/t1.jpg"
import img2 from "../../assets/Img/t2.jpg"
import img3 from "../../assets/Img/t3.jpg"
import img4 from "../../assets/Img/t4.jpg"
import img5 from "../../assets/Img/t5.png"

export function TeamSection() {
  const team = [
    {
      name: "Bijendra Karki",
      role: "CEO",
      image: img1,
      bio: "3+ years in Development planning and investment strategies",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "bijendra@company.com",
      },
    },
    {
      name: "Kiran Pokhrel",
      role: "Business Consultant",
      image: img2,
      bio: "Expert in business development and strategic planning",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "kiran@company.com",
      },
    },
    {
      name: "Pratek Devkota",
      role: "UI/UX Designer",
      image: img3,
      bio: "Committed to solving complex problems through user-centered design principles",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "pratek@company.com",
      },
    },
    {
      name: "Sunni Khanal",
      role: "Education Coach",
      image: img4,
      bio: "Certified coach specializing in academic development",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sunni@company.com",
      },
    },
    {
      name: "Rajendra Khadel",
      role: "Operational Advisor",
      image: img5,
      bio: "Skilled in cross-functional collaboration, risk management, and performance analysis to ensure streamlined operations",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "rajendra@company.com",
      },
    },
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-6">Meet Our Expert Team</h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Our diverse team of professionals brings decades of combined experience to help you succeed
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={`${member.name} - ${member.role}`}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
                <div className="flex space-x-3">
                  <a
                    href={member.social.linkedin}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label={`${member.name}'s LinkedIn profile`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={`${member.name}'s Twitter profile`}
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
