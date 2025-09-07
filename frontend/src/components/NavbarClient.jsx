"use client"

import Navbar from "./ToperFooter/Navbar"


const navLinks = [
  { path: "/clientPanel", label: "Home" },
  { path: "/cabout", label: "About" },
  { path: "/cservice", label: "Services" },
  { path: "/ccontact", label: "Contact" },
]

function NavbarClient() {
 
  return <Navbar links={navLinks} />
}

export default NavbarClient
