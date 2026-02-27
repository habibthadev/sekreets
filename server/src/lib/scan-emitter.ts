import { EventEmitter } from "node:events";

export type ScanEventType = "scanning" | "found" | "done" | "error";

export interface ScanningEvent {
  type: "scanning";
  repo: string;
  file: string;
  query: string;
}

export interface FoundEvent {
  type: "found";
  repo: string;
  repoUrl: string;
  file: string;
  fileUrl: string;
  provider: string;
  patternName: string;
  maskedValue: string;
  entropy: number;
  lineNumber: number | null;
}

export interface DoneEvent {
  type: "done";
  total: number;
}

export interface ScanErrorEvent {
  type: "error";
  message: string;
}

export type ScanEvent = ScanningEvent | FoundEvent | DoneEvent | ScanErrorEvent;

class ScanEmitter extends EventEmitter {}

export const scanEmitter = new ScanEmitter();
scanEmitter.setMaxListeners(100);

export const emitScanEvent = (event: ScanEvent): void => {
  scanEmitter.emit("scan", event);
};
