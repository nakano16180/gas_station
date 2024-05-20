/**
 * Copyright 2023 nakano16180
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
export function hello() {
  return 'Hello Apps Script!';
}

export function getFiles() {
  // スプレッドシート取得
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = ss.getSheetByName('シート1');

  if (!activeSheet) {
    console.log('シートがありません');
    return;
  }

  // TODO: フォルダのIDを環境変数でセットするかスプシから読み取る
  const folderId = '';
  // ファイル一覧取得
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();

  const fileNames = [];
  while (files.hasNext()) {
    const file = files.next();
    const fileName = file.getName();
    console.log(fileName);
    fileNames.push([fileName]);
  }

  // 変数設定
  // ファイル書き込み位置設定
  const fileWriteStartRow = 5;
  const fileWriteStartCol = 2;

  // 既存ファイル反映セルクリア範囲設定
  const fileWriteEndRow = 1000;

  // 書き込む前にセルをクリア
  activeSheet
    .getRange(
      fileWriteStartRow,
      fileWriteStartCol,
      fileWriteEndRow,
      fileNames[0].length
    )
    .clear();
  // スプレッドシート反映
  activeSheet
    .getRange(
      fileWriteStartRow,
      fileWriteStartCol,
      fileNames.length,
      fileNames[0].length
    )
    .setValues(fileNames);
}
