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

## API

- デモ用: [JSONPlaceholder](https://jsonplaceholder.typicode.com/)
- ①〜⑧: `GET /todos/1`（1件）
- ⑨〜⑩: `GET /todos?_limit=10`（最大10件）

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
