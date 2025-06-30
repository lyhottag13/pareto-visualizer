export default function filterByDate(inspections, dateStart, dateEnd) {
    // dateStart and dateEnd in format YYYY-MM-DD. Inspections fecha in ISO format.
    dateEnd = dateEnd === '' ? (Date.now()) : new Date(dateEnd).getTime();
    dateStart = dateStart === '' ? (new Date(new Date().toDateString()).getTime()) : new Date(dateStart).getTime();
    const start = dateStart;
    const end = dateEnd;
    const filteredInspections = [];
    inspections.forEach(inspection => {
        const inspectionTimeNumber = new Date(inspection.fecha).getTime();
        // Only adds the inspection to the dataset if it passes the filter.
        if (inspectionTimeNumber <= end && inspectionTimeNumber >= start) {
            filteredInspections.push(inspection);
        }
    });
    return filteredInspections;
}