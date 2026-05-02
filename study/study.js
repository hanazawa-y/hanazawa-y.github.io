// レスポンス表示用
const result = document.getElementById('result');



// ① function + then
document.getElementById('btn1').addEventListener('click', function() {

    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            console.log('①', data);

            result.textContent =
                '① function + then\n\n' +
                JSON.stringify(data, null, 2);

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

            result.textContent =
                '② arrow + then\n\n' +
                JSON.stringify(data, null, 2);

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

        result.textContent =
            '③ function + async\n\n' +
            JSON.stringify(data, null, 2);

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

        result.textContent =
            '④ arrow + async\n\n' +
            JSON.stringify(data, null, 2);

    } catch(error) {

        console.error(error);

    }

});



// ⑤ 名前付き関数
document.getElementById('btn5').addEventListener('click', loadData5);

function loadData5() {
	
	console.log('btn5 clicked');

    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(data => {

            console.log('⑤', data);

            result.textContent =
                '⑤ 名前付き関数\n\n' +
                JSON.stringify(data, null, 2);

        })
        .catch(error => {

            console.error(error);

        });

}



// ⑥ async関数を別で定義
document.getElementById('btn6').addEventListener('click', loadData6);

async function loadData6() {

	console.log('btn6 clicked');
	
    try {

        const response = await fetch(
            'https://jsonplaceholder.typicode.com/todos/1'
        );

        const data = await response.json();

        console.log('⑥', data);

        result.textContent =
            '⑥ async関数を別定義\n\n' +
            JSON.stringify(data, null, 2);

    } catch(error) {

        console.error(error);

    }

}



// ⑦ axios
document.getElementById('btn7').addEventListener('click', function() {

    axios.get('https://jsonplaceholder.typicode.com/todos/1')
        .then(function(response) {

            console.log('⑦', response.data);

            result.textContent =
                '⑦ axios\n\n' +
                JSON.stringify(response.data, null, 2);

        })
        .catch(function(error) {

            console.error(error);

        });

});



// ⑧ async + axios
document.getElementById('btn8').addEventListener('click', loadData8);

async function loadData8() {

    try {

        const response = await axios.get(
            'https://jsonplaceholder.typicode.com/todos/1'
        );

        console.log('⑧', response.data);

        result.textContent =
            '⑧ async + axios\n\n' +
            JSON.stringify(response.data, null, 2);

    } catch(error) {

        console.error(error);

    }

}