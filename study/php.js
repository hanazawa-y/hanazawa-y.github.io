const result = document.getElementById('result');

const samples = {
    btn1: {
        title: '① 変数・配列',
        code: `<?php
$name = 'hanazawa';
$tags = ['php', 'laravel', 'mysql'];

echo $name . PHP_EOL;
echo count($tags) . PHP_EOL;
echo $tags[0];`,
        output: "hanazawa\n3\nphp"
    },
    btn2: {
        title: '② 連想配列',
        code: `<?php
$user = [
    'id' => 1,
    'name' => 'hanazawa',
    'role' => 'admin',
];

echo $user['name'];
echo isset($user['email']) ? 'yes' : 'no';`,
        output: "hanazawa\nno"
    },
    btn3: {
        title: '③ 関数',
        code: `<?php
function greet(string $name, string $prefix = 'Hello'): string
{
    return "{$prefix}, {$name}";
}

echo greet('World');
echo greet('Team', 'Hi');`,
        output: "Hello, World\nHi, Team"
    },
    btn4: {
        title: '④ クラス',
        code: `<?php
class User
{
    public function __construct(
        private int $id,
        private string $name,
    ) {}

    public function label(): string
    {
        return "{$this->name} (#{$this->id})";
    }
}

$user = new User(1, 'hanazawa');
echo $user->label();`,
        output: 'hanazawa (#1)'
    },
    btn5: {
        title: '⑤ try-catch',
        code: `<?php
try {
    $json = file_get_contents('config.json');
    if ($json === false) {
        throw new RuntimeException('読み込み失敗');
    }
    $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
} catch (Throwable $e) {
    error_log($e->getMessage());
    $data = [];
}`,
        output: '例外時はログ出力して空配列で続行'
    },
    btn6: {
        title: '⑥ ?? / ?:',
        code: `<?php
$nickname = $_GET['nick'] ?? 'guest';
$level = $score > 80 ? 'A' : 'B';

echo $nickname;
echo $level;`,
        output: "GET未指定なら guest\nスコアで A か B"
    },
    btn7: {
        title: '⑦ 名前付き引数 (PHP 8+)',
        code: `<?php
function createUser(string $name, string $role = 'user', bool $active = true)
{
    return compact('name', 'role', 'active');
}

$user = createUser(
    name: 'hanazawa',
    active: false,
);

print_r($user);`,
        output: "Array\n(\n    [name] => hanazawa\n    [role] => user\n    [active] =>\n)"
    },
    btn8: {
        title: '⑧ PDO 風',
        code: `<?php
$pdo = new PDO($dsn, $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

$stmt = $pdo->prepare('SELECT id, name FROM users WHERE id = :id');
$stmt->execute(['id' => 1]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

echo $row['name'];`,
        output: 'プリペアドステートメントで SQL インジェクション対策'
    }
};

function showSample(key) {
    const sample = samples[key];
    if (!sample) return;

    result.textContent =
        sample.title + '\n\n' +
        sample.code + '\n\n' +
        '--- 想定出力 / メモ ---\n' +
        sample.output;

    console.log(sample.title, sample);
}

for (let i = 1; i <= 8; i++) {
    const btn = document.getElementById('btn' + i);
    if (btn) {
        btn.addEventListener('click', () => showSample('btn' + i));
    }
}
