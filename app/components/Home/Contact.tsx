import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side: Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 bg-blue-900 text-white rounded-full text-sm font-medium mb-4 tracking-wide">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Contact Us
            </h2>
            <p className="text-gray-300 mb-8">
              Have questions about our products or services? Our team is here to help. Reach out to us through any of the channels below.
            </p>

            <div className="space-y-5">
              {[
                { icon: "📍", title: "Visit Our Store", info: "Plot no. 1 Krishna Vihar, BSA Engineering College Rd, near Old Police Chowki, Avas Vikas Colony, Mathura, Uttar Pradesh 281004" },
                { icon: "📞", title: "Call Us", info: "+1 (555) 123-4567" },
                { icon: "✉️", title: "Email Us", info: "info@specsvue.com" },
                { icon: "⏰", title: "Opening Hours", info: "Monday - Friday: 9am - 6pm\nSaturday: 10am - 4pm\nSunday: Closed" }
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-900 text-white flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">{item.title}</h3>
                    <p className="text-gray-400 whitespace-pre-line">{item.info}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex space-x-4">
              {[
                { href: "#", label: "Instagram", icon: <Instagram size={20} /> },
                { href: "#", label: "Facebook", icon: <Facebook size={20} /> },
                { href: "#", label: "Twitter", icon: <Twitter size={20} /> }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={social.href}
                  className="h-10 w-10 rounded-full bg-blue-900 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
           <form className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-xl shadow-md">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
    <div>
      <label htmlFor="first-name" className="block text-sm font-medium text-white mb-1">First Name</label>
      <input
        type="text"
        id="first-name"
        className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
        placeholder="John"
        required
      />
    </div>
    <div>
      <label htmlFor="last-name" className="block text-sm font-medium text-white mb-1">Last Name</label>
      <input
        type="text"
        id="last-name"
        className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
        placeholder="Doe"
        required
      />
    </div>
  </div>

  <div className="mb-6">
    <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email Address</label>
    <input
      type="email"
      id="email"
      className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
      placeholder="you@example.com"
      required
    />
  </div>

  <div className="mb-6">
    <label htmlFor="subject" className="block text-sm font-medium text-white mb-1">Subject</label>
    <input
      type="text"
      id="subject"
      className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
      placeholder="Product inquiry"
      required
    />
  </div>

  <div className="mb-6">
    <label htmlFor="message" className="block text-sm font-medium text-white mb-1">Message</label>
    <textarea
      id="message"
      rows={4}
      className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
      placeholder="Write your message..."
      required
    ></textarea>
  </div>

  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    type="submit"
    className="w-full px-6 py-3 bg-blue-800 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all"
  >
    Send Message
  </motion.button>
</form>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
