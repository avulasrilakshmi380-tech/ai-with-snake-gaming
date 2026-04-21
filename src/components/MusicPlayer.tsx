/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ListMusic } from 'lucide-react';
import { Track } from '../types';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function MusicPlayer({ 
  currentTrackIndex, 
  onTrackChange, 
  isPlaying, 
  onTogglePlay 
}: MusicPlayerProps) {
  const [showPlaylist, setShowPlaylist] = useState(false);
  const currentTrack = TRACKS[currentTrackIndex];

  const handleNext = () => {
    onTrackChange((currentTrackIndex + 1) % TRACKS.length);
  };

  const handlePrev = () => {
    onTrackChange((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 blur-[100px] opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: currentTrack.color }}
      />
      
      <div className="relative z-10 flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">AI Generated Beats</span>
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`p-2 rounded-full transition-colors ${showPlaylist ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <ListMusic size={20} />
          </button>
        </div>

        {/* Dynamic Visualizer (CSS Animation) */}
        <div className="flex items-end justify-center gap-1.5 h-16">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: isPlaying ? [10, 40, 20, 60, 15, 30][(i + Math.floor(Math.random() * 6)) % 6] : 4 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.5 + Math.random() * 0.5,
                ease: "easeInOut" 
              }}
              className="w-1.5 rounded-full"
              style={{ backgroundColor: currentTrack.color }}
            />
          ))}
        </div>

        {/* Track Info */}
        <div className="text-center space-y-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="space-y-1"
            >
              <h3 className="text-2xl font-bold text-white tracking-tight uppercase">{currentTrack.title}</h3>
              <p className="text-sm font-mono text-white/40 tracking-widest">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar (Mock) */}
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full"
              style={{ backgroundColor: currentTrack.color }}
              animate={{ width: isPlaying ? "100%" : "30%" }}
              transition={{ duration: 220, ease: "linear" }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/30 uppercase tracking-tighter">
            <span>1:24</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-4">
          <button 
            onClick={handlePrev}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipBack size={24} />
          </button>
          
          <button 
            onClick={onTogglePlay}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-inner"
            style={{ backgroundColor: currentTrack.color }}
          >
            {isPlaying ? (
              <Pause fill="black" size={32} className="text-black" />
            ) : (
              <Play fill="black" size={32} className="text-black translate-x-0.5" />
            )}
          </button>

          <button 
            onClick={handleNext}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Footer Meta */}
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 text-white/40">
            <Volume2 size={16} />
            <div className="w-16 h-1 bg-white/10 rounded-full">
              <div className="w-2/3 h-full bg-white/40 rounded-full" />
            </div>
          </div>
          <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Hi-Def Neural Audio</span>
        </div>
      </div>

      {/* Playlist Overlay */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute inset-x-0 bottom-0 top-[10%] bg-black/90 backdrop-blur-2xl z-20 p-8 flex flex-col gap-6"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">Up Next</h4>
              <button 
                onClick={() => setShowPlaylist(false)}
                className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {TRACKS.map((track, i) => (
                <button
                  key={track.id}
                  onClick={() => {
                    onTrackChange(i);
                    setShowPlaylist(false);
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                    currentTrackIndex === i ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="text-left">
                    <p className={`text-sm font-bold ${currentTrackIndex === i ? 'text-white' : 'text-white/60'}`}>
                      {track.title}
                    </p>
                    <p className="text-[10px] font-mono text-white/30 uppercase">{track.artist}</p>
                  </div>
                  <span className="text-[10px] font-mono text-white/20">{track.duration}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
