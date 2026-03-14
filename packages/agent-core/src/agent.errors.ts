// SPDX-License-Identifier: MIT
// @novasphere/agent-core — agent.errors
// Base and concrete agent error types.

/** Base error for agent/adapter failures. */
export class AgentError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'AgentError';
    Object.setPrototypeOf(this, AgentError.prototype);
  }
}

/** Thrown when Ollama health check (GET /api/tags) fails or times out. */
export class OllamaNotReachableError extends AgentError {
  constructor(message: string = 'Ollama is not reachable', options?: ErrorOptions) {
    super(message, options);
    this.name = 'OllamaNotReachableError';
    Object.setPrototypeOf(this, OllamaNotReachableError.prototype);
  }
}

/** Thrown on network errors when calling the AI backend. */
export class AgentNetworkError extends AgentError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'AgentNetworkError';
    Object.setPrototypeOf(this, AgentNetworkError.prototype);
  }
}

/** Thrown when the agent response is not valid JSON or cannot be parsed. */
export class AgentParseError extends AgentError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'AgentParseError';
    Object.setPrototypeOf(this, AgentParseError.prototype);
  }
}

/** Thrown when a chat or stream request exceeds the configured timeout. */
export class AgentTimeoutError extends AgentError {
  readonly name = 'AgentTimeoutError';
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AgentTimeoutError.prototype);
  }
}

/** Thrown when WebGPU is not available (e.g. browser without WebGPU support). */
export class WebGPUNotSupportedError extends AgentError {
  constructor(message: string = 'WebGPU is not supported', options?: ErrorOptions) {
    super(message, options);
    this.name = 'WebGPUNotSupportedError';
    Object.setPrototypeOf(this, WebGPUNotSupportedError.prototype);
  }
}
