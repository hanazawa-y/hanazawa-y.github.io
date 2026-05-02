// ① function + then
document.getElementById('btn1').addEventListener('click', function() {

    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log('①', data);
        })
        .catch(function(error) {
            console.error(error);
        });

});


// ② arrow + then
document.getElementById('btn2').addEventListener('click', () => {

    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(data => {
            console.log('②', data);
        })
        .catch(error => {
            console.error(error);
        });

});


// ③ function + async
document.getElementById('btn3').addEventListener('click', async function() {

    try {

        const response = await fetch(
            'https://jsonplaceholder.typicode.com/todos/1'
        );

        const data = await response.json();

        console.log('③', data);

    } catch(error) {

        console.error(error);

    }

});


// ④ arrow + async
document.getElementById('btn4').addEventListener('click', async () => {

    try {

        const response = await fetch(
            'https://jsonplaceholder.typicode.com/todos/1'
        );

        const data = await response.json();

        console.log('④', data);

    } catch(error) {

        console.error(error);

    }

});