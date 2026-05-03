import React from "react";
import logo from "../assets/logo.png";
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa6";
import toast from "react-hot-toast";

// 🔹 Organized footer link data
const footerLinks = {
  Shop: [
    { name: "Men", href: "/shop/men" },
    { name: "Women", href: "/shop/women" },
    { name: "Kids", href: "/shop/kids" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
  ],
  Support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Shipping", href: "/shipping" },
  ],
};

// 🔹 Social media links
const socialLinks = [
  {
    icon: FaFacebook,
    href: "https://facebook.com",
    color: "hover:text-blue-500",
  },
  {
    icon: FaInstagram,
    href: "https://instagram.com",
    color: "hover:text-pink-500",
  },
  { icon: FaTiktok, href: "https://tiktok.com", color: "hover:text-gray-200" },
  { icon: FaTwitter, href: "https://twitter.com", color: "hover:text-sky-400" },
];

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("Subscribed successfully!");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 mt-6 shadow-md text-gray-300">
      {/* 🔹 Logo + Slogan */}
      <div className="flex flex-col items-center justify-center py-6 px-4">
        <img
          src={logo}
          alt="SneakerZone logo"
          loading="lazy"
          className="w-28 sm:w-36 mb-2"
        />
        <p className="italic text-gray-400 text-sm sm:text-base">
          "Kickstart Your Style"
        </p>
      </div>

      {/* 🔹 Footer Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 text-center gap-y-8 sm:gap-4 mb-6 px-4 sm:px-10">
        {Object.entries(footerLinks).map(([title, items]) => (
          <div key={title} className="space-y-1">
            <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
            {items.map(({ name, href }) => (
              <a
                key={name}
                href={href}
                className="block text-gray-400 hover:text-white transition"
                aria-label={name}
              >
                {name}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* 🔹 Newsletter */}
      <div className="text-center px-4 sm:px-0 mb-6">
        <p className="text-gray-300 text-sm sm:text-base mb-3">
          Subscribe to our Newsletter
        </p>
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row justify-center items-center gap-2"
        >
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="w-full sm:w-64 px-3 py-2 rounded-md outline-none border border-gray-500 bg-gray-800 text-gray-200 placeholder-gray-400"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-md w-full sm:w-auto"
            aria-label="Subscribe to newsletter"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* 🔹 Social Icons */}
      <div className="flex justify-center items-center gap-6 sm:gap-10 pb-4">
        {socialLinks.map(({ icon: Icon, href, color }, idx) => (
          <a
            key={idx}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit our ${href.split(".")[1]} page`}
          >
            <Icon className={`w-6 h-6 ${color} transition cursor-pointer`} />
          </a>
        ))}
      </div>

      {/* 🔹 Back to Top */}
      <div className="text-center mb-4">
        <button
          onClick={scrollToTop}
          className="text-gray-400 hover:text-white text-sm transition"
          aria-label="Back to top"
        >
          ↑ Back to top
        </button>
      </div>

      {/* 🔹 Copyright */}
      <div className="text-gray-500 text-center py-4 border-t border-gray-700 text-sm">
        © {new Date().getFullYear()} SneakerZone.com — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
