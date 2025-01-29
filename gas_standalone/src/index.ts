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
import { getMail } from './mail';
import { parseMessage } from './rakuten';

console.log(hello());

// cf. https://wizapp-solution.com/archives/2823

const main = () => {
  console.log('メール取り込み開始');

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
