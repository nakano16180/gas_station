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
// cf. https://wizapp-solution.com/archives/2823

/**
 * 現在の日付を取得する関数
 * @returns {Date} 現在の日付
 */
export function getToday() {
  return new Date();
}

/**
 * 指定された日付の前日を取得する関数
 * @param {Date} date 対象の日付
 * @returns {Date} 前日の日付
 */
export function getYesterday(date: Date) {
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  return yesterday;
}
