// scripts/dnd.js

export function enableDropOnTextarea(textareaId) {
    const textarea = document.getElementById(textareaId);
    if (!textarea) return;

    const box = textarea.closest(".chunk-box") || textarea;

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach(eventName => {
        box.addEventListener(eventName, e => {
            preventDefaults(e);
            box.classList.add("drag-over");
        });
    });

    ["dragleave", "dragend"].forEach(eventName => {
        box.addEventListener(eventName, e => {
            preventDefaults(e);
            box.classList.remove("drag-over");
        });
    });

    box.addEventListener("drop", e => {
        preventDefaults(e);
        box.classList.remove("drag-over");

        const dt = e.dataTransfer;
        if (!dt || !dt.files || dt.files.length === 0) return;

        const file = dt.files[0];

        // Optional: check extension / type
        console.log(file.name);
        if (confirm(`Load file "${file.name}" as data for "${textareaId}" ?`)) {
            readFile(file);
        }
    });

    function readFile(file) {
        const reader = new FileReader();
        reader.onload = evt => {
            textarea.value = evt.target.result || "";
        };
        reader.onerror = () => {
            alert(`Failed to read file: ${file.name}`);
        };
        reader.readAsText(file);
    }
}