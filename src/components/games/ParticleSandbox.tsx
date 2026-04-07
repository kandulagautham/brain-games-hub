'use client';

import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { GlassContainer } from '../ui/GlassContainer';
import { motion } from 'framer-motion';

export const ParticleSandbox: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const [interactionMode, setInteractionMode] = useState<'push' | 'pull'>('push');

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    engineRef.current = engine;

    const render = Matter.Render.create({
      element: containerRef.current,
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 600,
        height: 400,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
      }
    });
    renderRef.current = render;

    const runner = Matter.Runner.create();
    runnerRef.current = runner;

    // Create central particles
    const particles: Matter.Body[] = [];
    const count = 120;
    for (let i = 0; i < count; i++) {
        const p = Matter.Bodies.circle(
            250 + Math.random() * 100, 
            150 + Math.random() * 100, 
            3 + Math.random() * 2,
            {
                friction: 0.1,
                restitution: 0.8,
                frictionAir: 0.05,
                render: {
                    fillStyle: i % 2 === 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(139, 92, 246, 0.4)',
                }
            }
        );
        particles.push(p);
    }

    // Walls
    const walls = [
        Matter.Bodies.rectangle(300, -10, 600, 20, { isStatic: true }),
        Matter.Bodies.rectangle(300, 410, 600, 20, { isStatic: true }),
        Matter.Bodies.rectangle(-10, 200, 20, 400, { isStatic: true }),
        Matter.Bodies.rectangle(610, 200, 20, 400, { isStatic: true }),
    ];

    Matter.Composite.add(engine.world, [...particles, ...walls]);

    // Handle interaction
    const handleEvents = () => {
        const mouse = mouseConstraint.mouse;
        if (!mouse.position.x) return;

        const forceMagnitude = interactionMode === 'push' ? 0.0005 : -0.0008;

        particles.forEach(p => {
            const distance = Matter.Vector.magnitude(Matter.Vector.sub(mouse.position, p.position));
            if (distance < 120) {
                const force = Matter.Vector.mult(
                    Matter.Vector.normalise(Matter.Vector.sub(p.position, mouse.position)),
                    forceMagnitude * (1 - distance / 120)
                );
                Matter.Body.applyForce(p, p.position, force);
            }
        });
    };

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Matter.Composite.add(engine.world, mouseConstraint);
    Matter.Events.on(runner, 'beforeUpdate', handleEvents);

    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      Matter.Composite.clear(engine.world, false);
      Matter.Events.off(runner, 'beforeUpdate', handleEvents);
    };
  }, [interactionMode]);

  return (
// ... (at top of return)
    <GlassContainer className="w-full max-w-3xl overflow-hidden mb-8 border-cta/30">
      <div className="flex justify-between items-center mb-6 border-b border-cta/20 pb-4">
        <div>
          <h2 className="text-xl font-heading text-cta glitch-text" data-text="PARTICLE_SYS">PARTICLE_SYS</h2>
          <p className="text-[10px] text-secondary/60 uppercase tracking-widest mt-1">PHYSICS_ENGINE // SANDBOX_MODE</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setInteractionMode('push')}
                className={`px-4 py-1.5 border font-heading text-[10px] transition-all ${interactionMode === 'push' ? 'bg-cta text-background shadow-[0_0_15px_rgba(244,63,94,0.5)] border-cta' : 'border-cta/20 text-cta/40 hover:bg-cta/5'}`}
            >
                PUSH
            </button>
            <button 
                onClick={() => setInteractionMode('pull')}
                className={`px-4 py-1.5 border font-heading text-[10px] transition-all ${interactionMode === 'pull' ? 'bg-secondary text-background shadow-[0_0_15px_rgba(167,139,250,0.5)] border-secondary' : 'border-secondary/20 text-secondary/40 hover:bg-secondary/5'}`}
            >
                PULL
            </button>
        </div>
      </div>

      <div ref={containerRef} className="relative bg-black/40 border border-cta/20 cursor-crosshair overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-auto block" />
        
        {/* Satisfying Glow Effect in Center */}
        <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-transparent to-cta/5 opacity-50" />
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-[10px] uppercase tracking-widest text-secondary/40 font-heading">MATTER.JS // CORE_RENDER</div>
        <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
                <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                    className="w-1 h-1 bg-cta"
                />
            ))}
        </div>
      </div>
    </GlassContainer>
  );
};
