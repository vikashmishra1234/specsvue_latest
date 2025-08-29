"use client"
import React, { useState } from 'react'
import {FaSearch} from 'react-icons/fa'

const HeaderSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
  return (
   
            <div className="relative  w-full">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-4 py-2 pl-3 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute inset-y-0 right-0 px-3 flex items-center">
                <FaSearch className="text-gray-400" />
              </button>
            </div>
         
  )
}

export default HeaderSearch