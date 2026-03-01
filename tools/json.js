document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const btnFormat = document.getElementById('btn-format-json');
    const btnCompress = document.getElementById('btn-compress-json');
    const btnEscape = document.getElementById('btn-escape-json');
    const btnUnescape = document.getElementById('btn-unescape-json');

    function processJson(action) {
        const input = jsonInput.value;
        if (!input.trim()) {
            jsonOutput.value = '';
            return;
        }

        try {
            if (action === 'unescape') {
                let text = input.trim();
                try {
                    // If it's a valid JSON string (like "\"{\\\"a\\\":1}\"")
                    let parsedText = JSON.parse(text);
                    if (typeof parsedText === 'string') {
                        text = parsedText;
                    }
                } catch(e) {
                    // Fallback to manual unescape if it's not wrapped in quotes properly
                    text = text.replace(/\\"/g, '"')
                               .replace(/\\\\/g, '\\')
                               .replace(/\\n/g, '\n')
                               .replace(/\\r/g, '\r')
                               .replace(/\\t/g, '\t');
                }

                // Attempt to format the unescaped text as JSON
                try {
                    const obj = JSON.parse(text);
                    jsonOutput.value = JSON.stringify(obj, null, 4);
                    jsonOutput.classList.remove('text-red-500');
                } catch(e) {
                    // If it's still not valid JSON, just output the raw unescaped string
                    jsonOutput.value = text;
                    jsonOutput.classList.remove('text-red-500');
                }
                return;
            }

            if (action === 'escape') {
                let text = input.trim();
                try {
                    // Try to minify first if the input is a valid JSON object
                    const obj = JSON.parse(text);
                    text = JSON.stringify(obj);
                } catch(e) {
                    // If not valid JSON, we just treat it as a raw string to escape
                }

                jsonOutput.value = JSON.stringify(text);
                jsonOutput.classList.remove('text-red-500');
                return;
            }

            const parsed = JSON.parse(input);
            if (action === 'format') {
                jsonOutput.value = JSON.stringify(parsed, null, 4);
            } else if (action === 'compress') {
                jsonOutput.value = JSON.stringify(parsed);
            }
            jsonOutput.classList.remove('text-red-500');
        } catch (e) {
            jsonOutput.value = `Invalid JSON:\n${e.message}`;
            jsonOutput.classList.add('text-red-500');
        }
    }

    btnFormat.addEventListener('click', () => processJson('format'));
    btnCompress.addEventListener('click', () => processJson('compress'));
    if (btnEscape) btnEscape.addEventListener('click', () => processJson('escape'));
    if (btnUnescape) btnUnescape.addEventListener('click', () => processJson('unescape'));
});
