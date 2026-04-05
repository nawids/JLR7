(() => {
    // --- Constants ---
    const ON = "1";
    const OFF = "0";
    const OFFSET_CHAR = "&nbsp;";
    const OFFSET_ENABLED = 1;
    const ROWS = 8;
    const COLS = 4;

    // Symbol grid — J/L/R/S used instead of J/L/R/7 due to CSS image naming constraints
    const SYMBOLS = (() => {
        const s1 = ["J", "L", "R", "S"];
        const s2 = ["S", "J", "L", "J"];
        const s3 = ["L", "J", "S", "R"];
        const s4 = ["R", "S", "J", "S"];
        return [s1, s2, s3, s4, s1, s2, s3, s4];
    })();

    // --- State ---
    let secondsTick = 1;   // cycles 1-3, drives the seconds pulse cell
    let isAnimating = false;
    let animCounter = 0;

    // --- Init ---
    jlr7();
    jlr7date();

    /**
     * Main clock loop. Reads current time, builds the display grid,
     * sets the seconds-pulse cell, and schedules itself every 1000ms.
     * Skips DOM update if an animation is currently running.
     */
    function jlr7() {
        const date = new Date();
        let h = date.getHours();
        let m = date.getMinutes();

        // Convert 24h to 12h. Midnight (0) becomes 12.
        if (h === 0) h = 12;
        else if (h > 12) h = h - 12;

        const face = createArray();
        fillArray(face, h, m);

        // Pulse a single cell in the last row to indicate seconds passing
        face[7][secondsTick] = ON;
        secondsTick++;
        if (secondsTick === 4) secondsTick = 1;

        if (!isAnimating) {
            document.getElementById("jlr7display").innerHTML = printArray(face);
        }

        setTimeout(jlr7, 1000);
    }

    /**
     * Date display loop. Reads current month and day, builds the display grid,
     * and schedules itself every 60 seconds.
     */
    function jlr7date() {
        const today = new Date();
        const dd = today.getDate();
        const mm = today.getMonth() + 1; // getMonth() is 0-indexed

        const face = createArray();
        fillDateArray(face, mm, dd);
        const el = document.getElementById("jlr7date_display");
        if (el) el.innerHTML = printArray(face);

        setTimeout(jlr7date, 60000);
    }

    /**
     * Creates a blank 8x4 grid with all cells set to OFF.
     * @returns {string[][]} 2D array of OFF values
     */
    function createArray() {
        const x = [];
        for (let i = 0; i < ROWS; i++) {
            x[i] = [];
            for (let j = 0; j < COLS; j++) {
                x[i][j] = OFF;
            }
        }
        return x;
    }

    /**
     * Renders a grid to an HTML string of image spans.
     * Odd rows are indented by OFFSET_CHAR for visual staggering.
     * @param {string[][]} array - The grid to render
     * @returns {string} HTML string
     */
    function printArray(array) {
        let out = "";
        for (let i = 0; i < array.length; i++) {
            if (OFFSET_ENABLED && i % 2) {
                out += OFFSET_CHAR;
            }
            for (let j = 0; j < array[i].length; j++) {
                const symbol = SYMBOLS[i][j];
                out += `<span><img width="25" height="25" src="images/${symbol}${array[i][j]}.png" alt="">&nbsp;</span>`;
            }
            out += "\n";
        }
        return out;
    }

    /**
     * Fills the grid to represent the current time.
     *
     * Encoding:
     *   - Rows 0-2 (12 cells): each lit cell = 1 hour
     *   - Row 3 (4 cells): each lit cell = 1 quarter-hour (15 min)
     *   - Rows 4-7 (16 cells): each lit cell = 1 remaining minute (0-14)
     *
     * @param {string[][]} array - Grid to fill (mutated in place)
     * @param {number} h - Hours in 12h format (1-12)
     * @param {number} m - Minutes (0-59)
     */
    function fillArray(array, h, m) {
        const quarters = Math.floor(m / 15);
        const remainingMins = m % 15;

        let hoursLeft = h;
        let quartersLeft = quarters;
        let minsLeft = remainingMins;

        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                // Rows 0-2: fill with hours
                if (i < 3 && hoursLeft > 0) {
                    array[i][j] = ON;
                    hoursLeft--;
                }
                // Row 3: fill with quarter-hours, then remaining minutes overflow
                else if (i === 3) {
                    if (quartersLeft > 0) {
                        array[i][j] = ON;
                        quartersLeft--;
                    } else if (minsLeft > 0) {
                        array[i][j] = ON;
                        minsLeft--;
                    }
                }
                // Rows 4-7: fill with remaining minutes
                else if (i > 3 && minsLeft > 0) {
                    array[i][j] = ON;
                    minsLeft--;
                }
            }
        }
    }

    /**
     * Fills the grid to represent the current date.
     *
     * Encoding:
     *   - First mm cells: lit with ON (represents month number)
     *   - Next dd cells: lit with a dimmed state via CSS (represents day number)
     *   - Remaining cells: OFF
     *
     * @param {string[][]} array - Grid to fill (mutated in place)
     * @param {number} mm - Month (1-12)
     * @param {number} dd - Day (1-31)
     */
    function fillDateArray(array, mm, dd) {
        let monthLeft = mm;
        let dayLeft = dd;

        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                if (monthLeft > 0) {
                    array[i][j] = ON;
                    monthLeft--;
                } else if (dayLeft > 0) {
                    array[i][j] = OFF; // day cells shown as off/dim to distinguish from month
                    dayLeft--;
                }
            }
        }
    }

    /**
     * Entry point for the intro animation. Disables the button,
     * resets the counter, and kicks off the animate loop.
     */
    window.startAnimation = function () {
        if (isAnimating) return;
        isAnimating = true;
        animCounter = 0;
        const btn = document.querySelector(".toggle");
        if (btn) btn.disabled = true;
        animate();
    };

    /**
     * Runs one frame of the randomized intro animation.
     * Schedules itself up to 7 frames, then re-enables the clock and button.
     */
    function animate() {
        if (animCounter < 7) {
            animCounter++;
            const face = createArray();
            fillArrayAnimation(face);
            document.getElementById("jlr7display").innerHTML = printArray(face);
            setTimeout(animate, 150);
        } else {
            isAnimating = false;
            const btn = document.querySelector(".toggle");
            if (btn) btn.disabled = false;
        }
    }

    /**
     * Fills every cell in the grid with a random ON or OFF value.
     * Used exclusively for the intro animation frames.
     * @param {string[][]} array - Grid to fill (mutated in place)
     */
    function fillArrayAnimation(array) {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                array[i][j] = Math.random() < 0.5 ? ON : OFF;
            }
        }
    }

})();
