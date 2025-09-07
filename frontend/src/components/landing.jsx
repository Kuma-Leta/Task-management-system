import React from "react";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contact", label: "Contact" },
];

const SERVICES = [
  {
    title: "System Integration",
    desc: "Designing and delivering integrated IT infrastructure that meets enterprise needs.",
  },
  {
    title: "Network & Security Solutions",
    desc: "Securing and managing IT environments with modern tools and best practices.",
  },
  {
    title: "Software Development",
    desc: "Developing custom platforms tailored to business processes and productivity.",
  },
  {
    title: "Technical Support",
    desc: "Ongoing system maintenance, troubleshooting, and support for your operations.",
  },
  {
    title: "IT Consultancy",
    desc: "Providing expert guidance to align IT with your organizational goals.",
  },
  {
    title: "Training & Capacity Building ",
    desc: "Empowering professionals through hands-on technical training.",
  },
];

const PORTFOLIO = [
  {
    title: "Smart Identity System",
    desc: "A national-scale biometric and identity verification solution improving access to secure digital services.",
  },
  {
    title: "Educational MIS Platform",
    desc: "A tailored school management system streamlining reporting, evaluation, and digital learning delivery.",
  },
  {
    title: "Enterprise IT Automation",
    desc: "Automation solutions for repetitive business tasks, reducing errors and saving operational time.",
  },
];

const LandingPage = () => {
  return (
    <div className="font-sans bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-800 min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 flex justify-between items-center px-8 py-4 bg-[#801A1A] text-white shadow-lg backdrop-blur-md bg-opacity-95">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <img
            src="/eaglelionLogo.svg"
            alt="EagleLion Logo"
            className="h-12 w-12 object-contain bg-white p-1.5 rounded-full shadow-lg"
          />
          <span className="hidden sm:inline text-2xl font-bold tracking-wide drop-shadow-md">
            EagleLion
          </span>
        </div>
        {/* Navigation Links */}
        <ul className="flex space-x-2 sm:space-x-6 text-base font-medium">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="px-3 py-2 rounded-md transition-all duration-200 hover:bg-[#F6C026] hover:text-[#801A1A] focus:outline-none focus:ring-2 focus:ring-[#F6C026]"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero Section */}
      <section
        className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-4 text-white"
        style={{
          backgroundImage: "url('/eaglelion1.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay: darken background, right end bright */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.5)",
            }}
          ></div>
          <div
            className="absolute inset-y-0 right-0 w-full"
            style={{
              background:
                "linear-gradient(to left, rgba(246,192,38,0.18) 0%, rgba(255,255,255,0.18) 30%, transparent 60%)",
            }}
          ></div>
        </div>
        {/* Content */}
        <div className="relative z-10 max-w-3xl flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 drop-shadow-lg leading-tight">
            Welcome to <span className="text-[#F6C026]">EagleLion</span> Task
            Management Platform
          </h1>
          <p className="text-lg sm:text-xl mb-8 font-medium drop-shadow">
            Simplify your workflows and achieve better productivity with
            <span className="font-semibold text-[#F6C026]">
              {" "}
              EagleLion’s
            </span>{" "}
            advanced, user-friendly task management system.
          </p>
          <a href="/login">
            <button className="px-10 py-3 bg-[#F6C026] text-[#801A1A] font-bold rounded-full shadow-xl hover:bg-yellow-300 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#801A1A]">
              Get Started
            </button>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#801A1A] tracking-tight">
            About Us
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-700 leading-relaxed">
            EagleLion System Technology is a leading provider of IT solutions
            and system integration in Ethiopia. Our mission is to deliver
            secure, scalable, and intelligent systems tailored to the needs of
            businesses and institutions.{" "}
            <a
              href="https://www.eaglelionsystems.com"
              className="text-[#801A1A] font-semibold underline underline-offset-2 hover:text-[#F6C026] transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 bg-gradient-to-b from-gray-100 via-white to-gray-100"
      >
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#801A1A] tracking-tight">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {SERVICES.map(({ title, desc }) => (
              <div
                key={title}
                className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-200 group"
              >
                <h3 className="text-xl font-bold mb-3 text-[#801A1A] group-hover:text-[#F6C026] transition">
                  {title}
                </h3>
                <p className="text-gray-600 text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#801A1A] tracking-tight">
            Our Portfolio
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto mb-10 text-gray-700">
            Explore recent projects that reflect our commitment to innovation,
            reliability, and impact.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO.map(({ title, desc }) => (
              <div
                key={title}
                className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-200"
              >
                <h3 className="text-xl font-bold mb-3 text-[#801A1A]">
                  {title}
                </h3>
                <p className="text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-b from-gray-100 via-white to-gray-100"
      >
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#801A1A] tracking-tight">
            Contact Us
          </h2>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 text-gray-700">
            Connect with our team for service inquiries, partnership
            opportunities, or technical support.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg font-semibold flex items-center gap-2">
              <span role="img" aria-label="location">
                📍
              </span>
              <span>Chirkos 08, ELILTA LUXURY APARTMENTS, 09, Addis Ababa</span>
            </p>
            <p className="text-lg font-semibold flex items-center gap-2">
              <span role="img" aria-label="phone">
                📞
              </span>
              <span>Phone: (251) 933-03-0116</span>
            </p>
            <p className="text-lg font-semibold flex items-center gap-2">
              <span role="img" aria-label="email">
                📧
              </span>
              <span>
                Email:{" "}
                <a
                  href="mailto:info@eaglelionsystems.com"
                  className="text-[#801A1A] underline underline-offset-2 hover:text-[#F6C026] transition"
                >
                  info@eaglelionsystems.com
                </a>
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#801A1A] text-white text-center shadow-inner">
        <p className="text-base font-medium tracking-wide">
          © {new Date().getFullYear()} EagleLion System Technology. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
