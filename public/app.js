import getProblemSteps from "./utils/getProblemSteps.js";
import filterByDate from "./utils/filterByDate.js";
import checkList from "./constants/checkList.js";
import NUMBER_OF_CHECKS from "./constants/NUMBER_OF_CHECKS.js";

let sortedProblemSteps;

async function main() {
    createSidePanel();
    createLimitInput();
}

async function select() {
    let limitValue = document.getElementById('limit').value;
    const startValue = document.getElementById('start').value;
    const endValue = document.getElementById('end').value;
    // Input validation:
    if (limitValue === '') {
        document.getElementById('limit').value = 15;
        limitValue = 15;
    }
    // If the user input a limit less or equal to 0, then alert the user.
    if (limitValue <= 0 || limitValue > NUMBER_OF_CHECKS || /[a-zA-Z]/.test(limitValue)) {
        window.alert('Límite inválido.');
        return;
    }
    // If the start is after the end, then alert the user.
    if (new Date(startValue).getTime() > new Date(endValue).getTime()) {
        window.alert('Fecha inválida.');
        return;
    }
    const res = await fetch('/api/select');
    const data = await res.json();
    const filteredInspections = filterByDate(data, startValue, endValue);
    sortedProblemSteps = getProblemSteps(filteredInspections, limitValue);
    console.log(sortedProblemSteps);
    createTable(sortedProblemSteps)
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

    const selectButton = document.createElement('button');
    selectButton.innerText = 'Select';
    selectButton.addEventListener('click', () => {
        select();
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
    newDiv.appendChild(selectButton);
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
    allTimeButton.innerText = 'Todos los Tiempos';
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
    select();
}
function handleToday() {
    const today = new Date().toLocaleDateString('en-CA').slice(0, 10);
    document.getElementById('start').value = today;
    document.getElementById('end').value = today;
    select();
}
function createTable(data) {
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
}
function createChart(data) {
    document.getElementById('chartDiv').className = '';
    document.querySelector('canvas')?.remove();
    const newChart = document.createElement('canvas');
    newChart.style.height = '90%';
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

main();