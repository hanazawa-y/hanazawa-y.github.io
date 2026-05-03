# study — メモ

非同期通信・表示まわりをボタン単位で試すページの備忘録です。

## ファイル

| ファイル | 内容 |
|----------|------|
| `study.html` | UI・`<script defer>` で axios → `study.js` の順読込 |
| `study.js` | 各ボタンの処理 |
| `study.css` | `#result` の等幅・改行の保持（`white-space: pre-wrap`） |

## ボタン一覧（実装の対応）

| ID | ラベル | 概要 |
|----|--------|------|
| `btn1` | ① function + then | `fetch` + 無名 `function` + `.then` / `.catch` |
| `btn2` | ② arrow + then | `fetch` + アロー関数 + `.then` |
| `btn3` | ③ function + async | `fetch` + `async function` + `await` + `try/catch` |
| `btn4` | ④ arrow + async | `fetch` + `async` アロー + `await` |
| `btn5` | ⑤ 名前付き関数 | リスナーに名前付き関数を渡す + `fetch` + `.then` |
| `btn6` | ⑥ async関数を別定義 | `async function loadData6()` を別宣言してリスナーから呼ぶ |
| `btn7` | ⑦ axios | `axios.get` + `.then`（データは `response.data`） |
| `btn8` | ⑧ async + axios | `async` + `await axios.get` + `try/catch` |
| `btn9` | ⑨ innerHTML + async + axios | `axios` で TODO を複数件取得し、`innerHTML` で `<ul>` 一覧表示 |
| `btn10` | ⑩ createElement + async + axios | 同じく複数件取得し、`createElement` / `appendChild` で `<ul>` を組み立てる |
| `btn11` | ⑪ 入力 + async + axios | 入力欄の値を `todos/{id}` の `{id}` にして `axios.get`（数字 ID のみ） |

## API

- デモ用: [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- ①〜⑧: `GET /todos/1`（1件）
- ⑨〜⑩: `GET /todos?_limit=10`（最大10件）
- ⑪: `GET /todos/{入力した数字}`（例: `GET /todos/5`）

## ⑪の入力まわり（`study.html` のラベル〜入力〜ボタン）

該当はおおむね次の形です。

```html
<label for="todoIdInput"><code>todos/</code></label>
<input type="text" id="todoIdInput" inputmode="numeric" placeholder="例: 5" autocomplete="off" maxlength="10">
<button id="btn11">⑪ 入力 + async + axios</button>
```

### `label` の `for` は何のためか

- **`for` は「このラベルがどの入力欄を説明しているか」をブラウザに伝える属性**です。値には、対象にしたいフォームコントロールの **`id` と同じ文字列** を書きます。
- ここでは `<input id="todoIdInput" ...>` があるので、`<label for="todoIdInput">` と対応づいています。
- **効果の代表例**
  - **クリック領域の拡大**: ユーザーがラベル（このページでは `todos/` の文字側）をクリック／タップすると、**対応する入力欄にフォーカスが移る**。細い入力ボックスだけを狙わなくてよくなる。
  - **アクセシビリティ**: スクリーンリーダーなどが「この入力は何のためか」をラベルと関連付けて読み上げやすくなる（ネイティブのラベル関連付け）。
- `for` を付けずに `<label>` で入力を **内側で包む** 書き方でも関連付けはできますが、このページでは **`id` + `for` で明示**している形です。

### `inputmode="numeric"` について

- **`inputmode` は「ソフトウェアキーボードをどんなものに寄せるか」のヒント**です（主にスマホやタブレットで効きやすい）。仕様上は [HTML の `inputmode`](https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute) に沿ったモダリティの提案になります。
- **`numeric` は数字入力に適したキーボード（数字だらけのレイアウト）を出しやすくするための値**です。TODO の ID のように **数値だけ打ちたい** 場面向けの UX 改善です。
- **注意**: `inputmode` は **入力値の検証や「数字以外禁止」をブラウザに強制するものではありません**。PC の物理キーボードではそのまま文字も打てます。実際に「数字だけ許す」処理は **`study.js` 側の `/^\d+$/` チェック**で行っています。
- `type="number"` とは別物です。`type="number"` は増減 UI や値の解釈など挙動が変わることがあるため、このページでは **`type="text"` のまま `inputmode` でキーボードだけ寄せる** という割り切りにしています。

### `autocomplete` について

- **`autocomplete` は、ブラウザの自動補完・過去入力の提案をどう扱うかを指示する属性**です。[仕様では様々なトークン](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fe-autocomplete)があり、「名前」「住所」など意味のある値もあります。
- ここでは **`autocomplete="off"`** としているので、**この入力欄では自動補完を無効にしたい**、という意図です。
- **狙いの例**
  - API を試すたびに **別の ID を打ちたい** のに、ブラウザが過去の値をポップアップさせて邪魔になるのを減らす。
  - この項目が **住所やログイン情報のような「保存候補」として誤認識されない** ようにする（完全ではないがヒントになる）。
- **補足**: ブラウザやログインフォームまわりによっては `off` でも一部の提案が残ることがあります。その場合は `autocomplete="one-time-code"` のような別トークンを検討する事例もありますが、学習用の単純な ID 入力では **`off` で十分なことが多い**です。

### 同じ行にあるほかの属性（簡単に）

- **`placeholder="例: 5"`**: 未入力時の薄いヒント文言。**ラベルの代替にはならない**（アクセシビリティ上は `label` が本体）。
- **`maxlength="10"`**: 入力できる文字数の上限。極端に長い文字列を貼られないようにするための軽いガード。

## `defer` とスクリプトの順序（`study.html` コメントより）

### `defer` を付ける理由（`head` 内）

通常、`head` 内の `script` は HTML 読み込み途中で即実行される。

その時点では `body` の `button` がまだ存在しないので、

`document.getElementById('btn1')`

が `null` になることがある。

`defer` を付けると、HTML を最後まで読んでから JS 実行される。

さらに、上から順番に実行されるので

axios  
↓  
study.js

の順も保証される。

### `script` を `body` の最後に置く書き方

`script` を `body` の最後に置く書き方もよくある。

理由：

button など HTML 生成後に JS 実行できるから。

つまり `defer` が無くても安全。

例：

`<script src="study.js"></script>`

をここ（`body` 最後）に置く。

## 表示まわり

### `textContent` と `innerHTML`

- **`textContent`**: 文字列としてそのまま表示。HTML として解釈されない（①〜⑧の JSON 表示、⑨のエラー時など）。
- **`innerHTML`**: 文字列を HTML としてパースして埋め込む（⑨のリスト）。外部データをそのまま連結すると XSS のリスクがあるため、`title` などユーザー／API 由来の値はエスケープしてから組み立てる。
- **`createElement` + `textContent` / `appendChild`**: DOM ノードをコードで組み立てる（⑩）。テキストは `textContent` に渡すと HTML として解釈されないので、一覧表示では⑨より安全に書きやすい。

### `#result` が `<div>` である理由（`<pre>` との違い）

- **`<pre>`**: 改行・連続スペースを保ちやすい「整形済みテキスト」。子要素として `<ul>` などブロックを入れるのは HTML として適切ではない。
- **`<div>`**: 汎用コンテナ。`<ul>` / `<p>` などブロックを合法的に入れられる。JSON をきれいに見せたいときは CSS で `white-space: pre-wrap` などを当てる。

現在は `#result` を `<div>` にし、`study.css` で①〜⑧の JSON も読みやすいようにしている。

## 開き方

ローカルで `study.html` を開くか、このリポジトリを GitHub Pages 等でホストした URL から `study/study.html` にアクセスする。
