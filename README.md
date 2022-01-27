# axe-test.js

「axe-test.js」は、Deque Systems, Inc. が開発、公開しているウェブアクセシビリティ検証ツール「[axe](https://www.deque.com/axe/)」のコアエンジン「axe-core」を利用して、ウェブサイトのアクセシビリティ自動テストを実行するためのスクリプトです。Node.js ライブラリ「[Puppeteer](https://pptr.dev/)」と併せて使います。

ウェブサイト全体 (数百ページ規模) を対象に、一括処理でアクセシビリティを検証し、その結果を、日本語でスプレッドシート (.csv ファイル) に出力することができます。

## 事前準備

### Node.js のインストール

[Node.js のサイト](https://nodejs.org/ja/)から、Node.js のインストーラー（最新 LTS 版）をお使いのパソコンにダウンロードし、実行します。Node.js と npm (Node Package Manager) がインストールされます。

### 本レポジトリ内のフォルダ一式をローカル環境にコピー

[ttsukagoshi/axe-test](https://github.com/ttsukagoshi/axe-test)の右上にある「Code」で「Download ZIP」を選択し、お好みの場所で解凍してください。以下、ここで解凍したフォルダを「作業フォルダ」と呼びます。

レポジトリを fork, `git clone` などをご存知の方は、お好きな方法でどうぞ。

### Dependencies のインストール

作業フォルダでターミナル（コマンドプロンプト）を開き、次のコマンドを実行します。

```
npm ci
```

## アクセシビリティ自動テストの実行のしかた

### 対象 URL リストを作業フォルダ内で作成

テスト対象となる URL 一覧を記載したテキストファイルを作成し、「**urls.txt**」というファイル名で保存します。テキストファイルの中身は、1 行ごとに 1 つの URL を記述しただけのものにしてください。
(なお、Basic 認証が適用されているページに対してテストを実行する場合は、各行の URL 記述を https://userid:password@example.com/ という具合にします。)

### テストの実行

ターミナル (コマンドプロンプト) が作業フォルダにあることを確認して、以下のように入力します。

```
node . => ./debug/results.csv
```

` => ./debug/results.csv` と記述することで、テスト結果がスプレッドシート (.csv ファイル) に出力されます。なお、.csv のファイル名は、必ずしも「**results.csv**」である必要はなく、任意のもので構いません。ちなみに ` => ./debug/results.csv` の記述がない場合、テスト結果はターミナル (コマンドプロンプト) 内に出力されます。

テストの実行には少し時間がかかると思います (数百ページ規模だと、数十分かかるかもしれません) が、完了すると、テストを実行したフォルダの中に .csv ファイルが生成されます。あとはこれを Excel や Google スプレッドシートで開いて、適宜ご活用ください。

<img width="1294" alt="「axe-test.js」によって出力されたテスト結果 (.csv) のイメージ" src="https://user-images.githubusercontent.com/17394690/108782594-32fb7900-75af-11eb-9d3c-df336d43dc0f.png">

### テスト基準の設定変更について

「[axe-test.js](https://github.com/caztcha/axe-test/blob/main/axe-test.js)」では、下記の行 (45 行目) で、テスト基準を設定しています。

```
 const results = await new AxePuppeteer(page).configure(config).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']).analyze();
```

`withTags()` の中に `['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']` と記述してあり、WCAG 2.1 (および 2.0) の、達成基準レベル A と AA に相当するテストルールを適用して、自動テストを実行する設定にしています。(加えて、一般的なアクセシビリティのベストプラクティスに関するテストルールも、適用する設定にしています。) 必要に応じて `withTags()` の記述を変更することで、テスト基準の設定を変更することができます。ここに記述可能なタグについては、[axe API Documentation の 「Axe-core Tags」のセクション](https://www.deque.com/axe/core-documentation/api-documentation/#user-content-axe-core-tags) をご参照ください。
