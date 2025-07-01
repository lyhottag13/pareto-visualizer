import MILLISECONDS_IN_A_DAY from "../constants/MILLISECONDS_IN_A_DAY.js";

export default function filterByDate(inspections, dateStart, dateEnd) {
    // dateStart and dateEnd in format YYYY-MM-DD. Inspections fecha in ISO format.
    let startNumber;
    let endNumber;
    if (dateEnd === '' || dateStart === '') {
        window.alert('Ingresa fechas');
        return;
    }
    startNumber = new Date(dateStart).getTime();

    // End is exactly one day's milliseconds after start, so it shows the exact day.
    endNumber = new Date(dateEnd).getTime() + MILLISECONDS_IN_A_DAY;

    const filteredInspections = [];
    inspections.forEach(inspection => {
        // Only adds the inspection to the dataset if it passes the filter.
        if (isValidInspection(inspection, startNumber, endNumber)) {
            filteredInspections.push(inspection);
        }
    });
    return filteredInspections;
}

function isValidInspection(inspection, startNumber, endNumber) {
    const inspectionTimeNumber = new Date(inspection.fecha.slice(0, 10)).getTime();
    if (inspectionTimeNumber <= endNumber && inspectionTimeNumber >= startNumber) {
        return true;
    }
    return false;
}