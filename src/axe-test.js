/* --------------------------------------------------- */
// ユーザ設定

// @axe-core/puppeteerのwithTagsで、テスト基準を選択的に設定できる。
// withTagsの設定オプションの詳細は公式ドキュメントを参照：
// https://www.deque.com/axe/core-documentation/api-documentation/#user-content-axe-core-tags
const AXE_CORE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// 出力する結果の種類を指定。詳細は公式ドキュメントを参照：
// https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter
// inapplicable: 判定対象外の基準
// incomplete: 適合しているか判断できなかった基準
// passes: 適合している判断とされた基準
// violations: 適合していないと判断された基準
const RESULT_TYPES = ['incomplete', 'violations'];

// 入力するURL一覧のフォルダ・ファイル名と文字コード
const INPUT_PATH = './urls.txt';
const INPUT_ENCODE = 'utf8';

// 出力するフォルダ・ファイル名
const OUTPUT_PATH = './axe-results.csv';
const OUTPUT_ENCODE = 'utf8';

/* --------------------------------------------------- */

const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const AXE_LOCALE_JA = require('axe-core/locales/ja.json');
const config = {
  locale: AXE_LOCALE_JA, // テスト結果を日本語で出力するように設定する。
};

// 出力されるテスト結果のフィールド名（ヘッダ行）
const reportHeader = [
  'URL',
  'Rule Type', // rule ID
  'Result Type', // inapplicable, incomplete, passes, or violations
  'Rule Set', // wcag2aa etc.
  'Impact', // "minor", "moderate", "serious", or "critical"
  'Message',
  'HTML Element',
  'DOM Element',
  'Help',
  'Help URL',
];

// テスト対象の URL を、外部テキストファイルから読み込んで、配列に整形する。
const fs = require('fs');
let urls_list = fs.readFileSync(INPUT_PATH, { encoding: INPUT_ENCODE });
urls_list = urls_list.replace(/\r?\n/g, ',');
urls_list = urls_list.split(',');

(async () => {
  try {
    let cliMode = false; // デフォルトではファイル出力する
    let outputText = ''; // ファイル出力用のテキスト
    if (process.argv[2]) {
      if (process.argv[2] === '--cli') {
        // CLI出力
        cliMode = true;
      } else {
        throw new Error(
          `${process.argv[2]} は無効な引数です。「--cli」とすることで、結果をファイル出力する代わりにコマンドラインで返します。`
        );
      }
    }

    const urls = urls_list;
    const browser = await puppeteer.launch();

    for (let i = 0; i < urls.length; i++) {
      if (i === 0) {
        const outputHeader = reportHeader.join(); // 出力1行目としてヘッダ行を追加
        if (cliMode) {
          console.log(outputHeader);
        } else {
          outputText += outputHeader;
        }
      }
      const url = urls[i];
      const page = await browser.newPage();
      await page.setBypassCSP(true);

      // デバイスのエミュレートをする場合は、下記を適用する。
      // await page.emulate(puppeteer.devices['iPhone 8']);

      // ページを読み込む。
      await Promise.all([
        page.setDefaultNavigationTimeout(0),
        page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] }),
        page.goto(`${url}`),
      ]);

      // テストを実行
      const results = await new AxePuppeteer(page)
        .configure(config)
        .withTags(AXE_CORE_TAGS)
        .analyze();

      // テスト結果をCSVとして出力できるように整形
      RESULT_TYPES.forEach((resultType) => {
        results[resultType].forEach((resultItem) => {
          resultItem.nodes.forEach((node) => {
            node.any.forEach((a) => {
              let outputRow = [
                results.url,
                resultItem.id,
                resultType,
                resultItem.tags
                  .filter((tag) => AXE_CORE_TAGS.includes(tag))
                  .join(),
                resultItem.impact,
                a.message,
                node.html,
                node.target.join(),
                resultItem.help,
                resultItem.helpUrl,
              ]
                .map((value) =>
                  String(value)
                    .replace(/,/g, '-')
                    .replace(/(\n|\r|\r\n)/gm, ' ')
                )
                .join();
              if (cliMode) {
                console.log(outputRow);
              } else {
                outputText += `\n${outputRow}`;
              }
            });
          });
        });
      });
      await page.close();
    }
    await browser.close();
    if (!cliMode) {
      fs.writeFileSync(OUTPUT_PATH, outputText, { encoding: OUTPUT_ENCODE });
    }
    console.info('アクセシビリティ検査が完了しました。');
  } catch (error) {
    console.error(error);
  }
})();
