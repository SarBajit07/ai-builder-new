use client";

import { Button } from '@/components/ui/button';
import LucidePlusCircle from 'lucide-react';
import LucideMinusCircle from 'lucide-react';

interface CounterButtonProps {
  type: 'increment' | 'decrement';
  onClick?: () => void;
}

const CounterButton = ({ type, onClick }: CounterButtonProps) => {
  return (
    <button
      className='bg-gradient-to-r from-blue-400 to-purple-500 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform'
      onClick={onClick}
    >
      {type === 'increment' ? (
        <LucidePlusCircle className='mr-2' />
      ) : (
        <LucideMinusCircle className='mr-2' />
      )}
      {type}
    </button>
  );
};

export default CounterButton;