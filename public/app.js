import getProblemSteps from "./tools/getProblemSteps.js";
import filterByDate from "./tools/filterByDate.js";
import checkList from "./tools/constants/checkList.js";

let sortedProblemSteps;

async function main() {
    createSidePanel();
}

async function select() {
    const limitValue = document.getElementById('limit').value || 15;
    const startValue = document.getElementById('start').value;
    const endValue = document.getElementById('end').value;
    // If the user input a limit less or equal to 0, then alert the user.
    if (limitValue <= 0) {
        window.alert('Límite inválido.');
        return;
    }
    // If the start is after the end, then alert the user.
    if (new Date(startValue).getTime() > new Date(endValue).getTime()) {
        window.alert('Fecha inválida.');
        return;
    }
    const res = await fetch('/api/select', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    const filteredInspections = filterByDate(data, startValue, endValue);
    sortedProblemSteps = getProblemSteps(filteredInspections, limitValue);
    createChart(sortedProblemSteps);
}
function createInputDiv() {
    const label = document.createElement('span');
    label.innerText = 'Rango';
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

    const limitInput = document.createElement('input');
    limitInput.id = 'limit';

    const newDiv = document.createElement('div');
    newDiv.id = 'inputDiv';
    newDiv.className = 'tile';

    newDiv.appendChild(label);
    newDiv.appendChild(calendarStart);
    newDiv.appendChild(calendarEnd);
    newDiv.appendChild(limitInput);
    newDiv.appendChild(selectButton);
    return newDiv;
}

function createSidePanel() {
    const panel = document.createElement('div');
    panel.id = 'sidePanel';

    const todayButton = document.createElement('div');
    todayButton.classList.add('button');
    todayButton.classList.add('tile');
    todayButton.innerText = 'Hoy'
    todayButton.addEventListener('click', () => {
        const today = new Date().toISOString().slice(0, 10);
        document.getElementById('start').value = today;
        document.getElementById('end').value = today;
        select();
    });

    const allTimeButton = document.createElement('div');
    allTimeButton.classList.add('button');
    allTimeButton.classList.add('tile');
    allTimeButton.innerText = 'Todos los Tiempos';
    allTimeButton.addEventListener('click', () => {
        // We force the data to start from the beginning by setting it to Jan 1, 1970.
        const fossil = new Date(0).toISOString().slice(0, 10);
        document.getElementById('start').value = fossil;
        document.getElementById('end').value = new Date(Date.now()).toISOString().slice(0, 10);
        select();
    });

    document.getElementById('appDiv').appendChild(panel);
    panel.appendChild(todayButton);
    panel.appendChild(allTimeButton);
    panel.appendChild(createInputDiv());
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
            onClick: (event, elements, chart) => {
                try {
                    displayStep(elements[0].index);
                } catch (err) {
                    console.log(err);
                }
            }
        }
    });
    document.getElementById('chartDiv').appendChild(newChart);
}

function displayStep(index) {
    const stepNumber = sortedProblemSteps[index].step;
    window.alert(checkList[stepNumber - 1]);
}

main();