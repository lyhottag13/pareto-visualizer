import getProblemSteps from "./utils/getProblemSteps.js";
import filterByDate from "./utils/filterByDate.js";
import checkList from "./constants/checkList.js";
import NUMBER_OF_CHECKS from "./constants/NUMBER_OF_CHECKS.js";

/** @typedef {import('../constants/types.js').Inspection} */

/** @type {string} */
let chartTitle; // The title for the chart, needed since it's difficult to directly update the chart's title without external variables.

/** @type {{step: number, count: number}[]} */
let sortedProblemSteps; // The most problematic steps sorted in descending order.

async function main() {
    createSidePanel();
    createLimitInput();
}

/**
 * Selects a limited amount of values from the MySQL table. Only selects the
 * values where there are fails in at least one column.
 * This is done through a for-loop that writes `OR sn = "0"` for each
 * check possible. It comes out to be a long query, but it reduces the fetch time,
 * so it will help in the long-term when there are thousands of QA inspections
 * in the table.
 * @returns {Promise<Inspection[]>} The limited values from the MySQL table.
 */
async function selectFailRows() {
    const res = await fetch('/api/select');
    const data = await res.json();
    console.log(data);
    return data;
}

/**
 * Creates the div that holds the range inputs.
 * @returns {HTMLDivElement} The div element that holds the range inputs.
 */
function createInputDiv() {
    const label = document.createElement('span');
    const labelDe = document.createElement('span');
    const labelA = document.createElement('span');
    labelDe.innerText = 'De:'
    labelA.innerText = 'A:'
    label.innerText = 'Rango';

    labelDe.className = 'smallLabel';
    labelA.className = 'smallLabel';

    const rangeButton = document.createElement('button');
    rangeButton.id = 'range';
    rangeButton.className = 'button';
    rangeButton.innerText = 'Seleccionar';
    rangeButton.addEventListener('click', handleRange);

    const calendarStart = document.createElement('input');
    const calendarEnd = document.createElement('input');
    calendarStart.type = 'date';
    calendarStart.id = 'start';
    calendarEnd.type = 'date';
    calendarEnd.id = 'end';

    const newDiv = document.createElement('div');
    newDiv.id = 'inputDiv';
    newDiv.className = 'tile';

    newDiv.appendChild(label);
    newDiv.appendChild(labelDe);
    newDiv.appendChild(calendarStart);
    newDiv.appendChild(labelA);
    newDiv.appendChild(calendarEnd);
    newDiv.appendChild(rangeButton);
    return newDiv;
}

/**
 * Creates the side panel, being the today, all-time, and range panels.
 */
function createSidePanel() {
    const panel = document.createElement('div');
    panel.id = 'sidePanel';

    const todayButton = document.createElement('button');
    todayButton.classList.add('button');
    todayButton.classList.add('tile');
    todayButton.innerText = 'Hoy';
    todayButton.id = 'today';
    todayButton.addEventListener('click', handleToday);

    const allTimeButton = document.createElement('button');
    allTimeButton.id = 'allTime';
    allTimeButton.classList.add('button');
    allTimeButton.classList.add('tile');
    allTimeButton.innerText = 'Datos históricos';
    allTimeButton.addEventListener('click', handleAllTime);

    document.getElementById('appDiv').appendChild(panel);
    panel.appendChild(todayButton);
    panel.appendChild(allTimeButton);
    panel.appendChild(createInputDiv());

}

/**
 * Handles the all-time button press. Sets the start time to a date before the
 * QA1 captura app was in use to prevent any points of data from being excluded.
 * Also, sets the end time to today.
 */
function handleAllTime() {
    // Forces the data to start from the beginning by setting it to a date prior to deployment.
    const fossil = new Date(2025, 0, 1).toLocaleDateString('en-CA').slice(0, 10);
    document.getElementById('start').value = fossil;
    document.getElementById('end').value = new Date(Date.now()).toLocaleDateString('en-CA').slice(0, 10);
    chartTitle = 'Datos históricos';
    handleSelect();
}

/**
 * Handles the today button press. Sets the start and end times to today.
 */
function handleToday() {
    const today = new Date().toLocaleDateString('en-CA').slice(0, 10);
    document.getElementById('start').value = today;
    document.getElementById('end').value = today;
    chartTitle = 'Hoy';
    handleSelect();
}

/**
 * Handles the range button press. Utilizes the numbers already within the range,
 * though this is mostly handled within the reusable handleSelect method.
 */
function handleRange() {
    chartTitle = 'Rango';
    handleSelect();
}

/**
 * Handles any selection. Sends out a request with the range of time, then
 * creates a table and graph using the response.
 * @returns {void} Used to break out of the function if inputs are invalid.
 */
