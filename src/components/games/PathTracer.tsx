'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GlassContainer } from '../ui/GlassContainer';

interface Point {
  x: number;
  y: number;
}

export const PathTracer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [speedLevel, setSpeedLevel] = useState<'Zen' | 'Flow' | 'Reflex'>('Flow');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [bestStats, setBestStats] = useState<Record<string, { accuracy: number }>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('brain-games-stats');
      if (stored) {
        try { return JSON.parse(stored); } catch { return {}; }
      }
    }
    return {};
  });

  // Speed multipliers
  const speeds = useMemo(() => ({
    Zen: 0.001,
    Flow: 0.002,
    Reflex: 0.004
  }), []);

  // Game state refs for performance and stability
  const pathRef = useRef<Point[]>([]);
  const progressRef = useRef(0);
  const userPosRef = useRef<Point>({ x: 0, y: 0 });
  const accuracyRef = useRef(100);
  const maxAccuracyRef = useRef(0);
  const speedRef = useRef(speeds.Flow);

  useEffect(() => {
    speedRef.current = speeds[speedLevel];
  }, [speedLevel, speeds]);

  const initPath = () => {
    const points: Point[] = [];
    const width = 600;
    const height = 400;
    const segments = 20;
    
    let currentX = 50;
    let currentY = height / 2;
    
    for (let i = 0; i < segments; i++) {
        points.push({ x: currentX, y: currentY });
        currentX += (width - 100) / segments;
        currentY += (Math.random() - 0.5) * 150;
        currentY = Math.max(50, Math.min(height - 50, currentY));
    }
    pathRef.current = points;
    progressRef.current = 0;
    maxAccuracyRef.current = 0;
  };

  const startSession = () => {
    setCountdown(3);
    setIsPlaying(true);
    initPath();
  };

  // Countdown timer logic
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
          setCountdown(null);
          maxAccuracyRef.current = 0;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      
      if (canvas.width !== 600 * dpr || canvas.height !== 400 * dpr) {
        canvas.width = 600 * dpr;
        canvas.height = 400 * dpr;
        ctx.scale(dpr, dpr);
      }

      ctx.clearRect(0, 0, 600, 400);
      
      // Draw path
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      pathRef.current.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Only move if countdown is finished
      if (countdown === null) {
          progressRef.current += speedRef.current;
          
          if (progressRef.current >= 1) {
              // Lap completed!
              const finalAccuracy = accuracyRef.current;
              const stats = bestStats[speedLevel] || { accuracy: 0 };
              
              if (finalAccuracy > stats.accuracy) {
                  const newStats = { ...bestStats, [speedLevel]: { accuracy: finalAccuracy } };
                  setBestStats(newStats);
                  localStorage.setItem('brain-games-stats', JSON.stringify(newStats));
              }

              progressRef.current = 0;
          }
      }

      // Calculate current target position
      const totalPoints = pathRef.current.length;
      const index = Math.floor(progressRef.current * (totalPoints - 1));
      const nextIndex = Math.min(index + 1, totalPoints - 1);
      const segmentProgress = (progressRef.current * (totalPoints - 1)) % 1;
      
      const p1 = pathRef.current[index];
      const p2 = pathRef.current[nextIndex];
      
      const tx = p1.x + (p2.x - p1.x) * segmentProgress;
      const ty = p1.y + (p2.y - p1.y) * segmentProgress;
      
      // Check distance to user (from Ref)
      const userPos = userPosRef.current;
      const dist = Math.sqrt(Math.pow(tx - userPos.x, 2) + Math.pow(ty - userPos.y, 2));
      const currentAccuracy = Math.max(0, 100 - dist * 2);
      accuracyRef.current = accuracyRef.current * 0.95 + currentAccuracy * 0.05;
      
      if (animationFrameId % 10 === 0) {
          setAccuracy(accuracyRef.current);
      }

      // Draw target
      ctx.beginPath();
      ctx.fillStyle = accuracyRef.current > 80 ? '#8b5cf6' : '#94a3b8';
      ctx.shadowBlur = accuracyRef.current > 80 ? 20 : 0;
      ctx.shadowColor = '#8b5cf6';
      ctx.arc(tx, ty, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw visual cursor indicator on canvas
      ctx.beginPath();
      ctx.strokeStyle = accuracyRef.current > 80 ? '#06b6d4' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.arc(userPos.x, userPos.y, 12, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, countdown, bestStats, speedLevel]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = 600 / rect.width;
    const scaleY = 400 / rect.height;
    
    userPosRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  return (
    <GlassContainer className="w-full max-w-3xl overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-accent-primary">Path Tracer</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  Speed Mode: <span className="font-mono text-slate-600 font-bold ml-1">{speedLevel}</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                  Best Accuracy: <span className="font-mono text-accent-primary font-bold ml-1">
                      {bestStats[speedLevel]?.accuracy ? `${Math.round(bestStats[speedLevel].accuracy)}%` : '--'}
                  </span>
              </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className={`text-xl font-mono font-bold ${accuracy > 80 ? 'text-accent-secondary' : 'text-slate-400'}`}>
                {Math.round(accuracy)}%
            </div>
            
            <div className="flex gap-1 p-1 bg-white/10 rounded-lg border border-white/10">
                {(['Zen', 'Flow', 'Reflex'] as const).map((lvl) => (
                    <button
                        key={lvl}
                        onClick={() => setSpeedLevel(lvl)}
                        className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all ${speedLevel === lvl ? 'bg-white shadow-sm text-accent-primary' : 'hover:bg-white/5 text-slate-400'}`}
                    >
                        {lvl}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className={`relative bg-white/5 rounded-xl border border-white/10 overflow-hidden ${isPlaying ? 'cursor-none' : 'cursor-default'}`}>
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center z-20 backdrop-blur-sm bg-white/5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startSession}
              className="px-8 py-3 bg-accent-primary text-white rounded-full font-bold shadow-lg shadow-accent-primary/20"
            >
              Start Focus Session
            </motion.button>
          </div>
        )}

        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="text-8xl font-black text-accent-primary drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              {countdown === 0 ? 'GO!' : countdown}
            </motion.div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseMove={handleMouseMove}
          className="w-full h-auto block"
        />
      </div>

      <div className="mt-6 flex justify-between items-center">
        <button 
          onClick={() => setIsPlaying(false)}
          className="text-xs text-slate-400 hover:text-accent-primary transition-colors"
        >
          Reset Session
        </button>
        <div className="flex gap-2">
            {[1, 2, 3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${accuracy > 80 ? 'bg-accent-secondary/40' : 'bg-slate-700'}`} />
            ))}
        </div>
      </div>
    </GlassContainer>
  );
};
