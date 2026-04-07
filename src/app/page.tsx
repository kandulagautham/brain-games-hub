'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Zap, Activity, Info } from 'lucide-react';
import { PathTracer } from '@/components/games/PathTracer';
import { ParticleSandbox } from '@/components/games/ParticleSandbox';
import { GlassContainer } from '@/components/ui/GlassContainer';

type GameID = 'focus' | 'stress';

export default function Home() {
  const [activeGame, setActiveGame] = useState<GameID>('focus');

  return (
    <main className="min-h-screen px-4 py-8 md:px-8 max-w-6xl mx-auto flex flex-col items-center">
      {/* Top Status Bar */}
      <div className="w-full mb-8 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-primary opacity-70 border-b border-primary/20 pb-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> SYS_LIVE</span>
          <span className="hidden md:inline">NODE_V16.2.2</span>
        </div>
        <div className="flex items-center gap-4">
          <span>LATENCY: 12ms</span>
          <span>DATE: {new Date().toISOString().split('T')[0].replace(/-/g, '.')}</span>
        </div>
      </div>

      {/* Header Section */}
      <GlassContainer className="w-full mb-8 text-center py-12 bg-background/40">
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10"
        >
            <div className="flex justify-center mb-6">
                <div className="p-3 border border-primary/50 neon-glow-primary rounded-sm">
                    <Terminal className="w-10 h-10 text-primary" />
                </div>
            </div>
            <h1 
              className="text-2xl md:text-4xl mb-4 text-primary glitch-text"
              data-text="BRAIN_GAMES_HUB"
            >
              BRAIN_GAMES_HUB
            </h1>
            <p className="text-secondary max-w-2xl mx-auto text-sm md:text-base leading-relaxed opacity-80">
                [USER_INTERFACE_LOADING] ... SUCCESS. 
                Welcome to the digital sanctuary for focus and sensory relief.
            </p>
        </motion.div>
      </GlassContainer>

      {/* Main Interface Module */}
      <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          <GlassContainer 
            hover 
            onClick={() => setActiveGame('focus')}
            className={`cursor-pointer transition-all ${activeGame === 'focus' ? 'border-primary bg-primary/10' : 'bg-background/20 opacity-60'}`}
          >
            <div className="flex items-center gap-3">
              <Zap className={`w-5 h-5 ${activeGame === 'focus' ? 'text-primary' : 'text-slate-400'}`} />
              <div className="text-left">
                <div className="text-xs font-heading">FOCUS_PATH</div>
                <div className="text-[10px] opacity-50 mt-1 uppercase">SENSORY_FLOW</div>
              </div>
            </div>
          </GlassContainer>

          <GlassContainer 
            hover 
            onClick={() => setActiveGame('stress')}
            className={`cursor-pointer transition-all ${activeGame === 'stress' ? 'border-cta bg-cta/10' : 'bg-background/20 opacity-60'}`}
          >
            <div className="flex items-center gap-3">
              <Cpu className={`w-5 h-5 ${activeGame === 'stress' ? 'text-cta' : 'text-slate-400'}`} />
              <div className="text-left">
                <div className="text-xs font-heading">PARTICLE_SYS</div>
                <div className="text-[10px] opacity-50 mt-1 uppercase">PHYSICS_SANDBOX</div>
              </div>
            </div>
          </GlassContainer>

          <GlassContainer className="mt-auto hidden md:block bg-background/20 text-[10px] opacity-40 uppercase leading-relaxed">
            <Info className="w-4 h-4 mb-2" />
            Designed for neurodivergent minds. Zero timers. Zero pressure.
          </GlassContainer>
        </div>

        {/* Game Stage */}
        <div className="flex-1 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
               key={activeGame}
               initial={{ opacity: 0, x: 10 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -10 }}
               transition={{ duration: 0.2 }}
               className="w-full h-full terminal-box rounded-lg overflow-hidden flex items-center justify-center p-4 min-h-[500px]"
            >
              {activeGame === 'focus' ? <PathTracer /> : <ParticleSandbox />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Hardware Specs Footer */}
      <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {[
          { label: 'ENGINE', val: 'MATTER.JS v0.19' },
          { label: 'RENDER', val: 'FRAMER_MOTION' },
          { label: 'UI_STACK', val: 'NEXT.JS_16.2' },
          { label: 'AUTH', val: 'GUEST_TERMINAL' },
        ].map((spec, i) => (
          <div key={i} className="border border-primary/20 p-2 text-[10px] tracking-tighter opacity-60">
            <span className="text-primary mr-2">[{spec.label}]</span> {spec.val}
          </div>
        ))}
      </div>
      
      <p className="text-[10px] text-center opacity-30 uppercase tracking-[0.3em] font-heading mt-4">
        &copy; 2026 KANDULA_GAUTHAM // ALL_RIGHTS_RESERVED
      </p>
    </main>
  );
}
