import React from "react";

const LandingPage = () => {
  return (
    <div className="font-sans bg-gray-100 text-gray-800">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-[#801A1A] text-white">
        <div className="text-lg font-semibold">EagleLion System Technology</div>
        <ul className="flex space-x-6">
          <li>
            <a href="#about" className="hover:text-gray-300">
              About
            </a>
          </li>
          <li>
            <a href="#services" className="hover:text-gray-300">
              Services
            </a>
          </li>
          <li>
            <a href="#portfolio" className="hover:text-gray-300">
              Portfolio
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-gray-300">
              Contact
            </a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-[#801A1A] text-white h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to EagleLion Task Management Platform
        </h1>
        <p className="text-xl mb-6 max-w-2xl">
          Simplify your workflows and achieve better productivity with
          EagleLion’s advanced, user-friendly task management system.
        </p>
        <a href="/login">
          <button className="px-8 py-3 bg-white text-[#801A1A] font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
            Get Started
          </button>
        </a>
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
              📍 Location: Bishoftu, Ethiopia
            </p>
            <p className="text-lg font-semibold">📞 Phone: +251 9XX-XXX-XXX</p>
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
