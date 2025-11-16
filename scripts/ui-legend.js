// scripts/ui-legend.js

import {
    baseColorByValue,
    colorByValue,
    data,
    deletedGroups,
    duplicateValues,
    freq,
    minGroupCount,
    originalData,
    recalculateGroups,
    setActiveLegendValue,
    setData,
    setMinGroupCount,
    setOriginalData,
    trimData,
    STORAGE_KEY
} from "./state.js";

import {handleLegendClick, renderTable, setHighlight} from "./ui-table.js";

export function deactivateLegendHighlight() {
    setActiveLegendValue(null);
    setHighlight(null);
    document.querySelectorAll(".legend-item").forEach(el =>
        el.classList.remove("active")
    );
}

export function deleteGroup(value) {
    const positions = [];

    for (let r = 0; r < data.length; r++) {
        for (let c = 0; c < data[r].length; c++) {
            if (data[r][c] === value) {
                positions.push([r, c]);
                data[r][c] = "";
            }
        }
    }

    deletedGroups.set(value, positions);

    recalculateGroups();
    deactivateLegendHighlight();
    renderTable();
    renderLegend();
}

export function restoreGroup(value) {
    const positions = deletedGroups.get(value);
    if (!positions) return;

    for (const [r, c] of positions) {
        if (data[r][c] === "") {
            data[r][c] = value;
        }
    }

    deletedGroups.delete(value);

    recalculateGroups();
    deactivateLegendHighlight();
    renderTable();
    renderLegend();
}

export function resetTable() {
    // restore from originalData
    const restored = originalData.map(row => [...row]);
    for (let r = 0; r < restored.length; r++) {
        data[r] = restored[r];
    }
    trimData();

    recalculateGroups(); // ensures legend/freq match the reset data
    deactivateLegendHighlight();
    renderTable();
    renderLegend();
}

export function clearTable() {
    const emptyGrid = Array.from({length: 30}, () =>
        Array.from({length: 20}, () => "")
    );

    // 2) Replace current data + baseline
    setData(emptyGrid);
    setOriginalData(emptyGrid.map(row => [...row]));

    // 3) No deleted groups anymore
    deletedGroups.clear();

    // 4) Recalculate groups on the cleared grid
    recalculateGroups();

    // 5) Clear highlight / legend selection
    deactivateLegendHighlight();

    // 6) Redraw UI
    renderTable();
    renderLegend();

    // 7) Persist cleared grid as current data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyGrid));
}

export function renderLegend() {
    const legendContainer = document.getElementById("legend");
    legendContainer.innerHTML = "";

    const allLegendValuesSet = new Set([
        ...duplicateValues,
        ...deletedGroups.keys()
    ]);
    const allLegendValues = [...allLegendValuesSet];

    if (allLegendValues.length === 0) {
        const span = document.createElement("span");
        span.className = "legend-empty";
        span.textContent = "No duplicate values.";
        legendContainer.appendChild(span);
        return;
    }

    const filteredValues = allLegendValues.filter(value => {
        const isDeleted = deletedGroups.has(value);
        if (isDeleted) return true;
        const count = freq.get(value) || 0;
        return count >= minGroupCount;
    });

    const sortedValues = filteredValues.sort(
        (a, b) => (freq.get(b) || 0) - (freq.get(a) || 0)
    );

    const MAX_PER_COLUMN = 20;

    for (let i = 0; i < sortedValues.length; i += MAX_PER_COLUMN) {
        const columnValues = sortedValues.slice(i, i + MAX_PER_COLUMN);

        const colDiv = document.createElement("div");
        colDiv.className = "legend-column";

        for (const value of columnValues) {
            const item = document.createElement("div");
            item.className = "legend-item";
            item.dataset.value = value;

            const swatch = document.createElement("div");
            swatch.className = "legend-swatch";
            swatch.style.backgroundColor =
                colorByValue.get(value) || baseColorByValue.get(value) || "#ccc";

            const count = freq.get(value) || 0;
            const label = document.createElement("span");
            label.textContent = `${value} (${count})`;

            const isDeleted = deletedGroups.has(value);
            if (isDeleted) {
                item.classList.add("deleted");
            }

            const delBtn = document.createElement("button");
            delBtn.textContent = "✕";
            delBtn.className = "legend-delete";
            delBtn.title = "delete-group";
            delBtn.addEventListener("click", e => {
                e.stopPropagation();
                deleteGroup(value);
            });

            const restoreBtn = document.createElement("button");
            restoreBtn.textContent = "↺";
            restoreBtn.className = "legend-restore";
            restoreBtn.title = "restore-group";
            restoreBtn.addEventListener("click", e => {
                e.stopPropagation();
                restoreGroup(value);
            });

            item.addEventListener("click", () => handleLegendClick(value, item));

            item.appendChild(swatch);
            item.appendChild(label);
            item.appendChild(delBtn);
            item.appendChild(restoreBtn);
            colDiv.appendChild(item);
        }

        legendContainer.appendChild(colDiv);
    }
}

export function applyMinCount() {
    const val = parseInt(document.getElementById("min-count-input").value, 10);
    const newVal = Math.max(1, val || 1);
    setMinGroupCount(newVal);
    renderTable();
    renderLegend();
}