document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('unicode-input');
    const output = document.getElementById('unicode-output');
    const btnToUnicode = document.getElementById('btn-to-unicode');
    const btnToText = document.getElementById('btn-to-text');
    const btnToAscii = document.getElementById('btn-to-ascii');

    // Text to \uXXXX
    btnToUnicode.addEventListener('click', () => {
        const str = input.value;
        if (!str) return;

        let result = '';
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code > 127) {
                result += '\\u' + code.toString(16).padStart(4, '0');
            } else {
                result += str[i];
            }
        }
        output.value = result;
    });

    // Unicode (\uXXXX) to Text
    btnToText.addEventListener('click', () => {
        const str = input.value;
        if (!str) return;

        try {
            // Regex to match \uXXXX
            let result = str.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
                return String.fromCharCode(parseInt(grp, 16));
            });
            output.value = result;
        } catch (e) {
            output.value = 'Error converting Unicode to text.';
        }
    });

    // Text to ASCII (just char codes)
    btnToAscii.addEventListener('click', () => {
        const str = input.value;
        if (!str) return;

        let result = [];
        for (let i = 0; i < str.length; i++) {
            result.push(str.charCodeAt(i));
        }
        output.value = result.join(' ');
    });
});
