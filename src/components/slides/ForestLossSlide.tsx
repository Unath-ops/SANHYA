import { useState, useEffect, useRef } from 'react';
import { TreePine, Axe } from 'lucide-react';

interface ForestLossSlideProps {
  treesOwed: number;
  onTreeCut?: () => void;
}

export default function ForestLossSlide({ treesOwed, onTreeCut }: ForestLossSlideProps) {
  const displayTrees = Math.min(treesOwed, 100);
  const showCount = treesOwed > 100;
  const [currentTreeIndex, setCurrentTreeIndex] = useState(-1);
  const [cutTrees, setCutTrees] = useState<Set<number>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in strict mode
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Add minimal delay to ensure proper render before starting animation
    const initTimeout = setTimeout(() => {
      setIsAnimating(true);
      // Use requestAnimationFrame to ensure the component has rendered
      requestAnimationFrame(() => {
        let currentIndex = 0;

        const processTree = (index: number) => {
          if (index >= displayTrees) {
            // Animation complete
            setCurrentTreeIndex(-1);
            setIsAnimating(false);
            return;
          }

          // Move lumberjack to this tree position
          setCurrentTreeIndex(index);

          // Immediately cut this tree and play sound
          // Use a tiny delay to ensure position update renders first
          setTimeout(() => {
            if (onTreeCut) {
              onTreeCut();
            }
            setCutTrees(prev => {
              const newSet = new Set(prev);
              newSet.add(index);
              return newSet;
            });

            // After 0.5 seconds at this tree, move to next
            animationRef.current = setTimeout(() => {
              processTree(index + 1);
            }, 500);
          }, 10); // 10ms delay to ensure lumberjack position renders
        };

        // Start with tree 0 (first tree)
        processTree(0);
      });
    }, 50); // 50ms initial delay for proper render

    return () => {
      clearTimeout(initTimeout);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [displayTrees, onTreeCut]);

  // Calculate grid dimensions based on screen size
  const getGridCols = () => {
    if (typeof window === 'undefined') return 5;
    if (window.innerWidth >= 768) return 10;
    if (window.innerWidth >= 640) return 8;
    return 5;
  };

  const cols = getGridCols();
  const rows = Math.ceil(displayTrees / cols);

  // Calculate lumberjack position
  const getLumberjackPosition = () => {
    if (currentTreeIndex < 0 || currentTreeIndex >= displayTrees) {
      return { display: 'none' };
    }
    const row = Math.floor(currentTreeIndex / cols);
    const col = currentTreeIndex % cols;
    
    // Calculate position as percentage
    const leftPercent = (col / cols) * 100 + (100 / cols / 2); // Center in cell
    const topPercent = (row / rows) * 100 + (100 / rows / 2); // Center in cell
    
    return {
      left: `${leftPercent}%`,
      top: `${topPercent}%`,
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <h2 className="text-4xl md:text-5xl font-serif mb-4 text-[#ff4d4d] animate-fade-in-down text-center">
        Witness the impact of your year.
      </h2>

      <div className="flex-1 flex items-center justify-center w-full max-w-4xl my-8 relative">
        <div 
          className="grid gap-3 md:gap-4 relative"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: displayTrees }).map((_, index) => {
            const isCut = cutTrees.has(index);
            return (
              <div
                key={index}
                className="relative flex items-center justify-center"
              >
                {/* Tree */}
                <div
                  className={`transition-all duration-500 ${
                    isCut ? 'tree-timber' : 'tree-standing'
                  }`}
                >
                  <TreePine 
                    className="w-8 h-8 md:w-10 md:h-10 transition-colors duration-500" 
                    style={{ 
                      color: isCut ? '#8b4513' : '#00ff9d',
                      opacity: isCut ? 0.5 : 1,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Moving Lumberjack */}
          {isAnimating && currentTreeIndex >= 0 && (
            <div
              className="absolute pointer-events-none z-10 lumberjack-move"
              style={getLumberjackPosition()}
            >
              <div className="animate-lumberjack-chop">
                <Axe className="w-6 h-6 md:w-8 md:h-8 text-[#d4af37]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {showCount && (
        <div className="mb-6 text-6xl font-bold text-[#ff4d4d] animate-scale-in">
          {treesOwed}
        </div>
      )}

      <p className="text-xl md:text-2xl text-center text-gray-300 max-w-2xl leading-relaxed animate-fade-in-up-delayed">
        Your lifestyle indirectly chopped down{' '}
        <span className="text-[#ff4d4d] font-bold">{treesOwed} trees</span> this year.
      </p>
    </div>
  );
}
