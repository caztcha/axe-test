# axe-test.js

「axe-test.js」は、Deque Systems, Inc. が開発、公開しているウェブアクセシビリティ自動テスト用ツール「[axe](https://www.deque.com/axe/)」のコアエンジン「axe-core」を利用して、ウェブサイトのアクセシビリティ自動テストを実行するためのスクリプトです。Node.js ライブラリ「[Puppeteer](https://pptr.dev/)」と一緒に使います。

ウェブサイト全体 (数百ページ規模) を対象に一括処理でアクセシビリティを検証し、その結果を、日本語でスプレッドシート (.csv ファイル) に出力することができます。

## お使いいただくにあたっての事前準備

### Node.js のインストール

[Node.js のサイト](https://nodejs.org/ja/)から、Node.js のインストーラーをお使いのパソコンにダウンロードし、実行します。Node.js と npm (Node Package Manager) がインストールされます。

インストール後、ターミナル (コマンドプロンプト) で、以下を入力し、バージョンが表示されればOKです。
```
$ node -v
```
```
$ npm -v
```













