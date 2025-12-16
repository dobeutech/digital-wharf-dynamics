/// <reference types="vite/client" />

interface Window {
  Intercom?: (command: string, ...args: any[]) => void;
}
