document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const btnFormat = document.getElementById('btn-format-json');
    const btnCompress = document.getElementById('btn-compress-json');
    const btnEscape = document.getElementById('btn-escape-json');
    const btnUnescape = document.getElementById('btn-unescape-json');
    const btnCopy = document.getElementById('btn-copy-json');
    const cbPreserveUnicode = document.getElementById('json-preserve-unicode');

    function updateOutput(text, isError = false) {
        jsonOutput.textContent = text;
        if (isError) {
            jsonOutput.classList.add('text-red-500');
            btnCopy.classList.add('hidden');
        } else {
            jsonOutput.classList.remove('text-red-500');
            if (text) {
                btnCopy.classList.remove('hidden');
            } else {
                btnCopy.classList.add('hidden');
            }
        }
    }

    // Helper to safely format/compress
    // Native JSON.parse -> JSON.stringify naturally converts \uXXXX to actual characters.
    function stringifyPreservingUnicode(obj, space) {
        let str = JSON.stringify(obj, null, space);

        // By default, if the user does NOT check the "Decode Unicode" box,
        // we should KEEP the output as \uXXXX (re-escape the characters).
        // If they DO check the box, we let JSON.stringify's natural output remain (which is decoded Chinese characters).
        const cbDecodeUnicode = document.getElementById('json-preserve-unicode');
        if (!cbDecodeUnicode || !cbDecodeUnicode.checked) {
            // Convert non-ASCII characters back to \uXXXX sequences to PRESERVE original escapes
            str = str.replace(/[\u007F-\uFFFF]/g, function(chr) {
                return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
            });
        }
        return str;
    }

    function extractJsonErrorPosition(errorMessage, text) {
        // Standard JSON parse errors usually look like "Unexpected token } in JSON at position 123"
        // or "Unexpected string in JSON at position 45"
        const match = errorMessage.match(/at position (\d+)/);
        if (match && match[1]) {
            const pos = parseInt(match[1], 10);
            if (!isNaN(pos)) {
                // Get context around the error
                const start = Math.max(0, pos - 20);
                const end = Math.min(text.length, pos + 20);
                let contextStr = text.substring(start, end);

                // Insert a pointer at the exact error spot
                const pointerPos = pos - start;
                contextStr = contextStr.substring(0, pointerPos) + '👇' + contextStr.substring(pointerPos);

                return `\n\nError Context:\n...${contextStr}...`;
            }
        }
        return '';
    }

    function processJson(action) {
        const input = jsonInput.value;
        if (!input.trim()) {
            updateOutput('');
            return;
        }

        try {
            if (action === 'unescape') {
                let text = input.trim();
                try {
                    let parsedText = JSON.parse(text);
                    if (typeof parsedText === 'string') {
                        text = parsedText;
                    }
                } catch(e) {
                    text = text.replace(/\\"/g, '"')
                               .replace(/\\\\/g, '\\')
                               .replace(/\\n/g, '\n')
                               .replace(/\\r/g, '\r')
                               .replace(/\\t/g, '\t');
                }

                try {
                    const obj = JSON.parse(text);
                    updateOutput(stringifyPreservingUnicode(obj, 4));
                } catch(e) {
                    // Try to provide error context even if it fails during formatting after unescaping
                    const context = extractJsonErrorPosition(e.message, text);
                    updateOutput(`Invalid JSON after unescaping:\n${e.message}${context}`, true);
                }
                return;
            }

            if (action === 'escape') {
                let text = input.trim();
                try {
                    const obj = JSON.parse(text);
                    text = stringifyPreservingUnicode(obj);
                } catch(e) {
                }

                updateOutput(JSON.stringify(text));
                return;
            }

            const parsed = JSON.parse(input);
            if (action === 'format') {
                updateOutput(stringifyPreservingUnicode(parsed, 4));
            } else if (action === 'compress') {
                updateOutput(stringifyPreservingUnicode(parsed));
            }
        } catch (e) {
            const context = extractJsonErrorPosition(e.message, input);
            updateOutput(`Invalid JSON:\n${e.message}${context}`, true);
        }
    }

    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            if (jsonOutput.textContent) {
                navigator.clipboard.writeText(jsonOutput.textContent).then(() => {
                    const originalText = btnCopy.textContent;
                    btnCopy.textContent = 'Copied!';
                    setTimeout(() => { btnCopy.textContent = originalText; }, 2000);
                });
            }
        });
    }

    btnFormat.addEventListener('click', () => processJson('format'));
    btnCompress.addEventListener('click', () => processJson('compress'));
    if (btnEscape) btnEscape.addEventListener('click', () => processJson('escape'));
    if (btnUnescape) btnUnescape.addEventListener('click', () => processJson('unescape'));
});
