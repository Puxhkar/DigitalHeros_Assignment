import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeDate(date: string | Date) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

/** Calculate prize pool splits from total subscription revenue */
export function calculatePrizePool(totalRevenue: number) {
  return {
    jackpot: totalRevenue * 0.4,
    tierTwo: totalRevenue * 0.35,
    tierThree: totalRevenue * 0.25,
  };
}

/** Calculate charity contribution amount */
export function calculateCharityAmount(subscriptionAmount: number, percentage: number) {
  return (subscriptionAmount * percentage) / 100;
}

/** Generate 5 unique random numbers between 1 and 45 */
export function generateRandomDraw(): number[] {
  const numbers: Set<number> = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

/** Generate 5 draw numbers based on score frequency analysis */
export function generateAlgorithmicDraw(
  scores: number[],
  strategy: 'most_frequent' | 'least_frequent'
): number[] {
  // Build frequency map
  const freq: Record<number, number> = {};
  for (let i = 1; i <= 45; i++) freq[i] = 0;
  for (const s of scores) {
    if (freq[s] !== undefined) freq[s]++;
  }

  // Sort by frequency
  const sorted = Object.entries(freq)
    .map(([num, count]) => ({ num: parseInt(num), count }))
    .sort((a, b) =>
      strategy === 'most_frequent' ? b.count - a.count : a.count - b.count
    );

  // Take top 5 with slight random variation
  const top10 = sorted.slice(0, 10);
  const shuffled = top10.sort(() => Math.random() - 0.5);
  return shuffled
    .slice(0, 5)
    .map((x) => x.num)
    .sort((a, b) => a - b);
}

/** Count how many numbers match between user scores and draw numbers */
export function countMatches(userScores: number[], drawNumbers: number[]): number {
  return userScores.filter((s) => drawNumbers.includes(s)).length;
}

/** Determine match tier */
export function getMatchTier(matches: number): 3 | 4 | 5 | null {
  if (matches >= 5) return 5;
  if (matches === 4) return 4;
  if (matches === 3) return 3;
  return null;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
