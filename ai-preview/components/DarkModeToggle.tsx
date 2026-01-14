use client";

import LucideMoon from 'lucide-react';
import LucideSun from 'lucide-react';
import { useState } from 'react';

interface DarkModeToggleProps {
  toggle: () => void;
  isOn: boolean;
}

const DarkModeToggle = ({ toggle, isOn }: DarkModeToggleProps) => {
  return (
    <button
      onClick={toggle}
      className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform'
    >
      {isOn ? <LucideMoon /> : <LucideSun />}
      Dark Mo
      de
    </button>
  );
};

export default DarkModeToggle;