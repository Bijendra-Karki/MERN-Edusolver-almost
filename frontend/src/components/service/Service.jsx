import React from 'react';
import { Home, ChevronRight } from "lucide-react";
import {BreadCrumb} from '../ToperFooter/BreadCrumb'; // ✅ Add this missing import
import ServiceHowWeWork from './ServiceHowWeWork';
import ServiceSection from './ServiceSection';
import PricingSection from './PricingSection';
import Footer from '../ToperFooter/Footer';


function Service() {
  return (
    <>
     
      <BreadCrumb content="Service" icon1={Home} icon2={ChevronRight} />
      <ServiceSection />
      <ServiceHowWeWork />
      <PricingSection 
        plans={[
          {
            title: "Starter",
            price: "$1",
            period: "/month",
            features: ["Feature 1", "Feature 2", "Feature 2"],
            variant: "blue"
          },
          {
            title: "Pro",
            price: "$12",
            period: "/yearly",
            features: ["All Starter features", "Feature 3", "Feature 4", "Feature 5"],
            variant: "dark",
            isPopular: true
          },
          {
            title: "Pro",
            price: "$4",
            period: "/quarter month",
            features: ["All Starter features", "Feature 3", "Feature 4"],
            variant: "blue"
          }
        ]}
      />
      <Footer />
    </>
  );
}

export default Service;
