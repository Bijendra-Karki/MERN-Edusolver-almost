import React from "react";
import { Link } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gradient-to-t from-blue-700 to-blue-900 text-white rounded-b-lg py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">EduSolver</h3>
            <p className="text-blue-100">
              Professional IT Student Career Booster.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-blue-100">
              <li><Link to="/doubt-solving" className="hover:text-white transition-colors">Doubt-Solving</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              <li><Link to="/engagement" className="hover:text-white transition-colors">Engagement & Preparation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-blue-100">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/team" className="hover:text-white transition-colors">Our Team</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <div className="text-blue-100 font-semibold space-y-2">
              <p className="flex items-center gap-2"><FaPhone /> 9812855741</p>
              <p className="flex items-center gap-2"><FaEnvelope /> edusolver@171gmail.com</p>
              <p className="flex items-start gap-2">
                <FaMapMarkerAlt />
                <span>
                  Lumbini Province, Nepal<br />
                  Dang-2400, Ghorahi
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mt-10">
          <a href="#" aria-label="Facebook" className="hover:text-white text-2xl"><FaFacebook /></a>
          <a href="#" aria-label="Instagram" className="hover:text-white text-2xl"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-white text-2xl"><FaLinkedin /></a>
        </div>

        {/* Copyright */}
        <div className="border-t border-white mt-10 pt-6 text-center text-blue-100 font-semibold text-sm">
          <p>&copy; {new Date().getFullYear()} EduSolver. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
