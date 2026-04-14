import { Theme, RecordType, WeightUnit } from "@/shared/types";
import { Plate } from "@/features/weight-converter";

export const themes: Theme[] = [
  {
    name: "Dark",
    colors: {
      "--background": "#1a1a1a",
      "--card": "#2c2c2c",
      "--input": "#3a3a3a",
      "--text": "#f0f0f0",
      "--muted-text": "#a0a0a0",
      "--primary": "#e63946",
      "--secondary": "#f1faee",
      "--accent": "#a8dadc",
      "--border": "#4a4a4a",
    },
  },
  {
    name: "Light",
    colors: {
      "--background": "#f1faee",
      "--card": "#ffffff",
      "--input": "#e9ecef",
      "--text": "#1d3557",
      "--muted-text": "#457b9d",
      "--primary": "#e63946",
      "--secondary": "#1d3557",
      "--accent": "#457b9d",
      "--border": "#ced4da",
    },
  },
  {
    name: "Bullbox",
    colors: {
      "--background": "#000000",
      "--card": "#0a0a0a",
      "--input": "#141414",
      "--text": "#ffffff",
      "--muted-text": "#a0a0a0",
      "--primary": "#FF9D13",
      "--secondary": "#9F5B09",
      "--accent": "#FF9D13",
      "--border": "#222222",
    },
  },
];

export const RECORD_TYPES: RecordType[] = ["Weight", "Reps", "Time"];
export const WEIGHT_UNITS: WeightUnit[] = ["kg", "lbs"];

export const OLYMPIC_BARBELLS = {
  male: { kg: 20, lbs: 45 },
  female: { kg: 15, lbs: 33 },
};

export const PLATES_KG: Plate[] = [
  { weight: 25, color: "#FF3B30" }, // 🔴 Red
  { weight: 20, color: "#007AFF" }, // 🔵 Blue
  { weight: 15, color: "#FFCC00" }, // 🟡 Yellow
  { weight: 10, color: "#28CD41" }, // 🟢 Green
  { weight: 5, color: "#FFFFFF" }, // ⚪ White
  { weight: 2.5, color: "#F2F2F7" }, // ⚪ White/Light Grey
  { weight: 2, color: "#FF3B30" }, // 🔴 Red
  { weight: 1.5, color: "#007AFF" }, // 🔵 Blue
  { weight: 1.25, color: "#8E8E93" }, // ⚪ Grey (Standard increment)
  { weight: 1, color: "#FFCC00" }, // 🟡 Yellow
  { weight: 0.5, color: "#28CD41" }, // 🟢 Green
];

export const PLATES_LBS: Plate[] = [
  { weight: 45, color: "#FF3B30" }, // 🔴 Red
  { weight: 35, color: "#007AFF" }, // 🔵 Blue
  { weight: 25, color: "#FFCC00" }, // 🟡 Yellow
  { weight: 15, color: "#28CD41" }, // 🟢 Green
  { weight: 10, color: "#FFFFFF" }, // ⚪ White
  { weight: 5, color: "#F2F2F7" }, // ⚪ White/Light Grey
  { weight: 2.5, color: "#E5E5EA" }, // ⚪ Greyish
];
