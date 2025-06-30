import getProblemSteps from "./tools/getProblemSteps.js";
import filterByDate from "./tools/filterByDate.js";
import checkList from "./tools/constants/checkList.js";

let sortedProblemSteps;

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
    sortedProblemSteps = getProblemSteps(filteredInspections);
    createChart(sortedProblemSteps);
}
function createButtons() {
    const newButton = document.createElement('button');
    newButton.innerText = 'Select';
    newButton.addEventListener('click', () => {
        select();
    });

    const calendarStart = document.createElement('input');
    const calendarEnd = document.createElement('input');
    calendarStart.type = 'date';
    calendarStart.id = 'start';
    calendarEnd.type = 'date';
    calendarEnd.id = 'end';

    const newDiv = document.createElement('div');
    newDiv.id = 'inputDiv';

    document.body.appendChild(newDiv);
    newDiv.appendChild(calendarStart);
    newDiv.appendChild(calendarEnd);
    newDiv.appendChild(newButton);

}
function createChart(data) {
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