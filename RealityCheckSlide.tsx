import { Globe } from 'lucide-react';

interface RealityCheckSlideProps {
  treesOwed: number;
}

export default function RealityCheckSlide({ treesOwed }: RealityCheckSlideProps) {
  // Dynamic Earth multiplier based on Trees_Owed
  const getEarthsNeeded = () => {
    if (treesOwed > 50) {
      return '4';
    } else if (treesOwed > 10) {
      return '2.5';
    }
    return '1';
  };

  const earthsNeeded = getEarthsNeeded();
  const showMultiplier = treesOwed > 10;

  const getMessage = () => {
    if (treesOwed > 50) {
      return "Your lifestyle demands resources far beyond what our planet can regenerate. If 8 billion people lived like you, we would need four Earths to sustain humanity. The ecological overshoot is catastrophic.";
    } else if (treesOwed > 10) {
      return "Your consumption pattern exceeds Earth's regenerative capacity. If everyone adopted your lifestyle, humanity would need 2.5 planets to survive. We only have one.";
    }
    return "Your lifestyle is relatively sustainable, but there's always room for improvement. Every small change contributes to a healthier planet.";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <h2 className="text-4xl md:text-5xl font-serif mb-12 text-[#d4af37] animate-fade-in-down text-center">
        If everyone lived like you…
      </h2>

      <div className="mb-12 animate-scale-in flex items-center gap-4">
        {showMultiplier ? (
          <>
            <Globe className="w-16 h-16 md:w-20 md:h-20 text-[#00ff9d]" />
            <span className="text-6xl md:text-7xl font-bold text-[#ff4d4d]">×</span>
            <span className="text-6xl md:text-7xl font-bold text-[#ff4d4d]">{earthsNeeded}</span>
          </>
        ) : (
          <Globe className="w-20 h-20 md:w-24 md:h-24 text-[#00ff9d]" />
        )}
      </div>

      <div className="glass-card px-8 py-4 rounded-2xl border-2 border-[#00ff9d] mb-8 animate-scale-in" style={{ animationDelay: '0.3s' }}>
        <p className="text-3xl md:text-4xl font-bold text-center" style={{ color: showMultiplier ? '#ff4d4d' : '#00ff9d' }}>
          {earthsNeeded} {earthsNeeded === '1' ? 'Earth' : 'Earths'}
        </p>
      </div>

      <p className="text-lg md:text-xl text-center text-gray-300 max-w-2xl leading-relaxed animate-fade-in-up-delayed">
        {getMessage()}
      </p>
    </div>
  );
}
