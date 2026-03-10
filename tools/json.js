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

    // Helper to safely format/compress without converting unicode strings if unchecked
    // Native JSON.parse -> JSON.stringify naturally converts \uXXXX to actual characters.
    function stringifyPreservingUnicode(obj, space) {
        let str = JSON.stringify(obj, null, space);

        // If the user WANTS to preserve \uXXXX in the output instead of converting to Chinese characters:
        // Actually, native JSON.parse converts \uXXXX to real characters.
        // If they want to KEEP it as \uXXXX in the text, we have to escape the real characters back to \uXXXX.
        // Wait, the user complaint is: "JSON格式化为啥会把unicode码转换成了中文呢。我不需要转啊"
        // This means the input had `\u4e2d\u6587` and the output became `中文`.
        // They want the output to remain `\u4e2d\u6587`.
        if (cbPreserveUnicode && cbPreserveUnicode.checked) {
            // Convert non-ASCII characters back to \uXXXX sequences
            str = str.replace(/[\u007F-\uFFFF]/g, function(chr) {
                return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
            });
        }
        return str;
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
                    updateOutput(text);
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
            updateOutput(`Invalid JSON:\n${e.message}`, true);
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
