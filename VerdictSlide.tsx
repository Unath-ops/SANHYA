import { Scale } from 'lucide-react';

export default function VerdictSlide() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-20">
      <div className="mb-8 animate-scale-in">
        <Scale className="w-20 h-20 text-[#d4af37]" />
      </div>

      <h2 className="text-4xl md:text-5xl font-serif mb-12 text-[#d4af37] animate-fade-in-down">
        The Ancient Verdict
      </h2>

      <blockquote className="text-center max-w-3xl mb-12 animate-fade-in-up">
        <p className="text-2xl md:text-3xl font-serif italic text-[#d4af37] leading-relaxed mb-6">
          "He who enjoys nature's gifts without giving back is certainly a thief."
        </p>
        <cite className="text-lg text-gray-400 not-italic">— Bhagavad Gita 3.12</cite>
      </blockquote>

      <div className="glass-card px-8 py-4 rounded-2xl border-2 border-[#ff4d4d] animate-scale-in-delayed">
        <p className="text-2xl md:text-3xl font-bold text-[#ff4d4d] tracking-wider">
          ECOLOGICAL DEBT
        </p>
      </div>
    </div>
  );
}
