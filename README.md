# Calendar

JP calendar

# 日本の休日にちゃんと対応したカレンダー

日本の休日に対応しようとしたプログラマーは、まずハッピーマンデーに苦しめられ、次に毎年決まっているわけではない春分の日みたいなやつに苦しめられます。

今回は、政府が公開している( https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html )Shift-JISのCSV( 
https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv )をダウンロードして解析してUTF-8のJSONに出力の後、利用するプログラムを書きました。

GitHub Actionsにで毎月1日付近に自動更新するようにしましたが、仕様変更等で動かなくなることも考えられます。
もし止まっていそうな場合は連絡をもらえると助かります。

Web版: https://cal.lapis.dev/

## 更新

```
deno task update
```

これにより、`docs/holiday.YYYY.json` という年ごとの休日JSONと、`docs/holiday.json` というCSV内のデータを全部入れたJSONが出力されます。

おそらく3年分くらいがCSVに入っているだろうということと、休日のログでも残しておこうかという意味を込めて前者の年ごとのファイルも出力しています。

# calコマンド代用

勉強ついでにcalコマンドも作ってみている（まだ不完全）

ここに勉強の成果たるコマンドのオプション説明を書く。

TODO:nexe使おうぜ

# その他

日本の休日固定日にしてほしい……後Shift-JIS滅びて……

# 変更点メモ

* URL変更に伴いついでにDeno実行に変更 - 2023/02/02
    * https://www8.cao.go.jp/chosei/shukujitsu/shukujitsu.csv → https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv
    * 個人的にNode.jsをやめて全面的にDenoへ移行している。
* GitHub Actionsによる自動更新処理の追加 - 2021/01/19
    * 毎月1日頃に更新する処理を追加。
* 1955年からのデータが追加 - 2019/08/22
    * いつの間にか1955年からのデータが追加されていたので一気に過去データが追加された。
    * どうした？まともなIT担当者を雇ったのか？最近改善具合すごくない？
* 2019年の新カレンダー取得時にフォーマットが変更 - 2019/01/30
    * 多少マシでシンプルなフォーマットになったり、HTTPSになってたり、いろいろ改善がある。
    * しかし、政府はそういう改善しない前提で書いてたのでうれしいけどちょっとつらい。
