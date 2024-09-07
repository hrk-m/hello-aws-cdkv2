# udemy 学習項目

## ts-starter

複数の Stack 間でリソースの共有

<img src="/images/image1.png">

## ts-rest-api

GET: /empl?id={{id}}
POST: /empl

<img src="/images/image2.png">

- api 実行してフロントから取得確認
  - file path: ts-rest-api/webTest

<img src="/images/image3.png">

## ts-cw-metrics

<img src="/images/image4.png">

slack への通知テストは以下のコマンドを実行
webhook を用意して ts-cw-metrics/services/hook.ts:3 に設定

```
ts-node services/hookTest.ts
```

Ts-Api4xxAlarm では ts-rest-api でエラーが出た時の Slack 通知のイベントを設定した
