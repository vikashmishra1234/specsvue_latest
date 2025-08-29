"use client"
import {motion} from 'framer-motion'
import Image from 'next/image'
import {ChevronRight} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Collections() {
  const router = useRouter()
  
  const handleNavigate = (collectionTitle:string) => {
    // Prevent default behavior and use router.push instead
    router.push(`/collection?type=${collectionTitle}`)
  }
  
  return (
    <section id="collections" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Our Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Explore our diverse range of eyewear collections designed for every face shape, style preference, and visual
            need.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Eyeglasses",
              description: "Stylish frames with premium lenses for everyday vision",
              image: "/images/Eye_Glasses.avif",
              color: "from-blue-500 to-purple-500",
            },
            {
              title: "Sunglasses",
              description: "Protect your eyes with UV-blocking fashionable shades",
              image: "/images/Sunglasses.avif",
              color: "from-purple-500 to-pink-500",
            },
            {
              title: "Screenglasses",
              description: "Reduce eye strain with blue light filtering technology",
              image: "/images/Screenglasses.avif",
              color: "from-pink-500 to-orange-500",
            },
            {
              title: "Contact Lenses",
              description: "Comfortable contacts for clear vision without frames",
              image: "/images/Contact_Lenses.avif",
              color: "from-green-500 to-teal-500",
            },
            {
              title: "Kids Glasses",
              description: "Durable and colorful frames designed for children",
              image: "/images/kids-logo.png",
              color: "from-amber-500 to-red-500",
            },
            {
              title: "Power Sunglasses",
              description: "Prescription sunglasses for clear vision outdoors",
              image: "/images/sunglasses.png",
              color: "from-teal-500 to-green-500",
            },
          ].map((collection, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <Image
                  src={collection.image || "/placeholder.svg"}
                  alt={collection.title}
                  width={300}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-60 transition-opacity duration-300 group-hover:opacity-80`}
              ></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{collection.title}</h3>
                <p className="mb-4 opacity-90">{collection.description}</p>
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate(collection.title);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-full sm:w-10 h-10 rounded-full bg-white text-gray-900 group-hover:w-32 transition-all duration-300 sm:overflow-hidden"
                  type="button"
                >
                  <span className="sm:hidden group-hover:inline mr-1">Explore</span>
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}