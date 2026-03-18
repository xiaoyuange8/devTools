document.addEventListener('DOMContentLoaded', () => {
    const sqlInput = document.getElementById('sql-input');
    const sqlOutput = document.getElementById('sql-output');
    const btnFormatSql = document.getElementById('btn-format-sql');
    const sqlDialect = document.getElementById('sql-dialect');
    const btnCopy = document.getElementById('btn-copy-sql');

    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            if (sqlOutput.textContent) {
                navigator.clipboard.writeText(sqlOutput.textContent).then(() => {
                    const originalText = btnCopy.textContent;
                    btnCopy.textContent = 'Copied!';
                    setTimeout(() => { btnCopy.textContent = originalText; }, 2000);
                });
            }
        });
    }

    btnFormatSql.addEventListener('click', () => {
        const input = sqlInput.value;
        if (!input.trim()) {
            sqlOutput.textContent = '';
            if (btnCopy) btnCopy.classList.add('hidden');
            return;
        }

        try {
            const dialect = sqlDialect.value;
            // sqlFormatter is exposed globally via the CDN script
            const formatted = sqlFormatter.format(input, {
                language: dialect,
                indent: '    ',
                uppercase: true,
                linesBetweenQueries: 2,
            });
            sqlOutput.textContent = formatted;
            sqlOutput.classList.remove('text-red-500');
            if (btnCopy) btnCopy.classList.remove('hidden');

            // Re-highlight the SQL block using highlight.js
            if (window.hljs) {
                // Remove any previous highlight.js classes or attributes
                sqlOutput.removeAttribute('data-highlighted');
                sqlOutput.className = 'language-sql block p-4 font-mono text-sm w-full min-h-full bg-transparent whitespace-pre text-gray-800';
                hljs.highlightElement(sqlOutput);
            }
        } catch (e) {
            let errorMsg = `Error formatting SQL:\n${e.message}`;

            // sql-formatter typically throws errors with line/column info: "Parse error: Unexpected ... at line 5 column 10"
            // We can try to extract line number to point users to the general area
            const lineMatch = e.message.match(/line\s+(\d+)/i);
            if (lineMatch && lineMatch[1]) {
                const lineNum = parseInt(lineMatch[1], 10);
                const lines = input.split('\n');
                if (lineNum > 0 && lineNum <= lines.length) {
                    const startLine = Math.max(0, lineNum - 3);
                    const endLine = Math.min(lines.length, lineNum + 2);

                    let context = '\n\nContext around error:\n';
                    for (let i = startLine; i < endLine; i++) {
                        const marker = (i + 1 === lineNum) ? '>> ' : '   ';
                        context += `${marker}${i + 1}: ${lines[i]}\n`;
                    }
                    errorMsg += context;
                }
            }

            sqlOutput.textContent = errorMsg;
            sqlOutput.classList.add('text-red-500');
            if (btnCopy) btnCopy.classList.add('hidden');
        }
    });
});
