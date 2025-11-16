// scripts/export.js

import {data, setLastExportBackup, STORAGE_KEY} from "./state.js";

export async function exportTable() {
    const json = JSON.stringify(data);
    const encoded = LZString.compressToEncodedURIComponent(json);
    localStorage.setItem(STORAGE_KEY, json);
    setLastExportBackup(json);

    const outputLink = document.getElementById("export-output-link");
    const linkValue = window.location.origin + window.location.pathname + "?state=" + encoded;
    if (outputLink) {
        outputLink.value = linkValue;
    }

    try {
        await navigator.clipboard.writeText(linkValue);
        alert("Map data copied to clipboard!");
    } catch (err) {
        console.warn("Clipboard API failed", err);
    }
}