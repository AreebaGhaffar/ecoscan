
export enum DisposalCategory {
  RECYCLABLE = 'Recyclable',
  COMPOSTABLE = 'Compostable',
  LANDFILL = 'Landfill'
}

export interface MaterialPart {
  part: string;
  material: string;
}

export interface EcoScanResult {
  item: string;
  category: DisposalCategory;
  reason: string;
  confidence: number;
  materials: MaterialPart[];
  observations: string[];
}

export interface HistoryItem {
  id: string;
  result: EcoScanResult;
  previewUrl: string;
}

export interface AppState {
  status: 'idle' | 'loading' | 'success' | 'error';
  result?: EcoScanResult;
  error?: string;
  previewUrl?: string;
}
