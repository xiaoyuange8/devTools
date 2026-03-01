document.addEventListener('DOMContentLoaded', () => {
    const regexInput = document.getElementById('regex-pattern');
    const flagsInput = document.getElementById('regex-flags');
    const testString = document.getElementById('regex-test-string');
    const resultOutput = document.getElementById('regex-result-display');
    const btnTest = document.getElementById('regex-test-string'); // Removed btnTest click logic since we do it on input
    const matchCount = document.getElementById('regex-match-count');

    function testRegex() {
        const patternStr = regexInput.value;
        const flagsStr = flagsInput.value;
        const testStr = testString.value;

        if (!patternStr) {
            resultOutput.innerHTML = '<span class="text-gray-400 italic">Result will appear here...</span>';
            matchCount.textContent = '0 matches';
            return;
        }

        try {
            const regex = new RegExp(patternStr, flagsStr);

            // Check if matches exist
            if (!regex.test(testStr)) {
                resultOutput.innerHTML = escapeHtml(testStr);
                matchCount.textContent = '0 matches';
                return;
            }

            // Highlighting
            let highlighted = '';
            let count = 0;

            if (regex.global) {
                const execRegex = new RegExp(patternStr, flagsStr);
                let match;
                let lastIndex = 0;

                while ((match = execRegex.exec(testStr)) !== null) {
                    highlighted += escapeHtml(testStr.substring(lastIndex, match.index));
                    highlighted += `<mark class="bg-blue-300 text-black px-1 rounded">${escapeHtml(match[0])}</mark>`;
                    lastIndex = match.index + match[0].length;
                    count++;

                    if (match[0].length === 0) {
                        execRegex.lastIndex++; // Prevent infinite loops
                    }
                }
                highlighted += escapeHtml(testStr.substring(lastIndex));
            } else {
                const match = testStr.match(regex);
                if (match) {
                    highlighted = escapeHtml(testStr.substring(0, match.index)) +
                                  `<mark class="bg-blue-300 text-black px-1 rounded">${escapeHtml(match[0])}</mark>` +
                                  escapeHtml(testStr.substring(match.index + match[0].length));
                    count = 1;
                }
            }

            resultOutput.innerHTML = highlighted;
            matchCount.textContent = `${count} match(es)`;

        } catch (e) {
            resultOutput.innerHTML = `<span class="text-red-500">Regex Error: ${e.message}</span>`;
            matchCount.textContent = 'Error';
        }
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    regexInput.addEventListener('input', testRegex);
    flagsInput.addEventListener('input', testRegex);
    testString.addEventListener('input', testRegex);
});
