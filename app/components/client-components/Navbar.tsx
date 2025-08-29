'use client';
import React, { useState } from 'react';
import EyeglassesCategory from './EyeglassesCategory';
import ScreenGlassesCategory from './ScreenGlasses';
import KidsGlasses from './KidsGlasses';
import ContactLenses from './ContactLenses';
import SunGlassesCategory from './SunGlassesCategory';

const componentMap = {
  eyeglasses: EyeglassesCategory,
  screenglasses: ScreenGlassesCategory,
  kidsglasses: KidsGlasses,
  contactlens: ContactLenses,
  sunglasses: SunGlassesCategory,
};

// Create a type of all keys
type ComponentKey = keyof typeof componentMap;

const Navbar = () => {
  const [activeComponent, setActiveComponent] = useState<ComponentKey | null>(null);

  const handleMouseLeave = () => {
    setTimeout(() => {
      setActiveComponent(null);
    }, 200);
  };

  const handleMouseEnter = (componentName: ComponentKey) => {
    setActiveComponent(componentName);
  };

  return (
    <div className="relative max-w-[1400px] mx-auto">
      <nav className="p-4 overflow-x-auto">
        <ul className="flex items-center space-x-6  md:space-x-14  text-sm font-medium text-gray-400">
          {Object.keys(componentMap).map((key) => (
            <li
              key={key}
              onMouseEnter={() => handleMouseEnter(key as ComponentKey)}
              className="cursor-pointer   transition-colors whitespace-nowrap rounded"
            >
              {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
            </li>
          ))}
        </ul>
      </nav>

      {activeComponent && (
        <div
          onMouseLeave={handleMouseLeave}
          className="absolute z-30 left-0 w-full"
        >
          {React.createElement(componentMap[activeComponent])}
        </div>
      )}
    </div>
  );
};

export default Navbar;
