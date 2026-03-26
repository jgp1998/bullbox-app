import { Theme, RecordType, WeightUnit, Plate } from './types';

export const themes: Theme[] = [
  {
    name: 'BullBox Dark',
    colors: {
      '--background': '#1a1a1a',
      '--card': '#2c2c2c',
      '--input': '#3a3a3a',
      '--text': '#f0f0f0',
      '--muted-text': '#a0a0a0',
      '--primary': '#e63946',
      '--secondary': '#f1faee',
      '--accent': '#a8dadc',
      '--border': '#4a4a4a',
    },
  },
  {
    name: 'BullBox Light',
    colors: {
      '--background': '#f1faee',
      '--card': '#ffffff',
      '--input': '#e9ecef',
      '--text': '#1d3557',
      '--muted-text': '#457b9d',
      '--primary': '#e63946',
      '--secondary': '#1d3557',
      '--accent': '#457b9d',
      '--border': '#ced4da',
    },
  },
    {
    name: 'Oceanic Blue',
    colors: {
      '--background': '#023047',
      '--card': '#023e5a',
      '--input': '#035378',
      '--text': '#ffffff',
      '--muted-text': '#b3cde0',
      '--primary': '#fb8500',
      '--secondary': '#219ebc',
      '--accent': '#8ecae6',
      '--border': '#035e87',
    },
  },
];

export const RECORD_TYPES: RecordType[] = ['Weight', 'Reps', 'Time'];
export const WEIGHT_UNITS: WeightUnit[] = ['kg', 'lbs'];

export const OLYMPIC_BARBELLS = {
  male: { kg: 20, lbs: 45 },
  female: { kg: 15, lbs: 33 },
};

export const PLATES_KG: Plate[] = [
  { weight: 25, color: '#E63946' }, // red
  { weight: 20, color: '#1D3557' }, // blue
  { weight: 15, color: '#FCA311' }, // yellow
  { weight: 10, color: '#2A9D8F' }, // green
  { weight: 5, color: '#F1FAEE' }, // white
  { weight: 2.5, color: '#6C757D' }, // black
  { weight: 1.25, color: '#ADB5BD' }, // silver
  { weight: 0.5, color: '#DEE2E6' }, // light grey
];

export const PLATES_LBS: Plate[] = [
  { weight: 45, color: '#1D3557' }, // blue
  { weight: 35, color: '#FCA311' }, // yellow
  { weight: 25, color: '#2A9D8F' }, // green
  { weight: 10, color: '#F1FAEE' }, // white
  { weight: 5, color: '#6C757D' }, // black
  { weight: 2.5, color: '#ADB5BD' }, // silver
];