# axe-test.js

「axe-test.js」は、Deque Systems, Inc. が開発、公開しているウェブアクセシビリティ自動テスト用ツール「[axe](https://www.deque.com/axe/)」のコアエンジン「axe-core」を利用して、ウェブサイトのアクセシビリティ自動テストを実行するためのスクリプトです。Node.js ライブラリ「[Puppeteer](https://pptr.dev/)」と一緒に使います。

ウェブサイト全体 (数百ページ規模) を対象に一括処理でアクセシビリティを検証し、その結果を、日本語でスプレッドシート (.csv ファイル) に出力することができます。

## 事前準備

### Node.js のインストール

[Node.js のサイト](https://nodejs.org/ja/)から、Node.js のインストーラーをお使いのパソコンにダウンロードし、実行します。Node.js と npm (Node Package Manager) がインストールされます。

インストール完了後、ターミナル (コマンドプロンプト) で、以下を入力し、バージョンが表示されればOKです。
```
$ node -v
```
```
$ npm -v
```

### Puppeteer、axe-core、axe-reports のインストール

アクセシビリティ自動テストを実行するためのフォルダを、お使いのパソコン上に作成します。たとえば、デスクトップに、「axe-test」フォルダを作成します。

ターミナル (コマンドプロンプト) の cd コマンドで、作成したフォルダに移動します。
```
$ cd desktop/axe-test
```

その状態で、[Puppeteer](https://pptr.dev/)、[axe-core (Puppeteer 用)](https://www.npmjs.com/package/@axe-core/puppeteer)、[axe-reports](https://www.npmjs.com/package/axe-reports) をそれぞれ、以下のようにターミナル (コマンドプロンプト) で入力して、インストールします。
```
$ npm install puppeteer --no-save
```
```
$ npm install @axe-core/puppeteer
```
```
$ npm install axe-reports
```

上記で作成したフォルダ (例 : デスクトップ上の「axe-test」フォルダ) の中に、「node_modules」というフォルダが作成され、その中に「puppeteer」「@axe-core」「axe-core」「axe-reports」が格納されていればOKです。

## アクセシビリティ自動テストの実行のしかた

### 「axe-test.js」の設置

上記で作成したアクセシビリティ自動テストを実行するためのフォルダ (例 : デスクトップ上の「axe-test」フォルダ) の中に、この GitHub リポジトリにある「axe-test.js」を置きます。アクセシビリティ自動テストを複数のプロジェクトで実施する場合は、下位のフォルダ (サブディレクトリ) を作成し、その中に「axe-test.js」を置く形でも結構です。

「axe-test.js」を置いたフォルダの中に、テスト対象となる URL 一覧を記載したテキストファイルを作成し、「urls.txt」というファイル名で保存します。テキストファイルの中身は、1行ごとに1つのURLを記載するだけです。

### 「axe-test.js」の実行

ターミナル (コマンドプロンプト) の cd コマンドで、アクセシビリティ自動テストを実行するためのフォルダ (例 : デスクトップ上の「axe-test」フォルダ) に移動します。
```
$ cd desktop/axe-test
```

その状態で、ターミナル (コマンドプロンプト) に以下を入力し、Enter キーを押してテストを実行します。
```
$ node axe-test.js => result.csv
```

`node axe-test.js` の記述は、「.js」を省いて `node axe-test` と記述する形でもOKです。

` => result.csv` と記述することで、テスト結果がスプレッドシート (.csv ファイル) に出力されます。なお、.csv のファイル名は、必ずしも「result.csv」である必要はなく、任意のもので構いません。ちなみに ` => result.csv` の記述がない場合、テスト結果はターミナル (コマンドプロンプト) 内に出力されます。

テストが完了すると、テスト実施用フォルダの中に、.csv ファイルが生成されます。あとはこれを Excel や Google スプレッドシートで開いて、適宜ご活用ください。





















