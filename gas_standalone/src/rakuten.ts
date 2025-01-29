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
 * メール本文から決済履歴の情報を抽出し、決済情報オブジェクトを取得します。
 * @param message メール本文
 * @returns 決済情報オブジェクト
 */
export const parseMessage = (message: string) => {
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

export class Message {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  private extractPaymentInfo = (prefix: string): string => {
    const matched: RegExpMatchArray | null = this.message.match(`${prefix}.+`);
    return matched ? matched[0].replace(prefix, '') : '';
  };

  getUseDay(): string {
    return this.extractPaymentInfo('■利用日: ');
  }

  getUseStore(): string {
    return this.extractPaymentInfo('■利用先: ');
  }

  getUser(): string {
    return this.extractPaymentInfo('■利用者: ');
  }

  getAmount(): string {
    return this.extractPaymentInfo('■利用金額: ');
  }

  getPayMonth(): string {
    return this.extractPaymentInfo('■支払月: ');
  }
}

export class PaymentInfo {
  private useDay: string;
  private useStore: string;
  private user: string;
  private amount: string;
  private payMonth: string;

  constructor(
    useDay: string,
    useStore: string,
    user: string,
    amount: string,
    payMonth: string
  ) {
    this.useDay = useDay;
    this.useStore = useStore;
    this.user = user;
    this.amount = amount;
    this.payMonth = payMonth;
  }

  // Getter メソッドなど、必要に応じて追加
  getUseDay(): string {
    return this.useDay;
  }

  getUseStore(): string {
    return this.useStore;
  }

  getUser(): string {
    return this.user;
  }

  getAmount(): string {
    return this.amount;
  }

  getPayMonth(): string {
    return this.payMonth;
  }
}
