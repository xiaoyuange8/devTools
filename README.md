# Dev Tools

A lightweight, locally runnable, single-page developer toolset web application. Built with plain HTML, TailwindCSS (via CDN), and Vanilla JavaScript, requiring no complex build processes.

## Features

This toolset provides a clean, unified interface for common daily development tasks:

*   **JSON Formatter & Compressor**: Format (beautify), compress, escape, and unescape JSON strings. Includes an option to decode or preserve Unicode (`\uXXXX`) sequences.
*   **Unicode / ASCII Converter**: Convert text between standard strings, Unicode (`\uXXXX`) representation, and ASCII codes.
*   **Timestamp Converter**: Convert between Unix timestamps (seconds or milliseconds) and human-readable date strings with **timezone selection support** (UTC, Local, CST, EST, PST, etc.). Includes a live current timestamp display.
*   **Regex Tester**: Test regular expressions against text with real-time highlighted match results and match counting.
*   **SQL Formatter**: Format and beautify SQL queries with support for multiple dialects (Standard, MySQL, PostgreSQL, T-SQL, MariaDB, SQLite) and built-in syntax highlighting.

*Note: All output fields feature scrollable containers and convenient "Copy" buttons for easy data extraction.*

## How to Use

1.  Clone this repository to your local machine:
    ```bash
    git clone https://github.com/xiaoyuange8/devTools.git
    ```
2.  Open the `index.html` file in any modern web browser (e.g., Chrome, Firefox, Edge).
3.  Use the sidebar navigation to switch between the different tools.

## Technologies Used

*   **HTML5**
*   **TailwindCSS** (via CDN for rapid UI styling)
*   **Vanilla JavaScript** (No external frameworks or libraries, keeping it fast and easy to modify)
*   **highlight.js** (via CDN for SQL syntax highlighting)
*   **sql-formatter** (via CDN for SQL parsing and formatting)

## File Structure

*   `index.html`: The main structural layout and UI.
*   `styles.css`: Custom CSS for specific styling needs beyond Tailwind (including highlight.js overrides).
*   `app.js`: Main JavaScript handling UI interactions (like tab switching).
*   `tools/`: Directory containing the logic for each individual tool.
    *   `json.js`: JSON formatting, compression, and escaping logic.
    *   `unicode.js`: Unicode and ASCII conversion logic.
    *   `timestamp.js`: Date, timestamp, and timezone conversion logic.
    *   `regex.js`: Regular expression testing logic.
    *   `sql.js`: SQL formatting and syntax highlighting logic.

## License

This project is open-source and available for any use.