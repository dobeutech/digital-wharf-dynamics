/// <reference types="vite/client" />

interface Window {
  Intercom?: (command: string, ...args: unknown[]) => void;
}
