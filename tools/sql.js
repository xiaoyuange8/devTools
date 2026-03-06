document.addEventListener('DOMContentLoaded', () => {
    const sqlInput = document.getElementById('sql-input');
    const sqlOutput = document.getElementById('sql-output');
    const btnFormatSql = document.getElementById('btn-format-sql');
    const sqlDialect = document.getElementById('sql-dialect');

    btnFormatSql.addEventListener('click', () => {
        const input = sqlInput.value;
        if (!input.trim()) {
            sqlOutput.textContent = '';
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

            // Re-highlight the SQL block using highlight.js
            if (window.hljs) {
                // Remove any previous highlight.js classes or attributes
                sqlOutput.removeAttribute('data-highlighted');
                sqlOutput.className = 'language-sql block p-4 font-mono text-sm w-full h-full bg-transparent whitespace-pre';
                hljs.highlightElement(sqlOutput);
            }
        } catch (e) {
            sqlOutput.textContent = `Error formatting SQL:\n${e.message}`;
            sqlOutput.classList.add('text-red-500');
        }
    });
});
