// scripts/export.js

import {data, setLastExportBackup, STORAGE_KEY} from "./state.js";

export function exportTable() {
    const json = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, json);
    setLastExportBackup(json);

    const output = document.getElementById("export-output");
    if (output) {
        output.value = json;
    }

    return json;
}