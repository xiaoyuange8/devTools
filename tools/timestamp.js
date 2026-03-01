document.addEventListener('DOMContentLoaded', () => {
    // Current Timestamp
    const currentTsEl = document.getElementById('current-timestamp');
    const btnRefreshTime = document.getElementById('btn-refresh-time');

    function updateCurrentTime() {
        currentTsEl.textContent = Math.floor(Date.now() / 1000);
    }

    // Update initially and every second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    btnRefreshTime.addEventListener('click', updateCurrentTime);

    // Timestamp to Date
    const tsInput = document.getElementById('ts-input');
    const tsUnit = document.getElementById('ts-unit');
    const btnTsToDate = document.getElementById('btn-ts-to-date');
    const tsDateResult = document.getElementById('ts-date-result');

    btnTsToDate.addEventListener('click', () => {
        const val = tsInput.value.trim();
        if (!val) return;

        let ts = parseInt(val, 10);
        if (isNaN(ts)) {
            tsDateResult.value = 'Invalid timestamp';
            return;
        }

        if (tsUnit.value === 's') {
            ts *= 1000;
        }

        const date = new Date(ts);
        if (isNaN(date.getTime())) {
            tsDateResult.value = 'Invalid Date';
        } else {
            tsDateResult.value = formatDate(date);
        }
    });

    // Date to Timestamp
    const dateInput = document.getElementById('date-input');
    const btnDateToTs = document.getElementById('btn-date-to-ts');
    const btnSetNow = document.getElementById('btn-set-now');
    const dateTsSResult = document.getElementById('date-ts-s-result');
    const dateTsMsResult = document.getElementById('date-ts-ms-result');

    btnDateToTs.addEventListener('click', () => {
        const val = dateInput.value.trim();
        if (!val) return;

        // Try parsing
        const date = new Date(val);
        if (isNaN(date.getTime())) {
            dateTsSResult.value = 'Invalid Date';
            dateTsMsResult.value = 'Invalid Date';
        } else {
            const ms = date.getTime();
            dateTsMsResult.value = ms;
            dateTsSResult.value = Math.floor(ms / 1000);
        }
    });

    btnSetNow.addEventListener('click', () => {
        const now = new Date();
        dateInput.value = formatDate(now);

        const ms = now.getTime();
        dateTsMsResult.value = ms;
        dateTsSResult.value = Math.floor(ms / 1000);
    });

    // Helper: format Date to YYYY-MM-DD HH:mm:ss
    function formatDate(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
});
