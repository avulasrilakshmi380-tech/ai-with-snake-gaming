/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  accentColor: string;
}

export default function SnakeGame({ onScoreChange, accentColor }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const lastDirection = useRef<Direction>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastDirection.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (lastDirection.current !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (lastDirection.current !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (lastDirection.current !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (lastDirection.current !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameOver]);

  useEffect(() => {
    if (isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        lastDirection.current = direction;

        // Collision Check
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)
        ) {
          setIsGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food Check
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [direction, food, isPaused, isGameOver, score, highScore, onScoreChange, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear Canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = accentColor;
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    ctx.shadowBlur = 10;
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#fff' : accentColor;
      ctx.shadowColor = accentColor;
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });

    ctx.shadowBlur = 0;
  }, [snake, food, accentColor]);

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Stats Header */}
      <div className="w-full flex justify-between items-end px-4 gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">Current Score</span>
          <span className="text-4xl font-mono font-bold text-white tracking-tighter" style={{ color: accentColor }}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 flex items-center gap-1">
            <Trophy size={10} /> High Score
          </span>
          <span className="text-2xl font-mono font-medium text-white/80">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative p-1 bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-lg cursor-none sm:w-[500px] sm:h-[500px] max-w-full"
        />

        {/* Overlay States */}
        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
            >
              <button
                onClick={() => setIsPaused(false)}
                className="group flex flex-col items-center gap-3 transition-transform hover:scale-110"
              >
                <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors">
                  <Play fill="currentColor" size={32} />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-white/80">Press Space to Start</span>
              </button>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6"
            >
              <div className="text-center">
                <h2 className="text-5xl font-bold text-white mb-2 tracking-tighter">GAME OVER</h2>
                <p className="text-white/40 font-mono text-sm uppercase tracking-widest">Final Score: {score}</p>
              </div>
              
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-colors"
                style={{ backgroundColor: accentColor }}
              >
                <RotateCcw size={16} /> Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Hint */}
      <div className="flex gap-8 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 text-white/60">ARROWS</span>
          <span>TO MOVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5 text-white/60">SPACE</span>
          <span>TO PAUSE</span>
        </div>
      </div>
    </div>
  );
}
