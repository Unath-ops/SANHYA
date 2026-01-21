import { TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { CalculationResult } from '../../App';
import { useEffect, useRef } from 'react';

interface RedemptionSlideProps {
  result: CalculationResult;
  pledged: boolean;
  onPledgeChange: (checked: boolean) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
}

export default function RedemptionSlide({ result, pledged, onPledgeChange }: RedemptionSlideProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { score, status, treesOwed } = result;
  const percentage = (score / 850) * 100;
  const isDefaulter = status === 'DEFAULTER';

  useEffect(() => {
    if (!pledged || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const colors = ['#00ff9d', '#d4af37', '#ffffff'];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 10;
      particles.push({
        x: canvas.width * (0.2 + Math.random() * 0.6),
        y: canvas.height * 0.3,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        gravity: 0.3 + Math.random() * 0.2,
      });
    }

    let animationId: number;
    let startTime = Date.now();
    const duration = 3000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        canvas.style.display = 'none';
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.gravity;
        particle.vx *= 0.99;
        particle.rotation += particle.rotationSpeed;

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [pledged]);

  const handlePledgeChange = (checked: boolean) => {
    onPledgeChange(checked);
    if (checked && canvasRef.current) {
      canvasRef.current.style.display = 'block';
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-between px-6 py-12 overflow-y-auto">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ display: 'none' }}
      />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl">
        <div className="relative w-64 h-32 mb-8 animate-scale-in">
          <svg className="w-full h-full" viewBox="0 0 200 100">
            <path
              d="M 10 90 A 90 90 0 0 1 190 90"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="20"
              strokeLinecap="round"
            />
            <path
              d="M 10 90 A 90 90 0 0 1 190 90"
              fill="none"
              stroke={isDefaulter ? '#ff4d4d' : '#00ff9d'}
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * percentage) / 100}
              className="animate-gauge"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 animate-fade-in-delayed">
            <div className="text-5xl font-bold" style={{ color: isDefaulter ? '#ff4d4d' : '#00ff9d' }}>
              {score}
            </div>
            <div className="text-sm text-gray-400">/ 850</div>
          </div>
        </div>

        <div
          className={`glass-card px-8 py-4 rounded-2xl border-2 mb-8 animate-scale-in ${
            isDefaulter ? 'border-[#ff4d4d]' : 'border-[#00ff9d]'
          }`}
          style={{ animationDelay: '0.3s' }}
        >
          <p
            className="text-3xl font-bold tracking-wider"
            style={{ color: isDefaulter ? '#ff4d4d' : '#00ff9d' }}
          >
            {status}
          </p>
        </div>

        <div className="text-center mb-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }} onClick={(e) => e.stopPropagation()}>
          <Button
            className="bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 text-xl px-10 py-8 rounded-xl font-bold shadow-lg hover:shadow-[#00ff9d]/50 transition-all duration-300 animate-pulse-glow flex items-center gap-3"
          >
            <TreePine className="w-6 h-6" />
            Plant {treesOwed} Trees
          </Button>
        </div>

        <p className="text-sm md:text-base text-center text-[#d4af37] mb-8 italic animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          Nature does not take IOUs. Balance the scale now.
        </p>

        <div 
          className="glass-card px-6 py-4 rounded-xl border border-white/20 mb-6 animate-fade-in-up" 
          style={{ animationDelay: '0.9s' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-3">
            <Checkbox 
              id="pledge" 
              checked={pledged}
              onCheckedChange={handlePledgeChange}
              className="mt-1 border-[#00ff9d] data-[state=checked]:bg-[#00ff9d] data-[state=checked]:text-black"
            />
            <label 
              htmlFor="pledge" 
              className="text-sm md:text-base text-gray-300 cursor-pointer leading-relaxed"
            >
              I pledge to plant these trees within 30 days
            </label>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 space-y-2 mt-8 animate-fade-in" style={{ animationDelay: '1.3s' }}>
        <p>Estimates inspired by IPCC emission factors and CEA electricity grid data.</p>
        <p style={{ color: '#d4af37' }}>A Project by the Department of Statistics, NLU.</p>
      </div>
    </div>
  );
}
