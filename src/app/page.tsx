'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wind, Brain, Info } from 'lucide-react';
import { PathTracer } from '@/components/games/PathTracer';
import { ParticleSandbox } from '@/components/games/ParticleSandbox';
import { GlassContainer } from '@/components/ui/GlassContainer';

type GameID = 'focus' | 'stress';

export default function Home() {
  const [activeGame, setActiveGame] = useState<GameID>('focus');

  return (
    <main className="min-h-screen px-4 py-12 md:px-8 max-w-6xl mx-auto flex flex-col items-center">
      {/* Header Section */}
      <GlassContainer className="w-full mb-12 text-center py-10 relative overflow-hidden">
        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10"
        >
            <div className="flex justify-center mb-4">
                <div className="p-3 bg-accent-primary/10 rounded-2xl border border-accent-primary/20">
                    <Brain className="w-10 h-10 text-accent-primary" />
                </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary mb-4">
              Brain Games Hub
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
                A digital space for focus and sensory relief. Designed specifically for neurodivergent minds looking for satisfying, low-pressure engagement.
            </p>
        </motion.div>
        
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-accent-primary/20 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-accent-secondary/20 blur-[80px] rounded-full" />
      </GlassContainer>

      {/* Game Selector */}
      <div className="flex gap-4 p-1.5 glass rounded-2xl mb-12 relative z-20">
        <button
          onClick={() => setActiveGame('focus')}
          className={`px-8 py-3 rounded-xl transition-all font-bold flex items-center gap-2 ${activeGame === 'focus' ? 'bg-white shadow-lg text-accent-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Sparkles className="w-4 h-4" />
          Focus Path
        </button>
        <button
          onClick={() => setActiveGame('stress')}
          className={`px-8 py-3 rounded-xl transition-all font-bold flex items-center gap-2 ${activeGame === 'stress' ? 'bg-white shadow-lg text-accent-secondary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Wind className="w-4 h-4" />
          Particle Flow
        </button>
      </div>

      {/* Game Stage */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeGame}
           initial={{ opacity: 0, x: activeGame === 'focus' ? -20 : 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: activeGame === 'focus' ? 20 : -20 }}
           transition={{ type: 'spring', damping: 20, stiffness: 100 }}
           className="w-full flex justify-center"
        >
          {activeGame === 'focus' ? <PathTracer /> : <ParticleSandbox />}
        </motion.div>
      </AnimatePresence>

      {/* Footer Info */}
      <GlassContainer className="w-full mt-12 py-8 border-t-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">No Pressure</h3>
                    <p className="text-sm text-slate-500">No timers, no failure states. Only pure, satisfying focus mechanics.</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">ADHD Friendly</h3>
                    <p className="text-sm text-slate-500">Designed to help reach &quot;Flow State&quot; through immediate visual and tactile feedback.</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800">Aesthetic UI</h3>
                    <p className="text-sm text-slate-500">A premium &quot;Frosted Glass&quot; interface that feels modern and airy.</p>
                </div>
            </div>
        </div>
      </GlassContainer>
      
      <p className="mt-12 text-slate-400 text-xs text-center opacity-50">
        &copy; 2026 Brain Games Hub &bull; Built with Next.js, Framer Motion, and Matter.js
      </p>
    </main>
  );
}
