import axios from "axios";
import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

const Contact = () => {
  const[contactData,setContactData] = useState({});
  const [loading,setLoading]= useState(false)

const handleContactForm = async (e: any) => {
  e.preventDefault();
  try {
    setLoading(true)
    const res = await axios.post("/api/contact-form", contactData);

    if (res.status === 200) {
      Swal.fire({
        title: "Message Sent!",
        text: "Thank you for contacting us. We’ll get back to you soon.",
        icon: "success",
        confirmButtonColor: "#1e40af", // nice blue tone
      });

      // Optional: clear form after submission
      setContactData({});
      e.target.reset();
    } else {
      Swal.fire({
        title: "Failed!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#1e40af",
      });
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error!",
      text: "Unable to send your message. Please try again.",
      icon: "error",
      confirmButtonColor: "#1e40af",
    });
  }
  finally{
    setLoading(false)
  }
};

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
            <p id="contact-us" className="text-gray-300 mb-8">
              Have questions about our products or services? Our team is here to
              help. Reach out to us through any of the channels below.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: "📍",
                  title: "Visit Our Store",
                  info: "Plot no. 1 Krishna Vihar, BSA Engineering College Rd, near Old Police Chowki, Avas Vikas Colony, Mathura, Uttar Pradesh 281004",
                },
                { icon: "📞", title: "Call Us", info: "+91 8630111264" },
                { icon: "✉️", title: "Email Us", info: "specsvue@gmail.com" },
                {
                  icon: "⏰",
                  title: "Opening Hours",
                  info: "Monday - Sunday: 10am - 9pm",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-900 text-white flex items-center justify-center text-xl">
                    {item.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 whitespace-pre-line">
                      {item.info}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex space-x-4">
              {[
                {
                  href: "https://www.instagram.com/specsvue_",
                  label: "Instagram",
                  icon: <Instagram size={20} />,
                },
                {
                  href: "https://facebook.com/specsvue",
                  label: "Facebook",
                  icon: <Facebook size={20} />,
                },
                {
                  href: "https://youtube.com/@specsvue?si=BsrQMbVLQ2wb9U_-",
                  label: "YouTube",
                  icon: <Youtube size={20} />,
                },
                {
                  href: "https://www.linkedin.com/in/specsvue-%F0%9F%91%93-3a0402306",
                  label: "LinkedIn",
                  icon: <Linkedin size={20} />,
                },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={social.href}
                  target="__blank"
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
            <form onSubmit={handleContactForm} className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-xl shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-white mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    onChange={(e)=>setContactData({...contactData,firstName:e.target.value})}
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-white mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    onChange={(e)=>setContactData({...contactData,lastName:e.target.value})}
                    id="last-name"
                    className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-white mb-1"
                >
                Phone Number
                </label>
                <input
                  type="Phone"
                  onChange={(e)=>setContactData({...contactData,phone:e.target.value})}
                  id="phone"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  placeholder="9745xxxxxx"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  onChange={(e)=>setContactData({...contactData,subject:e.target.value})}
                  id="subject"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  placeholder="Product inquiry"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  onChange={(e)=>setContactData({...contactData,message:e.target.value})}
                  rows={4}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 text-white placeholder-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  placeholder="Write your message..."
                  required
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                disabled = {loading}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-3 bg-blue-800 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all"
              >
                {
                  loading?"Sending Message...":'Send Message'
                }
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
