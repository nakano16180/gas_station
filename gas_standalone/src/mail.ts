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
import { getToday, getYesterday } from './util';

// cf. https://wizapp-solution.com/archives/2823

// TODO: 汎用化したい
/**
 * Gmail の受信ボックスから楽天決済案内メールを取得します。
 * @returns メール情報
 */
export const getMail = (): GoogleAppsScript.Gmail.GmailMessage | undefined => {
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
