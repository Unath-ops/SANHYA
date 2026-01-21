import { Heart } from 'lucide-react';

export default function ActionAwakeningSlide() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-20">
      <h2 className="text-4xl md:text-5xl font-serif mb-12 text-[#00ff9d] animate-fade-in-down text-center">
        Action Awakening
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl animate-scale-in" style={{ animationDelay: '0.3s' }}>
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
          <img 
            src="/assets/generated/people-planting-trees.dim_800x600.jpg" 
            alt="People planting trees"
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
          <img 
            src="/assets/generated/hands-planting-sapling.dim_600x400.jpg" 
            alt="Hands planting sapling"
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
          <img 
            src="/assets/generated/tree-planting-volunteers.dim_800x600.jpg" 
            alt="Tree planting volunteers"
            className="w-full h-48 object-cover"
          />
        </div>
      </div>

      <div className="text-center max-w-3xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <p className="text-2xl md:text-3xl font-serif italic text-[#d4af37] leading-relaxed mb-8">
          "Nature waits for your hands, not your apologies."
        </p>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
          Every tree planted is a promise kept. Every action taken is a step toward redemption.
        </p>
        <div className="flex items-center justify-center gap-2 text-[#00ff9d]">
          <Heart className="w-6 h-6 fill-current" />
          <p className="text-base md:text-lg font-semibold">
            Join thousands who have already begun their journey
          </p>
          <Heart className="w-6 h-6 fill-current" />
        </div>
      </div>
    </div>
  );
}
