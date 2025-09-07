// In MainAbout.jsx
import { Home, ChevronRight } from "lucide-react";
import Navbar from '../ToperFooter/Navbar'
import {WhatWeDone} from './WhatWeDone'
import { TeamSection } from './TeamSection'  // Changed to named import
import {CTASection} from './CTASection'
import Footer from '../ToperFooter/Footer'
import { BreadCrumb } from '../ToperFooter/BreadCrumb'
import { OurMission } from './OurMission'
import { About } from './About'  // Added missing import


export default function MainAbout() {
  return (
    <div className="min-h-screen bg-blue-100">
     
      <BreadCrumb content="About Us" icon1={Home} icon2={ChevronRight} />
      <About />
      <WhatWeDone />
      <OurMission />
      <TeamSection />
      <CTASection />
      <Footer />
    </div>
  )
}