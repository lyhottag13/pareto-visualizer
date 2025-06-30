import getProblemSteps from "./tools/getProblemSteps.js";

async function main() {
    createButton();
}

async function select() {
    const res = await fetch('/api/select', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    const ret = getProblemSteps(data);
    console.log(ret);
    new Chart(document.getElementById('pareto'), {
        type: 'bar',
        data: {
            labels: ret.map(step => step.step),
            datasets: [
                {
                    label: 'Steps and Fail Rates.',
                    data: ret.map(step => step.count)
                }
            ]
        }
    });
}
function createButton() {
    const newButton = document.createElement('button');
    newButton.innerText = 'Select';
    newButton.addEventListener('click', () => {
        select();
    });
    document.body.appendChild(newButton);
}

main();