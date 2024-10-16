/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { hello } from './example-module';
import { Message, PaymentInfo } from './rakuten';

console.log(hello());

// cf. https://wizapp-solution.com/archives/2823

/**
 * 現在の日付を取得する関数
 * @returns {Date} 現在の日付
 */
function getToday() {
  return new Date();
}

/**
 * 指定された日付の前日を取得する関数
 * @param {Date} date 対象の日付
 * @returns {Date} 前日の日付
 */
function getYesterday(date: Date) {
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  return yesterday;
}

// TODO: 汎用化したい
/**
 * Gmail の受信ボックスから楽天決済案内メールを取得します。
 * @returns メール情報
 */
const getMail = (): GoogleAppsScript.Gmail.GmailMessage | undefined => {
  const today = getToday();
  const yesterdayString = Utilities.formatDate(
    getYesterday(today),
    Session.getScriptTimeZone(),
    'yyyy/MM/dd'
  );
  // 直近10件取得
  const threads = GmailApp.search(
    `subject:(カード利用のお知らせ(本人ご利用分)) -{速報版} after:${yesterdayString}`,
    0,
    10
  );

  if (!threads || threads.length === 0) {
    return;
  }
  // 最新１件返す
  const message = threads[0].getMessages();
  return message[0];
};

/**
 * メール本文から決済履歴の情報を抽出し、決済情報オブジェクトを取得します。
 * @param message メール本文
 * @returns 決済情報オブジェクト
 */
const parseMessage = (message: string) => {
  const paymentInfoList: PaymentInfo[] = [];
  const matched: RegExpMatchArray | null = message.match(
    /■利用日(?:(?!■利用日|■ご利用明細のご確認).)+/gs
  );
  if (matched) {
    for (const paymentMessage of matched) {
      console.log(paymentMessage);
      const m = new Message(paymentMessage);
      console.log(
        m.getUseDay(),
        m.getUseStore(),
        m.getUser(),
        m.getAmount(),
        m.getPayMonth()
      );
      paymentInfoList.push(
        new PaymentInfo(
          m.getUseDay(),
          m.getUseStore(),
          m.getUser(),
          m.getAmount(),
          m.getPayMonth()
        )
      );
    }
  }

  return paymentInfoList;
};

const getOldMails = (): string[] | undefined => {
  const threads = GmailApp.search(
    'subject:(カード利用のお知らせ(本人ご利用分)) -{速報版} after:2024/01/01 before:2024/10/01',
    0,
    200
  );

  if (!threads || threads.length === 0) {
    return;
  }

  const messages = threads.map(m => m.getMessages()[0]);
  const bodies = messages.map(m => m.getPlainBody());
  return bodies;
};

const logOldMessages = () => {
  // TODO: 関数に切り出す
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('シート2');

  if (!sheet) {
    console.log('シートがありません');
    return;
  }

  // ヘッダー書き込み
  const range = sheet.getRange('A1:E1');
  range.setValues([['利用日', '利用先', '利用者', '利用金額', '支払い月']]);

  const messageBodies = getOldMails();
  if (messageBodies === undefined) return;

  for (let i = 1; i <= messageBodies.length; i++) {
    const body = messageBodies[messageBodies.length - i]; // 古い方から書き込みたいので逆転する
    console.log('----- メッセージボディ -----');
    console.log(body);
    const parsed = parseMessage(body);

    parsed.reverse();
    for (const data of parsed) {
      const lastRow = sheet.getLastRow();

      const toList = [
        data.getUseDay(),
        data.getUseStore(),
        data.getUser(),
        data.getAmount(),
        data.getPayMonth(),
      ];

      sheet.getRange(lastRow + 1, 1, 1, toList.length).setValues([toList]);
    }
  }
};

const main = () => {
  const message = getMail();
  if (message === undefined) return;
  const body = message.getPlainBody();
  console.log(body);
  const parsed = parseMessage(body);
  // TODO: スプレッドシートに書き込む

  // TODO: 関数に切り出す
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('シート1');

  if (!sheet) {
    console.log('シートがありません');
    return;
  }

  // ヘッダー書き込み
  const range = sheet.getRange('A1:E1');
  range.setValues([['利用日', '利用先', '利用者', '利用金額', '支払い月']]);

  for (const data of parsed) {
    const lastRow = sheet.getLastRow();

    const toList = [
      data.getUseDay(),
      data.getUseStore(),
      data.getUser(),
      data.getAmount(),
      data.getPayMonth(),
    ];

    sheet.getRange(lastRow + 1, 1, 1, toList.length).setValues([toList]);
  }
};

main();
