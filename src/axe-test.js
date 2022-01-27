/* --------------------------------------------------- */
// ユーザ設定

// @axe-core/puppeteerのwithTagsで、テスト基準を選択的に設定できる。
// withTagsの設定オプションの詳細は公式ドキュメントを参照：
// https://www.deque.com/axe/core-documentation/api-documentation/#user-content-axe-core-tags
// 元の設定は ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice']
const axeCoreTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

// 出力する結果の種類を指定。詳細は公式ドキュメントを参照：
// https://www.deque.com/axe/core-documentation/api-documentation/#options-parameter
// inapplicable: 対象外の基準
// incomplete: 適合しているか判断できなかった基準
// passes: 問題なしとされた基準
// violations: 適合していないと判断された基準
const resultTypes = ['incomplete', 'violations'];

/* --------------------------------------------------- */

const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

// テスト結果を日本語で出力するように設定する。
const AXE_LOCALE_JA = require('axe-core/locales/ja.json');
const config = {
  locale: AXE_LOCALE_JA,
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
let urls_list = fs.readFileSync('./urls.txt', 'utf-8');
urls_list = urls_list.replace(/\r?\n/g, ',');
urls_list = urls_list.split(',');

(async () => {
  const urls = urls_list;

  // axe-reports で、見出し行をまずは作成する。
  // AxeReports.createCsvReportHeaderRow();

  const browser = await puppeteer.launch();

  for (let i = 0; i < urls.length; i++) {
    if (i === 0) {
      // 出力1行目としてヘッダ行を追加
      console.log(reportHeader.join());
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
      .withTags(axeCoreTags)
      .analyze();

    // テスト結果をCSVとして出力できるように整形
    resultTypes.forEach((resultType) => {
      results[resultType].forEach((resultItem) => {
        resultItem.nodes.forEach((node) => {
          node.any.forEach((a) => {
            console.log(
              [
                results.url,
                resultItem.id,
                resultType,
                resultItem.tags
                  .filter((tag) => axeCoreTags.includes(tag))
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
                .join()
            );
          });
        });
      });
    });

    await page.close();
  }

  await browser.close();
})();
