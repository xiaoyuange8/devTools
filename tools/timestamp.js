document.addEventListener('DOMContentLoaded', () => {
    // Current Timestamp
    const currentTsEl = document.getElementById('current-timestamp');
    const btnRefreshTime = document.getElementById('btn-refresh-time');
    const timezoneSelect = document.getElementById('timezone-select');
    const tsDateTimezoneLabel = document.getElementById('ts-date-timezone-label');

    function updateCurrentTime() {
        currentTsEl.textContent = Math.floor(Date.now() / 1000);
    }

    // Update initially and every second
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    btnRefreshTime.addEventListener('click', updateCurrentTime);

    function getSelectedTimezone() {
        if (!timezoneSelect) return 'local';
        return timezoneSelect.value;
    }

    function updateTimezoneLabels() {
        const tz = getSelectedTimezone();
        if (tsDateTimezoneLabel) {
            tsDateTimezoneLabel.textContent = tz === 'local' ? '(Local Time)' : `(${tz})`;
        }
    }

    if (timezoneSelect) {
        timezoneSelect.addEventListener('change', () => {
            updateTimezoneLabels();
            // Re-trigger conversions if values exist
            if (tsInput.value.trim()) btnTsToDate.click();
            if (dateInput.value.trim()) btnDateToTs.click();
        });
        updateTimezoneLabels();
    }

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
            tsDateResult.value = formatDate(date, getSelectedTimezone());
        }
    });

    // Date to Timestamp
    const dateInput = document.getElementById('date-input');
    const btnDateToTs = document.getElementById('btn-date-to-ts');
    const btnSetNow = document.getElementById('btn-set-now');
    const dateTsSResult = document.getElementById('date-ts-s-result');
    const dateTsMsResult = document.getElementById('date-ts-ms-result');

    btnDateToTs.addEventListener('click', () => {
        let val = dateInput.value.trim();
        if (!val) return;

        // Auto append " 00:00:00" if the user only provides "YYYY-MM-DD"
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            val += " 00:00:00";
            // Optionally update the input box to show what's being evaluated
            // dateInput.value = val;
        }

        // Try parsing
        let date;
        const tz = getSelectedTimezone();

        if (tz === 'local') {
             // Parse as local time if no timezone offset is provided in string
             // (Date constructor does this by default if no 'Z' or offset is present)
             date = new Date(val);
        } else {
             // If a specific timezone is selected, we need to treat the input string
             // as being in that timezone, convert it to a unified format.
             // This is tricky without a library like moment-timezone, but we can do a hack:
             // 1. Assume input string is "YYYY-MM-DD HH:mm:ss"
             // 2. Format a UTC date to target timezone to get the offset,
             // or simply construct an ISO string and parse it.
             // For simplicity in vanilla JS without huge polyfills:
             // If they provide a full ISO string with Z, Date() handles it.
             // If not, we just append the timezone if it's UTC, else it's hard to parse arbitrary strings into specific timezones reliably in pure JS.

             if (tz === 'UTC' && !val.includes('Z') && !val.includes('+') && !val.includes('-')) {
                 date = new Date(val.replace(' ', 'T') + 'Z');
             } else {
                 // For other timezones (Asia/Shanghai etc), vanilla JS `new Date('2023-01-01 12:00:00')`
                 // always assumes local time zone.
                 // To treat the input 'val' AS IF it were in 'Asia/Shanghai' and get a timestamp:
                 // This requires complex math. We'll fallback to local parsing if they don't provide timezone info in the string,
                 // but we'll try to use the selected timezone to calculate the offset difference.

                 const localDate = new Date(val);
                 if (!isNaN(localDate.getTime())) {
                     // Get what this time would be in the target timezone
                     const tzStr = localDate.toLocaleString('en-US', { timeZone: tz });
                     const tzDate = new Date(tzStr);

                     // Calculate offset difference
                     const diff = tzDate.getTime() - localDate.getTime();

                     // Subtract difference to "shift" the time
                     date = new Date(localDate.getTime() - diff);
                 } else {
                     date = new Date(val);
                 }
             }
        }


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
        const tz = getSelectedTimezone();
        dateInput.value = formatDate(now, tz);

        const ms = now.getTime();
        dateTsMsResult.value = ms;
        dateTsSResult.value = Math.floor(ms / 1000);
    });

    // Helper: format Date to YYYY-MM-DD HH:mm:ss
    function formatDate(date, timezone = 'local') {
        if (timezone === 'local') {
            const pad = (n) => n.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        } else {
            // Use Intl.DateTimeFormat for specific timezones
            try {
                const formatter = new Intl.DateTimeFormat('en-CA', { // 'en-CA' gives YYYY-MM-DD
                    timeZone: timezone,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });

                // Intl formatter output example: "2023-10-25, 14:30:00"
                // We need to reformat to YYYY-MM-DD HH:mm:ss
                const parts = formatter.formatToParts(date);
                const p = {};
                parts.forEach(part => p[part.type] = part.value);

                return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second}`;
            } catch (e) {
                console.error("Timezone formatting error:", e);
                // Fallback to local
                const pad = (n) => n.toString().padStart(2, '0');
                return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
            }
        }
    }
});
