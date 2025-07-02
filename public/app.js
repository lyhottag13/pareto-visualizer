import getProblemSteps from "./utils/getProblemSteps.js";
import filterByDate from "./utils/filterByDate.js";
import checkList from "./constants/checkList.js";
import NUMBER_OF_CHECKS from "./constants/NUMBER_OF_CHECKS.js";

let title;

let sortedProblemSteps;

async function main() {
    createSidePanel();
    createLimitInput();
}

/**
 * Selects a limited amount of values from the MySQL table.
 * @returns 
 */
async function select() {
    const limit = document.getElementById('limit');
    // If the value of the limit is empty, then it becomes 15.
    limit.value = limit.value || 15;
    const start = document.getElementById('start');
    const end = document.getElementById('end');
    // Input validation:
    if (!isValidInput(limit.value, start.value, end.value)) {
        return;
    }
    const res = await fetch('/api/select');
    const data = await res.json();
    const filteredInspections = filterByDate(data, start.value, end.value);
    sortedProblemSteps = getProblemSteps(filteredInspections, limit.value);
    console.log(sortedProblemSteps);
    createTable(sortedProblemSteps);
    createChart(sortedProblemSteps);
}
function createInputDiv() {
    const label = document.createElement('span');
    const labelDe = document.createElement('span');
    const labelA = document.createElement('span');
    labelDe.innerText = 'De:'
    labelA.innerText = 'A:'
    label.innerText = 'Rango';

    labelDe.className = 'smallLabel';
    labelA.className = 'smallLabel';

    const rangeButton = document.createElement('div');
    rangeButton.id = 'range';
    rangeButton.className = 'button';
    rangeButton.innerText = 'Seleccionar';
    rangeButton.addEventListener('click', () => {
        handleRange();
    });

    const calendarStart = document.createElement('input');
    const calendarEnd = document.createElement('input');
    calendarStart.type = 'date';
    calendarStart.id = 'start';
    calendarEnd.type = 'date';
    calendarEnd.id = 'end';

    // const limitInput = document.createElement('input');
    // limitInput.id = 'limit';

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

function createSidePanel() {
    const panel = document.createElement('div');
    panel.id = 'sidePanel';

    const todayButton = document.createElement('div');
    todayButton.classList.add('button');
    todayButton.classList.add('tile');
    todayButton.innerText = 'Hoy';
    todayButton.id = 'today';
    todayButton.addEventListener('click', () => {
        handleToday();
    });

    const allTimeButton = document.createElement('div');
    allTimeButton.id = 'allTime';
    allTimeButton.classList.add('button');
    allTimeButton.classList.add('tile');
    allTimeButton.innerText = 'Datos históricos';
    allTimeButton.addEventListener('click', () => {
        handleAllTime();
    });

    document.getElementById('appDiv').appendChild(panel);
    panel.appendChild(todayButton);
    panel.appendChild(allTimeButton);
    panel.appendChild(createInputDiv());

}
function handleAllTime() {
    // Forces the data to start from the beginning by setting it to a date before deployment.
    const fossil = new Date(2025, 0, 1).toLocaleDateString('en-CA').slice(0, 10);
    document.getElementById('start').value = fossil;
    document.getElementById('end').value = new Date(Date.now()).toLocaleDateString('en-CA').slice(0, 10);
    title = 'Datos históricos';
    select();
}
function handleToday() {
    const today = new Date().toLocaleDateString('en-CA').slice(0, 10);
    document.getElementById('start').value = today;
    document.getElementById('end').value = today;
    title = 'Hoy';
    select();
}
function handleRange() {
    title = 'Rango';
    select();
}
function createTable(data) {
    // Removes an existing table if there is one, so that tables don't stack up.
    document.getElementById('tableDiv').querySelector('table')?.remove();
    const table = document.createElement('table');
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
                    text: title,
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
function createLimitInput() {
    const limitInput = document.createElement('input');
    limitInput.type = 'text';
    limitInput.id = 'limit';
    limitInput.maxLength = 2;
    limitInput.placeholder = '#';
    limitInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleToday();
        }
    })
    const chartDiv = document.getElementById('chartDiv');

    chartDiv.appendChild(limitInput);
}

function displayStep(index) {
    const stepNumber = sortedProblemSteps[index].step;
    window.alert(checkList[stepNumber - 1]);
}
function isValidInput(limitValue, startValue, endValue) {
    // If the user input an invalid limit, then alert the user.
    if (limitValue <= 0 || limitValue > NUMBER_OF_CHECKS || /[a-zA-Z]/.test(limitValue)) {
        window.alert('Límite inválido.');
        return false;
    }
    // If the start is after the end, then alert the user.
    if (new Date(startValue).getTime() > new Date(endValue).getTime()) {
        window.alert('Fecha inválida.');
        return false;
    }
    return true;
}
main();