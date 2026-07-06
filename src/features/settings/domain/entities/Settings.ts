export interface Settings {
  readonly id: number;
  readonly accentColor: string;
  readonly amoledMode: boolean;
  readonly systemMode: 'system' | 'light' | 'dark';
}
