import getProblemSteps from "./tools/getProblemSteps.js";

async function main() {
    const newButton = document.createElement('button');
    newButton.innerText = 'Select';
    newButton.addEventListener('click', () => {
        select();
    });
    document.body.appendChild(newButton);
}

async function select() {
    const res = await fetch('/api/select', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log('olasdf');
    const data = await res.json();
    // getProblemSteps(data);
    console.log(data);
}

main();