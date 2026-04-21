/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { TRACKS } from './constants';
import { motion } from 'motion/react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const currentTrack = TRACKS[currentTrackIndex];

  // Auto-play game audio when game is active or player starts
  // Note: We don't have real audio files, so we just toggle isPlaying state

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 overflow-x-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] blur-[120px] transition-colors duration-1000"
          style={{ 
            background: `radial-gradient(circle at center, ${currentTrack.color}33 0%, transparent 70%)` 
          }}
        />
      </div>

      {/* Retro Polish: Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <main className="relative z-10 min-h-screen grid lg:grid-cols-[1fr_450px] items-center p-6 lg:p-12 gap-12">
        {/* Game Section (Center-Left) */}
        <section className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <SnakeGame 
              onScoreChange={setGameScore} 
              accentColor={currentTrack.color} 
            />
          </motion.div>
        </section>

        {/* Sidebar Controls (Right) */}
        <aside className="flex flex-col gap-8 items-center lg:items-start h-full justify-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="w-full flex flex-col gap-8"
          >
            {/* App Branding */}
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-6xl font-bold tracking-tighter uppercase">
                Neon <span style={{ color: currentTrack.color }}>Beats</span>
              </h1>
              <p className="font-mono text-xs text-white/30 tracking-[0.3em] uppercase max-w-sm leading-relaxed">
                Cybernetic Arcade Integration v1.0. High-performance gaming, neural-audio synthesis.
              </p>
            </div>

            {/* Music Player */}
            <div className="flex justify-center lg:justify-start">
              <MusicPlayer 
                currentTrackIndex={currentTrackIndex}
                onTrackChange={setCurrentTrackIndex}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
              />
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Session Score</p>
                <p className="text-2xl font-bold text-white tracking-tight">{gameScore}</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Grid Size</p>
                <p className="text-2xl font-bold text-white tracking-tight">20x20</p>
              </div>
            </div>
          </motion.div>
        </aside>
      </main>

      {/* Decorative Rail Text */}
      <div className="fixed bottom-12 left-12 hidden xl:block">
        <p className="writing-vertical-rl rotate-180 font-mono text-[10px] text-white/10 tracking-[0.5em] uppercase">
          Neural Transmission Active • Grid Established • Pulse Rate: 120BPM
        </p>
      </div>
    </div>
  );
}
