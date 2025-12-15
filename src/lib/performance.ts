/**
 * Performance monitoring utilities with reliability improvements
 *
 * Provides tools for measuring and optimizing application performance
 *
 * Reliability features:
 * 1. Defensive null/undefined checks
 * 2. Memory leak prevention
 * 3. Error handling for all operations
 * 4. Automatic cleanup of stale timers
 * 5. Validation of metric names
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

// Maximum number of metrics to keep in memory
const MAX_METRICS = 100;

// Maximum age of a timer before it's considered stale (5 minutes)
const STALE_TIMER_THRESHOLD = 5 * 60 * 1000;

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();
  private lastCleanup: number = Date.now();

  /**
   * Validates a metric name
   */
  private validateMetricName(name: string): boolean {
    if (!name || typeof name !== "string") {
      console.warn("Invalid metric name:", name);
      return false;
    }

    if (name.length > 100) {
      console.warn("Metric name too long (max 100 chars):", name);
      return false;
    }

    return true;
  }

  /**
   * Cleans up stale timers to prevent memory leaks
   */
  private cleanupStaleTimers(): void {
    const now = Date.now();

    // Only cleanup every minute to avoid overhead
    if (now - this.lastCleanup < 60000) {
      return;
    }

    this.lastCleanup = now;

    for (const [name, startTime] of this.timers.entries()) {
      if (now - startTime > STALE_TIMER_THRESHOLD) {
        console.warn(
          `Removing stale timer: ${name} (started ${Math.round((now - startTime) / 1000)}s ago)`,
        );
        this.timers.delete(name);
      }
    }
  }

  /**
   * Start timing an operation
   */
  start(name: string): void {
    try {
      if (!this.validateMetricName(name)) {
        return;
      }

      // Cleanup stale timers periodically
      this.cleanupStaleTimers();

      // Warn if timer already exists (possible duplicate start call)
      if (this.timers.has(name)) {
        console.warn(
          `Timer already running for: ${name}. Overwriting previous start time.`,
        );
      }

      this.timers.set(name, performance.now());
    } catch (error) {
      console.error("Error starting performance timer:", error);
    }
  }

  /**
   * End timing an operation and record the metric
   */
  end(name: string): number | null {
    try {
      if (!this.validateMetricName(name)) {
        return null;
      }

      const startTime = this.timers.get(name);
      if (startTime === undefined || startTime === null) {
        console.warn(`No start time found for metric: ${name}`);
        return null;
      }

      const duration = performance.now() - startTime;

      // Defensive check: Ensure duration is valid
      if (!Number.isFinite(duration) || duration < 0) {
        console.warn(`Invalid duration calculated for ${name}: ${duration}`);
        this.timers.delete(name);
        return null;
      }

      this.timers.delete(name);

      this.metrics.push({
        name,
        duration,
        timestamp: Date.now(),
      });

      // Keep only last MAX_METRICS to avoid memory bloat
      if (this.metrics.length > MAX_METRICS) {
        this.metrics.shift();
      }

      return duration;
    } catch (error) {
      console.error("Error ending performance timer:", error);
      return null;
    }
  }

  /**
   * Get all recorded metrics (defensive copy)
   */
  getMetrics(): PerformanceMetric[] {
    try {
      // Return defensive copy to prevent external modification
      return this.metrics.map((m) => ({ ...m }));
    } catch (error) {
      console.error("Error getting metrics:", error);
      return [];
    }
  }

  /**
   * Get average duration for a specific metric
   */
  getAverage(name: string): number {
    try {
      if (!this.validateMetricName(name)) {
        return 0;
      }

      const filtered = this.metrics.filter((m) => m.name === name);
      if (filtered.length === 0) {
        return 0;
      }

      const sum = filtered.reduce((acc, m) => {
        // Defensive check: Ensure duration is a valid number
        if (!Number.isFinite(m.duration)) {
          console.warn(`Invalid duration in metric: ${m.name}`);
          return acc;
        }
        return acc + m.duration;
      }, 0);

      const average = sum / filtered.length;

      // Defensive check: Ensure result is valid
      return Number.isFinite(average) ? average : 0;
    } catch (error) {
      console.error("Error calculating average:", error);
      return 0;
    }
  }

  /**
   * Clear all metrics and timers
   */
  clear(): void {
    try {
      this.metrics = [];
      this.timers.clear();
      this.lastCleanup = Date.now();
    } catch (error) {
      console.error("Error clearing metrics:", error);
    }
  }

  /**
   * Log slow operations (> threshold ms)
   */
  logSlowOperations(threshold: number = 1000): void {
    try {
      // Defensive check: Validate threshold
      if (!Number.isFinite(threshold) || threshold < 0) {
        console.warn("Invalid threshold for slow operations:", threshold);
        return;
      }

      const slow = this.metrics.filter(
        (m) => Number.isFinite(m.duration) && m.duration > threshold,
      );

      if (slow.length > 0) {
        console.warn("Slow operations detected:", slow);
      }
    } catch (error) {
      console.error("Error logging slow operations:", error);
    }
  }

  /**
   * Get statistics about current monitoring state
   */
  getStats(): {
    totalMetrics: number;
    activeTimers: number;
    oldestMetric: number | null;
    newestMetric: number | null;
  } {
    try {
      return {
        totalMetrics: this.metrics.length,
        activeTimers: this.timers.size,
        oldestMetric:
          this.metrics.length > 0 ? this.metrics[0].timestamp : null,
        newestMetric:
          this.metrics.length > 0
            ? this.metrics[this.metrics.length - 1].timestamp
            : null,
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return {
        totalMetrics: 0,
        activeTimers: 0,
        oldestMetric: null,
        newestMetric: null,
      };
    }
  }
}

