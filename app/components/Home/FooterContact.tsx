"use client"
import axios from "axios";
import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";

const FooterContact = () => {
  const[contactData,setContactData] = useState<any>({});
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
          confirmButtonColor: "#1e40af", 
        });
        setContactData({});
        e.target.reset();
      } else {
        throw new Error("Failed");
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
    <div className="bg-black text-white">
      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Side: Contact Info */}
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-1 bg-blue-900 text-white rounded-full text-sm font-medium mb-4 tracking-wide">
                  Get In Touch
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Contact Us
                </h2>
                <p className="text-gray-400 mb-8 max-w-lg">
                  Have questions about our products or services? Our team is here to
                  help. Reach out to us through any of the channels below.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: <MapPin className="w-5 h-5"/>,
                    title: "Visit Our Store",
                    info: "Plot no. 1 Krishna Vihar, BSA Engineering College Rd, near Old Police Chowki, Avas Vikas Colony, Mathura, Uttar Pradesh 281004",
                  },
                  { icon: <Phone className="w-5 h-5"/>, title: "Call Us", info: "+91 8630111264" },
                  { icon: <Mail className="w-5 h-5"/>, title: "Email Us", info: "specsvue@gmail.com" },
                  { icon: <Clock className="w-5 h-5"/>, title: "Opening Hours", info: "Monday - Sunday: 10am - 9pm" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-900 border border-gray-700 text-blue-400 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 whitespace-pre-line text-sm leading-relaxed">
                        {item.info}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4 pt-4">
                {[
                  { href: "https://www.instagram.com/specsvue_", icon: <Instagram size={20} /> },
                  { href: "https://facebook.com/specsvue", icon: <Facebook size={20} /> },
                  { href: "https://youtube.com/@specsvue?si=BsrQMbVLQ2wb9U_-", icon: <Youtube size={20} /> },
                  { href: "https://www.linkedin.com/in/specsvue-%F0%9F%91%93-3a0402306", icon: <Linkedin size={20} /> },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div>
              <form onSubmit={handleContactForm} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">First Name</label>
                    <input
                      type="text"
                      onChange={(e)=>setContactData({...contactData,firstName:e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      type="text"
                      onChange={(e)=>setContactData({...contactData,lastName:e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel"
                    onChange={(e)=>setContactData({...contactData,phone:e.target.value})}
                     className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="+91"
                    required
                  />
                </div>

                <div className="mb-6">
                   <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                  <input
                    type="text"
                    onChange={(e)=>setContactData({...contactData,subject:e.target.value})}
                     className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="Inquiry"
                    required
                  />
                </div>

                <div className="mb-6">
                   <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    onChange={(e)=>setContactData({...contactData,message:e.target.value})}
                    rows={4}
                     className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="How can we help?"
                    required
                  ></textarea>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full px-6 py-4 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-200 transition-all transform active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="py-16 pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                  <div className="col-span-2 md:col-span-1">
                      <h4 className="text-xl font-bold text-white mb-6">Specsvue</h4>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">
                          Redefining eyewear with premium frames and advanced lens technology. Style meets clarity.
                      </p>
                  </div>
                  
                  <div>
                      <h4 className="text-lg font-bold text-white mb-6">Shop</h4>
                      <ul className="space-y-4 text-sm text-gray-500">
                          <li><Link href="/products" className="hover:text-white transition-colors">Eyeglasses</Link></li>
                          <li><Link href="/products" className="hover:text-white transition-colors">Sunglasses</Link></li>
                          <li><Link href="/contact-lenses" className="hover:text-white transition-colors">Contact Lenses</Link></li>
                          <li><Link href="/products" className="hover:text-white transition-colors">Computer Glasses</Link></li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="text-lg font-bold text-white mb-6">Company</h4>
                      <ul className="space-y-4 text-sm text-gray-500">
                          <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                          <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                          <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                          <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                      </ul>
                  </div>

                  <div>
                      <h4 className="text-lg font-bold text-white mb-6">Support</h4>
                      <ul className="space-y-4 text-sm text-gray-500">
                          <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                          <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                          <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                          <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                      </ul>
                  </div>
              </div>
              
              <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-gray-600 text-sm">
                      &copy; {new Date().getFullYear()} Specsvue. All rights reserved.
                  </p>
                  <div className="flex gap-6 text-sm text-gray-600">
                      <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                      <Link href="/terms" className="hover:text-white">Terms of Use</Link>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default FooterContact;
