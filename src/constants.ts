/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'AI Synthwave',
    duration: '3:45',
    color: '#00ffcc', // Cyan
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Neural Beats',
    duration: '4:12',
    color: '#ff00ff', // Pink
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Core Logic',
    duration: '2:58',
    color: '#ffff00', // Yellow
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const GAME_SPEED = 150;
