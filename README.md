# Dev Tools

A lightweight, locally runnable, single-page developer toolset web application. Built with plain HTML, TailwindCSS (via CDN), and Vanilla JavaScript, requiring no complex build processes.

## Features

This toolset provides a clean, unified interface for common daily development tasks:

*   **JSON Formatter & Compressor**: Format (beautify), compress, escape, and unescape JSON strings.
*   **Unicode / ASCII Converter**: Convert text between standard strings, Unicode (`\uXXXX`) representation, and ASCII codes.
*   **Timestamp Converter**: Convert between Unix timestamps (seconds or milliseconds) and human-readable local date strings. Includes a live current timestamp display.
*   **Regex Tester**: Test regular expressions against text with real-time highlighted match results and match counting.
*   **MD5 Generator**: Generate MD5 hashes (both lowercase and uppercase) directly in the browser using a pure JavaScript implementation.

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

## File Structure

*   `index.html`: The main structural layout and UI.
*   `styles.css`: Custom CSS for specific styling needs beyond Tailwind.
*   `app.js`: Main JavaScript handling UI interactions (like tab switching).
*   `tools/`: Directory containing the logic for each individual tool.
    *   `json.js`: JSON formatting, compression, and escaping logic.
    *   `unicode.js`: Unicode and ASCII conversion logic.
    *   `timestamp.js`: Date and timestamp conversion logic.
    *   `regex.js`: Regular expression testing logic.
    *   `md5.js`: Pure JS MD5 hash generation logic.

## License

This project is open-source and available for any use.