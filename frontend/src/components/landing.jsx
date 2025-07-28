import React from "react";

const LandingPage = () => {
  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-[#801A1A] text-white shadow-md">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <img
            src="/eaglelionLogo.svg"
            alt="EagleLion Logo"
            className="h-10 w-10 object-contain bg-white p-1 rounded-full"
          />
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-sm font-medium">
          <li>
            <a href="#about" className="hover:text-gray-300 transition">
              About
            </a>
          </li>
          <li>
            <a href="#services" className="hover:text-gray-300 transition">
              Services
            </a>
          </li>
          <li>
            <a href="#portfolio" className="hover:text-gray-300 transition">
              Portfolio
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-gray-300 transition">
              Contact
            </a>
          </li>
        </ul>
      </nav>

      <section
        className="relative h-screen flex flex-col justify-center items-center text-center px-4 text-white"
        style={{
          backgroundImage: "url('/eaglelion1.jpeg')", // Replace with actual image path
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay: darken background, right end bright */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Darken the whole background slightly */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0,0,0,0.45)",
            }}
          ></div>
          {/* Right end strong but not harsh shine */}
          <div
            className="absolute inset-y-0 right-0 w-full"
            style={{
              background:
                "linear-gradient(to left, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.25) 30%, transparent 60%)",
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">
            Welcome to EagleLion Task Management Platform
          </h1>
          <p className="text-xl mb-6">
            Simplify your workflows and achieve better productivity with
            EagleLion’s advanced, user-friendly task management system.
          </p>
          <a href="/login">
            <button className="px-8 py-3 bg-[#F6C026] text-[#801A1A] font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition duration-300">
              Get Started
            </button>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">About Us</h2>
          <p className="text-lg max-w-3xl mx-auto">
            EagleLion System Technology is a leading provider of IT solutions
            and system integration in Ethiopia. Our mission is to deliver
            secure, scalable, and intelligent systems tailored to the needs of
            businesses and institutions.{" "}
            <a
              href="https://www.eaglelionsystems.com"
              className="text-[#801A1A] hover:underline"
            >
              Learn more
            </a>
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
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
                title: "Training & Capacity Building",
                desc: "Empowering professionals through hands-on technical training.",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Our Portfolio</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Explore recent projects that reflect our commitment to innovation,
            reliability, and impact.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Smart Identity System</h3>
              <p className="text-gray-600">
                A national-scale biometric and identity verification solution
                improving access to secure digital services.
              </p>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Educational MIS Platform
              </h3>
              <p className="text-gray-600">
                A tailored school management system streamlining reporting,
                evaluation, and digital learning delivery.
              </p>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">
                Enterprise IT Automation
              </h3>
              <p className="text-gray-600">
                Automation solutions for repetitive business tasks, reducing
                errors and saving operational time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Contact Us</h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Connect with our team for service inquiries, partnership
            opportunities, or technical support.
          </p>
          <div className="flex flex-col items-center space-y-3">
            <p className="text-lg font-semibold">
              📍Chirkos 08, ELILTA LUXURY APARTMENTS, 09, Addis Ababa
            </p>
            <p className="text-lg font-semibold">📞 Phone: (251) 933-03-0116</p>
            <p className="text-lg font-semibold">
              📧 Email:{" "}
              <a
                href="mailto:info@eaglelionsystems.com"
                className="text-[#801A1A] hover:underline"
              >
                info@eaglelionsystems.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-[#801A1A] text-white text-center">
        <p>
          © {new Date().getFullYear()} EagleLion System Technology. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
