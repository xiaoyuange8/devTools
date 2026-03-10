document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('unicode-input');
    const output = document.getElementById('unicode-output');
    const btnToUnicode = document.getElementById('btn-to-unicode');
    const btnToText = document.getElementById('btn-to-text');
    const btnToAscii = document.getElementById('btn-to-ascii');
    const btnCopy = document.getElementById('btn-copy-unicode');

    function updateOutput(text, isError = false) {
        output.textContent = text;
        if (isError) {
            output.classList.add('text-red-500');
            btnCopy.classList.add('hidden');
        } else {
            output.classList.remove('text-red-500');
            if (text) {
                btnCopy.classList.remove('hidden');
            } else {
                btnCopy.classList.add('hidden');
            }
        }
    }

    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            if (output.textContent) {
                navigator.clipboard.writeText(output.textContent).then(() => {
                    const originalText = btnCopy.textContent;
                    btnCopy.textContent = 'Copied!';
                    setTimeout(() => { btnCopy.textContent = originalText; }, 2000);
                });
            }
        });
    }

    // Text to \uXXXX
    btnToUnicode.addEventListener('click', () => {
        const str = input.value;
        if (!str) {
            updateOutput('');
            return;
        }

        let result = '';
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code > 127) {
                result += '\\u' + code.toString(16).padStart(4, '0');
            } else {
                result += str[i];
            }
        }
        updateOutput(result);
    });

    // Unicode (\uXXXX) to Text
    btnToText.addEventListener('click', () => {
        const str = input.value;
        if (!str) {
            updateOutput('');
            return;
        }

        try {
            // Regex to match \uXXXX
            let result = str.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
                return String.fromCharCode(parseInt(grp, 16));
            });
            updateOutput(result);
        } catch (e) {
            updateOutput('Error converting Unicode to text.', true);
        }
    });

    // Text to ASCII (just char codes)
    btnToAscii.addEventListener('click', () => {
        const str = input.value;
        if (!str) {
            updateOutput('');
            return;
        }

        let result = [];
        for (let i = 0; i < str.length; i++) {
            result.push(str.charCodeAt(i));
        }
        updateOutput(result.join(' '));
    });
});
