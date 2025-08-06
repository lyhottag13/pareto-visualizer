import numberOfChecks from "../constants/NUMBER_OF_CHECKS.js";

/** @typedef {import('../constants/types.js').Inspection} */

/**
 * Gets the most problematic steps and returns them in sorted order by most
 * problematic.
 * @param {Inspection[]} rows 
 * @param {number} stepsLimit 
 * @returns {{step: number, count: number}[]}
 */
export default function getProblemSteps(rows, stepsLimit) {
    console.log(rows);
    const steps = [];
    // Initializes all steps with a value of 0.
    for (let i = 0; i < numberOfChecks; i++) {
        steps[i] = { step: i + 1, count: 0 };
    }
    // Increments the step's fail count by going through each inspection's steps.
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < numberOfChecks; j++) {
            if (rows[i][`s${j + 1}`] === 0) {
                steps[j].count++;
            }
        }
    }
    // Sorts the steps in descending order (highest first).
    const sortedSteps = steps.sort((a, b) => b.count - a.count);
    const desiredSteps = [];
    for (let i = 0; i < stepsLimit; i++) {
        desiredSteps.push(sortedSteps[i]);
    }
    // Returns the top n steps, defined by numberOfDesiredSteps.
    return desiredSteps;
};