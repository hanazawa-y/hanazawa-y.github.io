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



// ⑨ innerHTML + async + axios（一覧表示）
document.getElementById('btn9').addEventListener('click', loadData9);

async function loadData9() {

    try {

        const response = await axios.get(
            'https://jsonplaceholder.typicode.com/todos?_limit=10'
        );

        const todos = response.data;

        console.log('⑨', todos);

        const itemsHtml = todos.map(function(todo) {

            const titleSafe = String(todo.title)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');

            const status = todo.completed ? '完了' : '未完了';

            return (
                '<li>' +
                    '<strong>#' + todo.id + '</strong> ' +
                    titleSafe +
                    ' <span>(' + status + ')</span>' +
                '</li>'
            );

        }).join('');

        result.innerHTML =
            '<p>⑨ innerHTML + async + axios</p>' +
            '<ul>' + itemsHtml + '</ul>';

    } catch(error) {

        console.error(error);

        result.textContent =
            '⑨ innerHTML + async + axios\n\n' +
            'エラー: ' + error.message;

    }

}



// ⑩ createElement + async + axios（一覧表示）
document.getElementById('btn10').addEventListener('click', loadData10);

async function loadData10() {

    try {

        const response = await axios.get(
            'https://jsonplaceholder.typicode.com/todos?_limit=10'
        );

        const todos = response.data;

        console.log('⑩', todos);

        result.replaceChildren();

        const caption = document.createElement('p');
        caption.textContent = '⑩ createElement + async + axios';
        result.appendChild(caption);

        const ul = document.createElement('ul');

        todos.forEach(function(todo) {

            const li = document.createElement('li');

            const strong = document.createElement('strong');
            strong.textContent = '#' + todo.id;
            li.appendChild(strong);

            li.appendChild(document.createTextNode(' ' + todo.title + ' '));

            const status = document.createElement('span');
            status.textContent =
                '(' + (todo.completed ? '完了' : '未完了') + ')';
            li.appendChild(status);

            ul.appendChild(li);

        });

        result.appendChild(ul);

    } catch(error) {

        console.error(error);

        result.textContent =
            '⑩ createElement + async + axios\n\n' +
            'エラー: ' + error.message;

    }

}



// ⑪ 入力値を todos/{id} に載せて GET（async + axios）
const todoIdInput = document.getElementById('todoIdInput');

document.getElementById('btn11').addEventListener('click', loadData11);

todoIdInput.addEventListener('keydown', function(event) {

    if (event.key === 'Enter') {

        loadData11();

    }

});

async function loadData11() {

    const raw = todoIdInput.value.trim();

    if (raw === '') {

        result.textContent =
            '⑪ 入力 + async + axios\n\n' +
            'TODO の ID を入力してください（例: 1）';

        return;

    }

    if (!/^\d+$/.test(raw)) {

        result.textContent =
            '⑪ 入力 + async + axios\n\n' +
            '`todos/` の後ろには数字の ID だけ入れます（パスを安全にするため）';

        return;

    }

    const url =
        'https://jsonplaceholder.typicode.com/todos/' + raw;

    try {

        const response = await axios.get(url);

        console.log('⑪', response.data);

        result.textContent =
            '⑪ 入力 + async + axios\n' +
            'GET ' + url + '\n\n' +
            JSON.stringify(response.data, null, 2);

    } catch(error) {

        console.error(error);

        result.textContent =
            '⑪ 入力 + async + axios\n' +
            'GET ' + url + '\n\n' +
            'エラー: ' + error.message;

    }

}