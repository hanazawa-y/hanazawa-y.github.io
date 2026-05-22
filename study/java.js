import "../src/authGuard.js";

const result = document.getElementById('result');

const samples = {
    btn1: {
        title: '① クラス + コンストラクタ',
        code: `public class User {
    private final int id;
    private final String name;

    public User(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public String displayName() {
        return name + " (#" + id + ")";
    }
}

// 使用例
User user = new User(1, "hanazawa");
System.out.println(user.displayName());`,
        output: 'hanazawa (#1)'
    },
    btn2: {
        title: '② interface + 実装',
        code: `public interface Notifier {
    void send(String message);
}

public class EmailNotifier implements Notifier {
    @Override
    public void send(String message) {
        System.out.println("[EMAIL] " + message);
    }
}

// 使用例
Notifier notifier = new EmailNotifier();
notifier.send("登録完了");`,
        output: '[EMAIL] 登録完了'
    },
    btn3: {
        title: '③ Stream map / filter',
        code: `List<String> names = List.of("alice", "bob", "carol");

List<String> result = names.stream()
    .filter(name -> name.length() >= 4)
    .map(String::toUpperCase)
    .toList();

System.out.println(result);`,
        output: '[ALICE, CAROL]'
    },
    btn4: {
        title: '④ Optional',
        code: `Optional<String> nickname = findNickname(42);

String label = nickname
    .filter(n -> !n.isBlank())
    .map(n -> "@" + n)
    .orElse("guest");

System.out.println(label);

// findNickname は DB 検索などで Optional を返す想定`,
        output: '@hanazawa  または  guest'
    },
    btn5: {
        title: '⑤ try-with-resources',
        code: `// AutoCloseable なリソースは自動で close される
try (BufferedReader reader = Files.newBufferedReader(path)) {
    String line = reader.readLine();
    System.out.println(line);
} catch (IOException e) {
    throw new RuntimeException("読み込み失敗", e);
}`,
        output: 'finally で手動 close しなくてよい'
    },
    btn6: {
        title: '⑥ record',
        code: `public record Todo(int id, String title, boolean done) {}

Todo todo = new Todo(1, "API実装", false);
System.out.println(todo.title());
System.out.println(todo);`,
        output: `API実装
Todo[id=1, title=API実装, done=false]`
    },
    btn7: {
        title: '⑦ lambda',
        code: `List<Integer> nums = List.of(3, 1, 4, 1, 5);

nums.sort((a, b) -> Integer.compare(a, b));

int sum = nums.stream()
    .reduce(0, (acc, n) -> acc + n);

System.out.println(nums);
System.out.println(sum);`,
        output: `[1, 1, 3, 4, 5]\n14`
    },
    btn8: {
        title: '⑧ Map getOrDefault',
        code: `Map<String, Integer> score = new HashMap<>();
score.put("math", 90);

int english = score.getOrDefault("english", 0);
int math = score.getOrDefault("math", 0);

System.out.println("english=" + english);
System.out.println("math=" + math);`,
        output: 'english=0\nmath=90'
    }
};

function showSample(key) {
    const sample = samples[key];
    if (!sample) return;

    result.textContent =
        sample.title + '\n\n' +
        sample.code + '\n\n' +
        '--- 想定出力 ---\n' +
        sample.output;

    console.log(sample.title, sample);
}

for (let i = 1; i <= 8; i++) {
    const btn = document.getElementById('btn' + i);
    if (btn) {
        btn.addEventListener('click', () => showSample('btn' + i));
    }
}
