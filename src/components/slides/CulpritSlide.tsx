import { Car, Zap, ShoppingBag } from 'lucide-react';
import type { CalculationResult } from '../../App';

interface CulpritSlideProps {
  carbonHeavyweight: CalculationResult['carbonHeavyweight'];
}

export default function CulpritSlide({ carbonHeavyweight }: CulpritSlideProps) {
  const { category, description } = carbonHeavyweight;

  const getIcon = () => {
    switch (category) {
      case 'Travel':
        return <Car className="w-16 h-16 md:w-20 md:h-20 text-[#ff4d4d]" />;
      case 'Energy':
        return <Zap className="w-16 h-16 md:w-20 md:h-20 text-[#ff4d4d]" />;
      case 'Consumption':
        return <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 text-[#ff4d4d]" />;
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-20">
      <div className="mb-8 animate-scale-in">
        {getIcon()}
      </div>

      <h2 className="text-4xl md:text-5xl font-serif mb-8 text-[#ff4d4d] animate-fade-in-down text-center">
        Your Carbon Heavyweight
      </h2>

      <div className="glass-card px-8 py-6 rounded-2xl border-2 border-[#ff4d4d] mb-8 animate-scale-in" style={{ animationDelay: '0.3s' }}>
        <p className="text-2xl md:text-3xl font-bold text-[#ff4d4d] tracking-wider text-center">
          {category.toUpperCase()}
        </p>
      </div>

      <p className="text-xl md:text-2xl text-center text-gray-300 max-w-2xl leading-relaxed animate-fade-in-up-delayed">
        {description}
      </p>
    </div>
  );
}
