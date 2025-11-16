// scripts/ui-table.js

import {
    activeLegendValue,
    colorByValue,
    data,
    duplicateValues,
    freq,
    minGroupCount,
    setActiveLegendValue
} from "./state.js";

export function buildTable() {
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    for (const row of data) {
        const tr = document.createElement("tr");

        for (const value of row) {
            const td = document.createElement("td");
            td.textContent = value;
            td.dataset.value = value;

            const color = colorByValue.get(value);
            if (color) {
                td.style.backgroundColor = color;
            }
            if (duplicateValues.includes(value) && (freq.get(value) || 0) < minGroupCount) {
                td.classList.add("greyed");
            }

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    return table;
}

export function renderTable() {
    const container = document.getElementById("table-container");
    container.innerHTML = "";
    container.appendChild(buildTable());
}

export function setHighlight(targetValue) {
    const cells = document.querySelectorAll("#table-container td");

    if (!targetValue) {
        cells.forEach(td => {
            td.classList.remove("highlight-match", "dimmed");
        });
        return;
    }

    cells.forEach(td => {
        if (td.dataset.value === targetValue) {
            td.classList.add("highlight-match");
            td.classList.remove("dimmed");
        } else {
            td.classList.remove("highlight-match");
            td.classList.add("dimmed");
        }
    });
}

export function handleLegendClick(value, legendItem) {
    if (activeLegendValue === value) {
        setActiveLegendValue(null);
        setHighlight(null);
        legendItem.classList.remove("active");
        return;
    }

    setActiveLegendValue(value);
    setHighlight(value);

    document.querySelectorAll(".legend-item").forEach(el => {
        el.classList.remove("active");
    });
    legendItem.classList.add("active");
}