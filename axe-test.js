const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

// テスト結果を日本語で出力するように設定する。
const AXE_LOCALE_JA = require('axe-core/locales/ja.json');
const config = {
  locale: AXE_LOCALE_JA,
};

// テスト結果の出力に、axe-reports を使用するように設定する。
const AxeReports = require('axe-reports');

// テスト対象の URL を、外部テキストファイルから読み込んで、配列に整形する。
const fs = require('fs');
let urls_list = fs.readFileSync('./urls.txt', 'utf-8');
urls_list = urls_list.replace(/\r?\n/g, ',');
urls_list = urls_list.split(',');

(async () => {
  const urls = urls_list;

  // axe-reports で、見出し行をまずは作成する。
  AxeReports.createCsvReportHeaderRow();

  const browser = await puppeteer.launch();

  for (let i = 0; i < urls.length; i++) {
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

    // テストを実行する。withTags で、テスト基準をいろいろ設定できる。
    // withTagsの設定オプションの詳細は公式ドキュメントを参照: https://www.deque.com/axe/core-documentation/api-documentation/#user-content-axe-core-tags
    const results = await new AxePuppeteer(page)
      .configure(config)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    // axe-reports で、検証結果の行を追加する。
    AxeReports.createCsvReportRow(results);

    await page.close();
  }

  await browser.close();
})();
