

import { motion } from "framer-motion"

const Feature = () => {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Why Choose SpecsVue?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              We combine premium materials, cutting-edge technology, and expert craftsmanship to create eyewear that
              enhances your vision and style.
            </motion.p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Materials",
                description:
                  "Our frames are crafted from high-quality, durable materials that ensure comfort and longevity.",
                icon: "🔍",
              },
              {
                title: "Advanced Lens Technology",
                description:
                  "Experience crystal clear vision with our anti-glare, UV-protected, and blue light filtering lenses.",
                icon: "✨",
              },
              {
                title: "Expert Craftsmanship",
                description:
                  "Each pair of glasses is meticulously crafted by skilled artisans with decades of experience.",
                icon: "🛠️",
              },
              {
                title: "Personalized Fitting",
                description: "Get a perfect fit with our customization services to ensure maximum comfort all day long.",
                icon: "👓",
              },
              {
                title: "Stylish Designs",
                description: "Stay on trend with our fashion-forward designs that complement your unique style.",
                icon: "🎨",
              },
              {
                title: "Affordable Luxury",
                description: "Enjoy premium quality eyewear at accessible prices with our direct-to-consumer model.",
                icon: "💰",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  

  export default Feature;