import { useState, useRef } from 'react';
import { Share2, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CalculationResult, UserData } from '../../App';

interface ShareRedemptionSlideProps {
  result: CalculationResult;
  userData: UserData;
  pledged: boolean;
  onReset: () => void;
}

export default function ShareRedemptionSlide({ result, userData, pledged, onReset }: ShareRedemptionSlideProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureComplete, setCaptureComplete] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const { score, status, treesOwed } = result;

  const captureScreenshot = async () => {
    if (!reportRef.current) return;

    setIsCapturing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scale = 2; 
      canvas.width = 800 * scale;
      canvas.height = 1000 * scale;
      ctx.scale(scale, scale);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 800, 1000);

      // Title
      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 36px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText('ECO KARMA REPORT', 400, 80);

      // Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Inter, sans-serif';
      ctx.fillText(userData.name, 400, 130);

      // Score section
      const scoreColor = status === 'DEFAULTER' ? '#ff4d4d' : '#00ff9d';
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 20;
      ctx.beginPath();
      ctx.arc(400, 300, 100, Math.PI, 2 * Math.PI);
      ctx.stroke();

      ctx.strokeStyle = scoreColor;
      const percentage = (score / 850) * 100;
      const endAngle = Math.PI + (Math.PI * percentage / 100);
      ctx.beginPath();
      ctx.arc(400, 300, 100, Math.PI, endAngle);
      ctx.stroke();

      ctx.fillStyle = scoreColor;
      ctx.font = 'bold 48px Inter, sans-serif';
      ctx.fillText(score.toString(), 400, 290);
      ctx.fillStyle = '#999999';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText('/ 850', 400, 315);

      ctx.fillStyle = scoreColor;
      ctx.font = 'bold 32px Inter, sans-serif';
      ctx.fillText(status, 400, 380);

      ctx.fillStyle = '#ffffff';
      ctx.font = '24px Inter, sans-serif';
      ctx.fillText('Trees Owed', 400, 460);
      ctx.fillStyle = '#ff4d4d';
      ctx.font = 'bold 56px Inter, sans-serif';
      ctx.fillText(treesOwed.toString(), 400, 520);

      if (pledged) {
        ctx.fillStyle = '#00ff9d';
        ctx.font = '20px Inter, sans-serif';
        ctx.fillText('✓ Pledge Committed', 400, 580);
      }

      ctx.fillStyle = '#d4af37';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText('Carbon Heavyweight', 400, 650);
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText(result.carbonHeavyweight.category, 400, 680);

      ctx.fillStyle = '#666666';
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('SANKHYA: Eco Karma Wrapped', 400, 900);
      ctx.fillText('Department of Statistics, NLU', 400, 930);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `eco-karma-${userData.name.replace(/\s+/g, '-')}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setCaptureComplete(true);
          setTimeout(() => setCaptureComplete(false), 3000);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Screenshot capture failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-between px-6 py-12 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-serif mb-12 text-[#00ff9d] animate-fade-in-down text-center">
          Share Your Redemption
        </h2>

        <div ref={reportRef} className="glass-card p-8 rounded-2xl border-2 border-[#00ff9d] mb-8 w-full max-w-md animate-scale-in">
          <div className="text-center space-y-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Your Score</p>
              <p className="text-5xl font-bold" style={{ color: status === 'DEFAULTER' ? '#ff4d4d' : '#00ff9d' }}>
                {score}
              </p>
              <p className="text-sm text-gray-400">/ 850</p>
            </div>

            <div className="border-t border-white/20 pt-4">
              <p className="text-sm text-gray-400 mb-2">Status</p>
              <p className="text-2xl font-bold" style={{ color: status === 'DEFAULTER' ? '#ff4d4d' : '#00ff9d' }}>
                {status}
              </p>
            </div>

            <div className="border-t border-white/20 pt-4">
              <p className="text-sm text-gray-400 mb-2">Trees Owed</p>
              <p className="text-4xl font-bold text-[#ff4d4d]">{treesOwed}</p>
            </div>

            {pledged && (
              <div className="border-t border-white/20 pt-4">
                <div className="flex items-center justify-center gap-2 text-[#00ff9d]">
                  <CheckCircle className="w-5 h-5" />
                  <p className="text-sm font-semibold">Pledge Committed</p>
                </div>
              </div>
            )}

            <div className="border-t border-white/20 pt-4">
              <p className="text-xs text-gray-500">Carbon Heavyweight</p>
              <p className="text-sm text-[#d4af37] font-semibold">{result.carbonHeavyweight.category}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 w-full max-w-md animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Button
            onClick={captureScreenshot}
            disabled={isCapturing}
            className="w-full bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 text-lg px-8 py-6 rounded-xl font-bold shadow-lg hover:shadow-[#00ff9d]/50 transition-all duration-300 flex items-center justify-center gap-3"
          >
            {isCapturing ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Capturing...
              </>
            ) : captureComplete ? (
              <>
                <CheckCircle className="w-6 h-6" />
                Captured!
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Capture & Share Report
              </>
            )}
          </Button>

          <Button
            onClick={onReset}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 text-base px-6 py-5 rounded-xl"
          >
            Audit Another Person
          </Button>
        </div>

        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-2">
            <Share2 className="w-4 h-4" />
            <p className="text-sm">Share your journey on social media</p>
          </div>
          <p className="text-xs text-gray-500">
            Inspire others to calculate their ecological footprint
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 space-y-2 mt-8 animate-fade-in" style={{ animationDelay: '0.9s' }}>
        <p style={{ color: '#d4af37' }}>SANKHYA: Eco Karma Wrapped</p>
        <p>Department of Statistics, NLU</p>
      </div>
    </div>
  );
}
