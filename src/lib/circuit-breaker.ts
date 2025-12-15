/**
 * Circuit breaker pattern implementation for API calls
 * Prevents cascading failures by stopping requests when a service is down
 */

export enum CircuitState {
  CLOSED = "closed", // Normal operation
  OPEN = "open", // Failing, reject requests immediately
  HALF_OPEN = "half-open", // Testing if service recovered
}

interface CircuitBreakerOptions {
  failureThreshold: number; // Number of failures before opening
  resetTimeout: number; // Time before attempting to close (ms)
  monitoringWindow: number; // Time window for failure counting (ms)
}

interface CircuitBreakerState {
  state: CircuitState;
  failureCount: number;
  lastFailureTime: number | null;
  successCount: number;
  nextAttemptTime: number | null;
}

export class CircuitBreaker {
  private state: CircuitBreakerState;
  private options: CircuitBreakerOptions;

  constructor(options: Partial<CircuitBreakerOptions> = {}) {
    this.options = {
      failureThreshold: options.failureThreshold || 5,
      resetTimeout: options.resetTimeout || 60000, // 1 minute
      monitoringWindow: options.monitoringWindow || 60000, // 1 minute
    };

    this.state = {
      state: CircuitState.CLOSED,
      failureCount: 0,
      lastFailureTime: null,
      successCount: 0,
      nextAttemptTime: null,
    };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.updateState();

    if (this.state.state === CircuitState.OPEN) {
      if (
        this.state.nextAttemptTime &&
        Date.now() < this.state.nextAttemptTime
      ) {
        throw new Error("Circuit breaker is OPEN - service unavailable");
      }
      // Transition to half-open
      this.state.state = CircuitState.HALF_OPEN;
      this.state.successCount = 0;
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private updateState(): void {
    const now = Date.now();

    // Reset failure count if monitoring window has passed
    if (
      this.state.lastFailureTime &&
      now - this.state.lastFailureTime > this.options.monitoringWindow
    ) {
      this.state.failureCount = 0;
    }

    // Check if we should transition from OPEN to HALF_OPEN
    if (
      this.state.state === CircuitState.OPEN &&
      this.state.nextAttemptTime &&
      now >= this.state.nextAttemptTime
    ) {
      this.state.state = CircuitState.HALF_OPEN;
      this.state.successCount = 0;
    }
  }

  private onSuccess(): void {
    if (this.state.state === CircuitState.HALF_OPEN) {
      this.state.successCount++;
      // If we get a few successes, close the circuit
      if (this.state.successCount >= 2) {
        this.state.state = CircuitState.CLOSED;
        this.state.failureCount = 0;
        this.state.nextAttemptTime = null;
      }
    } else {
      // Reset failure count on success
      this.state.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.state.failureCount++;
    this.state.lastFailureTime = Date.now();

    if (this.state.state === CircuitState.HALF_OPEN) {
      // Failed in half-open, go back to open
      this.state.state = CircuitState.OPEN;
      this.state.nextAttemptTime = Date.now() + this.options.resetTimeout;
    } else if (this.state.failureCount >= this.options.failureThreshold) {
      // Too many failures, open the circuit
      this.state.state = CircuitState.OPEN;
      this.state.nextAttemptTime = Date.now() + this.options.resetTimeout;
    }
  }

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitState {
    this.updateState();
    return this.state.state;
  }

  /**
   * Manually reset the circuit breaker
   */
  reset(): void {
    this.state = {
      state: CircuitState.CLOSED,
      failureCount: 0,
      lastFailureTime: null,
      successCount: 0,
      nextAttemptTime: null,
    };
  }
}

/**
 * Create a circuit breaker instance
 */
export function createCircuitBreaker(
  options?: Partial<CircuitBreakerOptions>,
): CircuitBreaker {
  return new CircuitBreaker(options);
}
