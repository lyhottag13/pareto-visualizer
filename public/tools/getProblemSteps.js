import numberOfChecks from "./constants/numberOfChecks.js";

export default function getProblemSteps(rows) {
    console.log(rows);
    const steps = [];
    for (let i = 0; i < numberOfChecks; i++) {
        steps[i] = { step: i + 1, count: 0 };
    }
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < numberOfChecks; j++) {
            if (rows[i][`s${j + 1}`] === 'FAIL') {
                steps[j].count++;
            }
        }
    }
    // Returns the steps sorted in descending order (highest first).
    return steps.sort((a, b) => b.count - a.count);
};