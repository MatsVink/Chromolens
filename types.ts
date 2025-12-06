export enum AppMode {
  CAPTURE = 'CAPTURE',
  TIME_TRAVEL = 'TIME_TRAVEL',
  EDITOR = 'EDITOR',
  ANALYZER = 'ANALYZER'
}

export interface Era {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  imageSrc: string; // Placeholder or icon
}

export interface ProcessingState {
  isLoading: boolean;
  statusMessage: string;
  error?: string;
}

export interface AnalysisResult {
  text: string;
}

// For our internal image handling
export interface AppImage {
  src: string; // Base64 data URL
  type: 'original' | 'generated';
}