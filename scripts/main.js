// scripts/main.js

import {recalculateGroups} from "./state.js";
import {renderTable} from "./ui-table.js";
import {applyMinCount, clearTable, renderLegend, resetTable} from "./ui-legend.js";
import {exportTable} from "./export.js";
import {importChunk, importDataFromStorage, importTable} from "./import.js";
import {enableDropOnTextarea} from "./dnd.js";

document.addEventListener("DOMContentLoaded", () => {
    importDataFromStorage();
    recalculateGroups();

    renderTable();
    renderLegend();
    applyMinCount();

    document
        .getElementById("reset-btn")
        .onclick = resetTable;

    document
        .getElementById("export-btn")
        .onclick = exportTable;

    document
        .getElementById("import-btn")
        .onclick = importTable;

    document
        .getElementById("apply-min-count")
        .onclick = applyMinCount;

    document
        .getElementById("clear-btn")
        .onclick = clearTable;


    const chunk1text = document.getElementById("chunk1").value;
    const chunk2text = document.getElementById("chunk2").value;
    const chunk3text = document.getElementById("chunk3").value;
    const chunk4text = document.getElementById("chunk4").value;

    document.getElementById("import-chunk-1").onclick = () => {
        if (chunk1text) importChunk(chunk1text, 1);
    };

    document.getElementById("import-chunk-2").onclick = () => {
        if (chunk2text) importChunk(chunk2text, 2);
    };

    document.getElementById("import-chunk-3").onclick = () => {
        if (chunk3text) importChunk(chunk3text, 3);
    };

    document.getElementById("import-chunk-4").onclick = () => {
        if (chunk4text) importChunk(chunk4text, 4);
    };

    ["chunk1", "chunk2", "chunk3", "chunk4"].forEach(enableDropOnTextarea);
});