async function handleSelect() {
    const limit = document.getElementById('limit');
    // If the value of the limit is empty, then it becomes 15.
    limit.value = limit.value || 15;
    const start = document.getElementById('start');
    const end = document.getElementById('end');
    // Input validation:
    if (!isValidLimit(limit.value) || !isValidDate(start.value, end.value)) {
        return;
    }
    toggleButtons(false);

    // Retrieves the rows with ANY fails.
    const data = await selectFailRows();

    toggleButtons(true);
    const filteredInspections = filterByDate(data, start.value, end.value);
    sortedProblemSteps = getProblemSteps(filteredInspections, limit.value);
    console.log(sortedProblemSteps);

    // Creates the table and chart based on the sorted problem steps.
    createTable(sortedProblemSteps);
    createChart(sortedProblemSteps);
}
/**
 * Creates a table out of the sortedProblemSteps in descending order. The creation
 * of the table is done through raw HTML input. The table correlates with the graph,
 * so that the top item is the left-most item on the graph, and so on.
 * @param {{ step: number, count: number}[]} data The data to format as a table.
 */
function createTable(data) {
    // Removes an existing table if there is one, so that tables don't stack up.
    document.getElementById('tableDiv').querySelector('table')?.remove();
    const table = document.createElement('table');
    table.style.width = '100%';
    table.innerHTML = `
    <tr>
        <th>Step #</th>
        <th>Name</th>
        <th>Count</th>
    </tr>
    `;
    for (let i = 0; i < data.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${data[i].step}</td>
        <td>${checkList[data[i].step - 1]}</td>
        <td>${data[i].count}</td>
        `;
        table.appendChild(row);
    }
    document.getElementById('tableDiv').appendChild(table);
    table.style.opacity = 0;
    // Used to create a buffer between the opacity 0 and 1, so that the fade-in transition applies.
    table.offsetHeight;
    table.style.opacity = 1;
}
/**
 * Creates a bar chart representing the most problematic items on the coffee maker
 * during inspections. The most problematic items lie on the left, and filter right
 * in descending order. The expectation here is that there are one or two outliers
 * that contribute the most problems to the QA process.
 * @param {{ step: number, count: number}[]} data - The data to format as a bar chart.
 */
function createChart(data) {
    // Removes an existing canvas if there was one so that the screen doesn't clutter with charts.
    document.querySelector('canvas')?.remove();
    const newChart = document.createElement('canvas');
    // Used to make the chart stretch out. I don't know why this works.
    newChart.height = '';
    new Chart(newChart, {
        type: 'bar',
        data: {
            labels: data.map(step => `Step ${step.step}`),
            datasets: [
                {
                    label: 'Fails',
                    data: data.map(step => step.count)
                }
            ],
        },
        options: {
            backgroundColor: 'rgb(182, 39, 39)',
            onClick: (event, elements, chart) => {
                try {
                    displayStep(elements[0].index);
                } catch (err) {
                    console.log('Oops! Nothing was clicked...');
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 40
                    },
                    padding: {
                        top: 30,
                        bottom: 30
                    }
                }
            }
        }
    });
    document.getElementById('chartDiv').appendChild(newChart);
}
/**
 * Creates the entire limit input element on the chart.
 */
function createLimitInput() {
    const limitInput = document.createElement('input');
    limitInput.type = 'text';
    limitInput.id = 'limit';
    limitInput.maxLength = 2;
    limitInput.placeholder = '#';
    // If the user presses enter, then the app handles it as a today query.
    limitInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleToday();
        }
    })
    const chartDiv = document.getElementById('chartDiv');

    chartDiv.appendChild(limitInput);
}
/**
 * Displays the step name of the bar chart item that was clicked by the user.
 * This is done so that it's easier for the user to see what specifically is causing
 * the high fail volume without having to refer to the table or an external guide.
 * @param {number} index - The index of the step to show. 
 */
function displayStep(index) {
    const stepNumber = sortedProblemSteps[index].step;
    window.alert(checkList[stepNumber - 1]);
}
/**
 * Checks to see if the step limit the user input is valid.
 * @param {number} limitValue The number of steps that the user wants to limit the chart to.
 * @returns {boolean} Whether or not the limit is valid.
 */
function isValidLimit(limitValue) {
    if (limitValue <= 0 || limitValue > NUMBER_OF_CHECKS || /[a-zA-Z]/.test(limitValue)) {
        window.alert('Límite inválido.');
        return false;
    }
    return true;
}
/**
 * Checks to see if the dates input are realistic. The start date cannot be
 * after the end date.
 * @param {string} startValue A representation of the beginning date, formatted YYYY-MM-DD.
 * @param {string} endValue A representation of the end date, formatted YYYY-MM-DD.
 * @returns Whether the dates were valid.
 */
function isValidDate(startValue, endValue) {
    if (new Date(startValue).getTime() > new Date(endValue).getTime()) {
        window.alert('Fecha inválida.');
        return false;
    }
    return true;
}

/**
 * Toggles the buttons between an on and off state based on the state of selecting.
 * @param {boolean} enabled The desired state for the buttons.
 */
function toggleButtons(enabled) {
    /** @type {HTMLButtonElement[]} */
    document.querySelectorAll('button').forEach(button => {
        button.style.filter = enabled ? 'brightness(1)' : 'brightness(0.7)';
        button.disabled = !enabled;
    });
}

main();