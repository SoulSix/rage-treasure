// scripts/import.js

import {exportTable} from "./export.js";
import {data, recalculateGroups, setActiveLegendValue, setData, setOriginalData, STORAGE_KEY} from "./state.js";
import {renderTable, setHighlight} from "./ui-table.js";
import {renderLegend} from "./ui-legend.js";

export function importTable() {
    const statusEl = document.getElementById("import-status");
    if (statusEl) statusEl.textContent = "";

    exportTable();

    const raw = document.getElementById("import-input").value.trim();
    if (!raw) {
        if (statusEl) statusEl.textContent = "Import failed: input is empty.";
        return;
    }

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        if (statusEl) statusEl.textContent = "Import failed: invalid JSON.";
        return;
    }

    const isValid =
        Array.isArray(parsed) &&
        parsed.every(
            row =>
                Array.isArray(row) &&
                row.every(
                    cell =>
                        typeof cell === "string" ||
                        cell === null ||
                        cell === undefined
                )
        );

    if (!isValid) {
        if (statusEl) {
            statusEl.textContent =
                "Import failed: expected an array of arrays of strings.";
        }
        return;
    }

    parsed = parsed.map(row => row.map(v => (v == null ? "" : String(v))));

    setData(parsed);
    setOriginalData(parsed.map(row => [...row]));

    setActiveLegendValue(null);
    setHighlight(null);
    document.querySelectorAll(".legend-item").forEach(el =>
        el.classList.remove("active")
    );

    recalculateGroups();
    renderTable();
    renderLegend();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));

    if (statusEl) {
        statusEl.textContent = "Import successful. Reset now returns to this dataset.";
    }
}

export function importChunk(chunkData, chunkId) {
    const cfg = {
        1: {rowStart: 0, colStart: 0},
        2: {rowStart: 0, colStart: 10},
        3: {rowStart: 15, colStart: 0},
        4: {rowStart: 15, colStart: 10}
    }[chunkId];

    if (!cfg) throw new Error("Unknown chunk id: " + chunkId);

    let parsedData = JSON.parse(chunkData)
    // Validate and prepare chunk data
    while (parsedData.length < 15) {
        parsedData.push([])
    }
    for (let r = 0; r < parsedData.length; r++) {
        while (parsedData[r].length < 10) {
            parsedData[r].push("");
        }
    }

    // Fill data
    const {rowStart, colStart} = cfg;

    for (let r = 0; r < parsedData.length; r++) {
        for (let c = 0; c < parsedData[r].length; c++) {
            const R = rowStart + r;
            const C = colStart + c;

            if (R < data.length && C < data[0].length) {
                data[R][C] = (parsedData[r][c] ?? "").toString().trim();
            }
        }
    }

    recalculateGroups();
    renderTable();
    renderLegend();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function importDataFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
        const parsed = JSON.parse(stored);

        const isValid =
            Array.isArray(parsed) &&
            parsed.every(
                row =>
                    Array.isArray(row) &&
                    row.every(
                        cell =>
                            typeof cell === "string" ||
                            cell === null ||
                            cell === undefined
                    )
            );

        if (!isValid) {
            console.warn("Stored table data is invalid, ignoring.");
            return;
        }

        const normalized = parsed.map(row => row.map(v => (v == null ? "" : String(v))));
        setData(normalized);
        setOriginalData(normalized.map(row => [...row]));
    } catch (e) {
        console.warn("Failed to parse stored table data:", e);
    }
}