export const perfMonitor = new PerformanceMonitor();

/**
 * Decorator for measuring async function performance with error handling
 */
export function measurePerformance<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  name?: string,
): T {
  return (async (...args: Parameters<T>) => {
    // Defensive check: Ensure function is valid
    if (typeof fn !== "function") {
      console.error("measurePerformance: fn is not a function");
      throw new Error("Invalid function provided to measurePerformance");
    }

    const metricName = name || fn.name || "anonymous";

    // Defensive check: Validate metric name
    if (!metricName || typeof metricName !== "string") {
      console.warn("Invalid metric name in measurePerformance");
      // Still execute function even if we can't measure it
      return await fn(...args);
    }

    perfMonitor.start(metricName);

    try {
      const result = await fn(...args);
      const duration = perfMonitor.end(metricName);

      // Defensive check: Ensure duration is valid before logging
      if (duration !== null && Number.isFinite(duration) && duration > 1000) {
        console.warn(
          `Slow operation: ${metricName} took ${duration.toFixed(2)}ms`,
        );
      }

      return result;
    } catch (error) {
      // Ensure timer is stopped even on error
      perfMonitor.end(metricName);
      throw error;
    }
  }) as T;
}

/**
 * React hook for measuring component render performance
 */
export function useRenderPerformance(componentName: string) {
  if (process.env.NODE_ENV === "development") {
    const renderStart = performance.now();

    return () => {
      const renderDuration = performance.now() - renderStart;
      if (renderDuration > 16) {
        // More than one frame (60fps)
        console.warn(
          `Slow render: ${componentName} took ${renderDuration.toFixed(2)}ms`,
        );
      }
    };
  }

  return () => {}; // No-op in production
}

/**
 * Debounce function to prevent excessive calls
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function to limit call frequency
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize expensive function calls
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string,
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);

    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  }) as T;
}

/**
 * Batch multiple operations to reduce overhead
 */
export class BatchProcessor<T> {
  private queue: T[] = [];
  private timer: NodeJS.Timeout | null = null;
  private readonly batchSize: number;
  private readonly delay: number;
  private readonly processor: (items: T[]) => Promise<void>;

  constructor(
    processor: (items: T[]) => Promise<void>,
    options: { batchSize?: number; delay?: number } = {},
  ) {
    this.processor = processor;
    this.batchSize = options.batchSize || 10;
    this.delay = options.delay || 100;
  }

  add(item: T): void {
    this.queue.push(item);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.delay);
    }
  }

  async flush(): Promise<void> {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0) return;

    const items = this.queue.splice(0, this.batchSize);
    await this.processor(items);
  }
}
