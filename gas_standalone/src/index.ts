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

// TODO: 汎用化したい
/**
 * Gmail の受信ボックスから楽天決済案内メールを取得します。
 * @returns メール情報
 */
const getMail = (): GoogleAppsScript.Gmail.GmailMessage | undefined => {
  // 直近10件取得
  const threads = GmailApp.search(
    'subject:(カード利用のお知らせ(本人ご利用分)) -{速報版} after:2022/11/11 before:2024/11/12',
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
      console.log(parseMessage);
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
