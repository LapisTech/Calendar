# Calendar

JP calendar

# 日本の休日にちゃんと対応したカレンダー

日本の休日に対応しようとしたプログラマーは、まずハッピーマンデーに苦しめられ、次に毎年決まっているわけではない春分の日みたいなやつに苦しめられます。

今回は、政府が公開している( https://www8.cao.go.jp/chosei/shukujitsu/gaiyou.html )Shift-JISのCSV( 
https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv )をダウンロードして解析してUTF-8のJSONに出力の後、利用するプログラムを書きました。

Web版に関しては更新忘れてたら連絡して（）

Web版: https://lapistech.github.io/Calendar/

## 更新

```
npm run update
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

* 2019年の新カレンダー取得時にフォーマットが変更 - 2019/01/30
    * 多少マシでシンプルなフォーマットになったり、HTTPSになってたり、いろいろ改善がある。
    * しかし、政府はそういう改善しない前提で書いてたのでちょっとつらい。
