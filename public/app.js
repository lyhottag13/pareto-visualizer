import getProblemSteps from "./tools/getProblemSteps.js";
import filterByDate from "./tools/filterByDate.js";

async function main() {
    createButtons();
}

async function select() {
    const res = await fetch('/api/select', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    const filteredInspections = filterByDate(data, document.getElementById('start').value, document.getElementById('end').value);
    const ret = getProblemSteps(filteredInspections);
    createChart(ret);
}
function createButtons() {
    const newButton = document.createElement('button');
    newButton.innerText = 'Select';
    newButton.addEventListener('click', () => {
        select();
    });
    document.body.appendChild(newButton);

    const calendarStart = document.createElement('input');
    const calendarEnd = document.createElement('input');
    calendarStart.type = 'date';
    calendarStart.id = 'start';
    calendarEnd.type = 'date';
    calendarEnd.id = 'end';

    document.body.appendChild(calendarStart);
    document.body.appendChild(calendarEnd);
    
}
function createChart(data) {
    document.querySelector('canvas')?.remove();
    const newChart = document.createElement('canvas');
    newChart.style.height = '90%';
    new Chart(newChart, {
        type: 'bar',
        data: {
            labels: data.map(step => step.step),
            datasets: [
                {
                    label: 'Steps and Fail Rates.',
                    data: data.map(step => step.count)
                }
            ]
        }
    });
    document.getElementById('chartDiv').prepend(newChart);
}

main();