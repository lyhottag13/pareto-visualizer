import MILLISECONDS_IN_A_DAY from "../constants/MILLISECONDS_IN_A_DAY.js";

/** @typedef {import('../constants/types.js').Inspection} */

/**
 * Filters the inspections by the user-input date.
 * @param {Inspection[]} inspections 
 * @param {string} dateStart The starting date to use in the filter. The limit
 *                           is at the start of the date selected. In the format
 *                           YYYY-MM-DD.
 * @param {string} dateEnd The ending date to use in the filter. The limit is
 *                         at the end of the date selected. In the format
 *                         YYYY-MM-DD.
 * @returns {Inspection[]}
 * The inspections filtered by the range of time.
 */
export default function filterByDate(inspections, dateStart, dateEnd) {
    if (dateEnd === '' || dateStart === '') {
        return window.alert('Ingresa fechas');
    }
    // Converts the date to a millisecond number, like 170000000, to make comparisons easier.
    const startMs = new Date(dateStart).getTime();

    // End is exactly one day's milliseconds after start, so it shows the exact day.
    const endMs = new Date(dateEnd).getTime() + MILLISECONDS_IN_A_DAY;

    const filteredInspections = []; // Filtered by time, must be within the start and end dates.
    inspections.forEach(inspection => {
        // Only adds the inspection to the dataset if it passes the filter.
        const isValidInspection = checkInspection(inspection, startMs, endMs);
        if (isValidInspection) {
            filteredInspections.push(inspection);
        }
    });
    return filteredInspections;
}

/**
 * Checks an inspection to see if it falls between a range of time.
 * @param {Inspection} inspection 
 * @param {number} startMs The start time in milliseconds.
 * @param {number} endMs The end time in milliseconds.
 * @returns {boolean} Whether the inspection is within the range of time.
 */
function checkInspection(inspection, startMs, endMs) {
    // inspections.fecha in YYYY-MM-DD HH:MM:SS format.
    const inspectionTimeNumber = new Date(inspection.fecha).getTime();
    if (inspectionTimeNumber <= endMs && inspectionTimeNumber >= startMs) {
        return true;
    }
    return false;
}