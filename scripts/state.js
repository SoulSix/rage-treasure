// scripts/state.js

export let data = [];
export const STORAGE_KEY = "aarage_treasuremaps_data_v1";

export let originalData = data.map(row => [...row]);
export let minGroupCount = 1;

export const colorPalette = [
    "#e6194b", "#3cb44b", "#0082c8", "#f58231",
    "#911eb4", "#46f0f0", "#f032e6", "#d2f53c",
    "#fabebe", "#008080", "#e6beff", "#aa6e28",
    "#fffac8", "#800000", "#aaffc3", "#808000",
    "#ffd8b1", "#0050a0", "#808080", "#ffffaa",
    "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99",
    "#e31a1c", "#fdbf6f", "#ff9f44", "#cab2d6",
    "#6a3d9a", "#b15928"
];

export let baseColorByValue = new Map();
export let colorByValue = new Map();
export let nextColorIndex = 0;
export const deletedGroups = new Map();

export let freq = new Map();
export let duplicateValues = [];
export let activeLegendValue = null;
export let lastExportBackup = null;

// --- setters for things that other modules need to reassign ---
export function setData(newData) {
    data = newData;
}

export function setOriginalData(newOriginal) {
    originalData = newOriginal;
}

export function setMinGroupCount(value) {
    minGroupCount = value;
}

export function setActiveLegendValue(value) {
    activeLegendValue = value;
}

export function setLastExportBackup(value) {
    lastExportBackup = value;
}

// --- helpers ---

export function trimData() {
    data = data.map(row => row.map(v => (v || "").trim()));
}

export function recalculateGroups() {
    trimData()
    freq = new Map();

    for (const row of data) {
        for (let value of row) {
            value = (value || "").toString();
            if (!value) continue;
            freq.set(value, (freq.get(value) || 0) + 1);
        }
    }

    duplicateValues = Array.from(freq.entries())
        .filter(([, count]) => count > 1)
        .map(([value]) => value);

    // rebuild active color map, but reuse old colors
    colorByValue = new Map();

    for (const value of duplicateValues) {
        let color = baseColorByValue.get(value);
        if (!color) {
            color = colorPalette[nextColorIndex % colorPalette.length];
            baseColorByValue.set(value, color);
            nextColorIndex++;
        }
        colorByValue.set(value, color);
    }
}