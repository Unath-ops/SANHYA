import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { UserData, CalculationResult } from '../App';
import IntroSlide from './slides/IntroSlide';
import CulpritSlide from './slides/CulpritSlide';
import ForestLossSlide from './slides/ForestLossSlide';
import RealityCheckSlide from './slides/RealityCheckSlide';
import VerdictSlide from './slides/VerdictSlide';
import RedemptionSlide from './slides/RedemptionSlide';
import ActionAwakeningSlide from './slides/ActionAwakeningSlide';
import ShareRedemptionSlide from './slides/ShareRedemptionSlide';

interface WrappedModeProps {
  userData: UserData;
  result: CalculationResult;
  onReset: () => void;
}

export default function WrappedMode({ userData, result, onReset }: WrappedModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [pledged, setPledged] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const totalSlides = 8;

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const treeCutBufferRef = useRef<AudioBuffer | null>(null);
  const confettiSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize AudioContext for tree cutting sounds with pitch variation
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext not supported:', e);
    }

    // Initialize background music
    backgroundMusicRef.current = new Audio();
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = 0.3;
    backgroundMusicRef.current.preload = 'auto';
    // Using a placeholder URL - replace with actual ambient music
    backgroundMusicRef.current.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    
    // Initialize confetti sound
    confettiSoundRef.current = new Audio();
    confettiSoundRef.current.volume = 0.5;
    confettiSoundRef.current.preload = 'auto';
    // Using a placeholder URL - replace with actual uplifting sound
    confettiSoundRef.current.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

    // Preload audio
    const preloadPromises = [
      backgroundMusicRef.current.load(),
      confettiSoundRef.current.load(),
    ];

    Promise.all(preloadPromises)
      .then(() => {
        setAudioLoaded(true);
      })
      .catch((err) => {
        console.warn('Audio preload failed:', err);
        setAudioLoaded(true); // Continue anyway
      });

    // Start background music with user interaction fallback
    const playMusic = () => {
      if (backgroundMusicRef.current && audioLoaded) {
        backgroundMusicRef.current.play().catch(() => {
          // Auto-play might be blocked, will play on first user interaction
        });
      }
    };

    // Try to play immediately
    playMusic();

    // Fallback: play on first user interaction
    const handleFirstInteraction = () => {
      playMusic();
      // Resume AudioContext if suspended
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      backgroundMusicRef.current?.pause();
      confettiSoundRef.current?.pause();
      audioContextRef.current?.close();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [audioLoaded]);

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = isMuted;
    }
    if (confettiSoundRef.current) {
      confettiSoundRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const playTreeCutSound = () => {
    if (isMuted || !audioLoaded || !audioContextRef.current) return;

    try {
      // Create a simple oscillator-based chainsaw sound with pitch variation
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      // Random pitch variation ±5%
      const pitchVariation = 0.95 + Math.random() * 0.1; // 0.95 to 1.05
      
      oscillator.frequency.value = 80 * pitchVariation; // Base frequency with variation
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (err) {
      console.warn('Tree cut sound play failed:', err);
    }
  };

  const playConfettiSound = () => {
    if (confettiSoundRef.current && !isMuted && audioLoaded) {
      confettiSoundRef.current.currentTime = 0;
      confettiSoundRef.current.play().catch((err) => {
        console.warn('Confetti sound play failed:', err);
      });
    }
  };

  const slides = [
    <IntroSlide key="intro" name={userData.name} />,
    <CulpritSlide key="culprit" carbonHeavyweight={result.carbonHeavyweight} />,
    <ForestLossSlide key="forest" treesOwed={result.treesOwed} onTreeCut={playTreeCutSound} />,
    <RealityCheckSlide key="reality" treesOwed={result.treesOwed} />,
    <VerdictSlide key="verdict" />,
    <RedemptionSlide 
      key="redemption" 
      result={result} 
      pledged={pledged}
      onPledgeChange={(checked) => {
        setPledged(checked);
        if (checked) {
          playConfettiSound();
        }
      }}
    />,
    <ActionAwakeningSlide key="action" />,
    <ShareRedemptionSlide 
      key="share" 
      result={result} 
      userData={userData}
      pledged={pledged}
      onReset={onReset} 
    />,
  ];

  return (
    <div 
      className="fixed inset-0 bg-[#0a0a0a] overflow-y-auto overflow-x-hidden cursor-pointer"
      onClick={nextSlide}
    >
      {/* Progress indicators */}
      <div className="fixed top-4 left-0 right-0 z-50 flex gap-2 px-6 pointer-events-none">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
          >
            <div
              className={`h-full bg-[#00ff9d] transition-all duration-300`}
              style={{
                width: index < currentSlide ? '100%' : index === currentSlide ? '100%' : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Audio control button */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-6 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors pointer-events-auto"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Slides */}
      <div className="min-h-screen">
        <div
          className={`min-h-screen transition-transform duration-300 ease-out ${
            isTransitioning ? 'slide-out-left' : 'slide-in-right'
          }`}
        >
          {slides[currentSlide]}
        </div>
      </div>

      {/* Tap indicator (only on non-final slides) */}
      {currentSlide < totalSlides - 1 && (
        <div className="fixed bottom-8 left-0 right-0 text-center text-sm text-gray-500 opacity-50 pointer-events-none z-40">
          Tap to continue
        </div>
      )}
    </div>
  );
}
