export default function filterByDate(inspections, dateStart, dateEnd) {
    // dateStart and dateEnd in format YYYY-MM-DD. Inspections fecha in ISO format.
    const MILLISECONDS_IN_A_DAY = 86400000;
    let startNumber;
    let endNumber;
    if (dateEnd === '') {
        if (dateStart === '') {
            // If start and end are empty. This will show all data.
            startNumber = 0;
            endNumber = Date.now();
        } else {
            // If only end is empty. This will show only one day.
            startNumber = new Date(dateStart).getTime();
            // End is exactly one day after start, so it shows the exact day.
            endNumber = startNumber + MILLISECONDS_IN_A_DAY;
        }
    } else if (dateEnd !== '') {
        if (dateStart === '') {
            // If only start is empty. This will show everything up to end.
            startNumber = 0;
        } else {
            // If both are full. This will show only a range of data.
            startNumber = new Date(dateStart).getTime();
        }
        endNumber = new Date(dateEnd).getTime() + MILLISECONDS_IN_A_DAY;
    }
    const filteredInspections = [];
    inspections.forEach(inspection => {
        const inspectionTimeNumber = new Date(inspection.fecha).getTime();
        // Only adds the inspection to the dataset if it passes the filter.
        if (inspectionTimeNumber <= endNumber && inspectionTimeNumber >= startNumber) {
            filteredInspections.push(inspection);
        }
    });
    return filteredInspections;
}