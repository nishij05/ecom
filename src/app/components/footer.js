"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo & Description */}
        <div className="text-center md:text-left">
          <img
            src="/logo_big.png"
            alt="Shopify Logo"
            className="w-24 mx-auto md:mx-0 mb-3"
          />
          <h3 className="text-2xl font-extrabold tracking-wide">SHOPIFY</h3>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">
            Your trusted fashion partner for quality, trend, and confidence.
          </p>
        </div>

        {/* Explore Links */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold mb-4 text-yellow-400 uppercase tracking-wider">
            Explore
          </h4>
          <ul className="space-y-3 text-sm text-gray-300">
            {["Company", "Products", "About", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-yellow-400 transition-colors duration-200"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold mb-4 text-yellow-400 uppercase tracking-wider">
            Support
          </h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Shipping & Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social Icons */}
        <div className="text-center md:text-left">
          <h4 className="text-lg font-semibold mb-4 text-yellow-400 uppercase tracking-wider">
            Follow Us
          </h4>
          <div className="flex justify-center md:justify-start gap-5">
            {[
              { icon: "/instagram_icon.png", alt: "Instagram" },
              { icon: "/pintester_icon.png", alt: "Pinterest" },
              { icon: "/whatsapp_icon.png", alt: "WhatsApp" },
            ].map((social) => (
              <img
                key={social.alt}
                src={social.icon}
                alt={social.alt}
                className="w-8 h-8 hover:scale-110 transition-transform duration-200 cursor-pointer invert"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-5 border-t border-gray-800 pt-3 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Shopify. All rights reserved.
      </div>
    </footer>
  );
}
