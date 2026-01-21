import { TreePine } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
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

export default function RedemptionSlide({
  result,
  pledged,
  onPledgeChange,
}: RedemptionSlideProps) {
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

    for (let i = 0; i < 150; i++) {
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
    const startTime = Date.now();
    const duration = 3000;

    const animate = () => {
      if (Date.now() - startTime > duration) {
        canvas.style.display = 'none';
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [pledged]);

  const handlePledgeChange = (checked: boolean) => {
    onPledgeChange(checked);
    if (checked && canvasRef.current) {
      canvasRef.current.style.display = 'block';
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-between px-6 py-12">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ display: 'none' }}
      />

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full">
        {/* Gauge */}
        <div className="relative w-64 h-32 mb-8">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <path
              d="M 10 90 A 90 90 0 0 1 190 90"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="20"
            />
            <path
              d="M 10 90 A 90 90 0 0 1 190 90"
              fill="none"
              stroke={isDefaulter ? '#ff4d4d' : '#00ff9d'}
              strokeWidth="20"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * percentage) / 100}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <div
              className="text-5xl font-bold"
              style={{ color: isDefaulter ? '#ff4d4d' : '#00ff9d' }}
            >
              {score}
            </div>
            <div className="text-sm text-gray-400">/ 850</div>
          </div>
        </div>

        {/* Status */}
        <div
          className={`px-8 py-4 rounded-2xl border-2 mb-8 ${
            isDefaulter ? 'border-[#ff4d4d]' : 'border-[#00ff9d]'
          }`}
        >
          <p
            className="text-3xl font-bold"
            style={{ color: isDefaulter ? '#ff4d4d' : '#00ff9d' }}
          >
            {status}
          </p>
        </div>

        {/* CTA */}
        <Button className="bg-[#00ff9d] text-black text-xl px-10 py-8 rounded-xl font-bold mb-6 flex gap-3">
          <TreePine />
          Plant {treesOwed} Trees
        </Button>

        {/* Pledge */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="pledge"
            checked={pledged}
            onCheckedChange={handlePledgeChange}
          />
          <label htmlFor="pledge" className="text-sm text-gray-300">
            I pledge to plant these trees within 30 days
          </label>
        </div>
      </div>

      <footer className="text-xs text-gray-500 text-center mt-6">
        <p>Estimates inspired by IPCC & CEA data.</p>
        <p className="text-[#d4af37]">Department of Statistics, NLU</p>
      </footer>
    </div>
  );
}
