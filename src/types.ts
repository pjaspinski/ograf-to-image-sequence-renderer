export interface Resolution {
  width: number;
  height: number;
}

export interface RenderSettings {
  resolution: Resolution;
  outputDirectory: string;
  manifestPath: string;
}
