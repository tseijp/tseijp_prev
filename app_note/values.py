note_list_context = {"carousel":[
    {'active':' active',
    'back':"{% url 'note_iframe' %}"
    },
    {'active':'',
    'back':'https://mdbootstrap.com/img/Photos/Others/images/77.jpg'}
]}

note_qiita_8 = {
"1":{"head":"初めに","text":"""
都内の某国立大で限界大学生してます.
大学では化学生命（バイオ系）専攻してますが，いまだに生命？(なにそれ？)な状況です.

先日, 大学のオープンキャンパスでGANによる動画生成のデモ発表をしました．
TouchDesignerなら簡単に実装できるかなと思ってはじめて使ってみました．

他人のコードをいじっただけですが，もしよければ試してみてください．
~[デモソースコード](https://gigthub.com/tsei/pytorch-yanai)~"""},

"2":{"head":"お詫び","text":"""
TouchDesignerを初めて数か月なのに, 何故かqiitaの記事に登録してました．
しかも二つ...!?!?全然記憶になくてめちゃくちゃ焦ってます(;__;).

実用性のないことしか書けませんでした．．．本当に申し訳ありません．
以降では二つのことを共有出来たらなーと思います．最後にデモについて少し書きます！

  * TouchDesignerでの重い処理の並列化.

  * Pythonライブラリを入れる自分のベスト."""},

"3":{"head":"重い処理の並列化について","text":"""
TouchDesignerは中でPython使ってると聞いたので，機械学習できるのかとすごい期待してたのですが，
TouchDesigner本来の処理にも使われているらしく，重い処理をするとすぐに止まってしまいます．

なので，subprocessとしてプロセスをいくつか分けて，処理が終わったらsocket通信で通知させます．
"""},

"4":{"head":"TouchDeisngerでのPythonライブラリについて",
    "text":"""
結論はまだ出てないですが，自分なりの考えをまとめました．良い方法があれば良ければ教えてください.

venvでpip install -> Pathを通す

  * 先ほど述べたように，TouchDesingerでは内部にNumpyを含んでおり，しかも結構内部で依存してそうでした．
    軽いライブラリだとpipがよくて，Numpyやデバイス自体と依存してる場合はpipは壊れると勝手に思ってます．
    PyTorchを入れたとき，一緒にNumpyが入ってきて，壊れました．環境構築しなおしました．

condaで仮想環境 -> touchdesignerのsite-package消して，仮想環境からシンボリック

  * `conda create `で仮想環境を作成->TouchDesignerのsite-packages削除

  * `mklink `でシンボリックを作成

  * この方法が唯一PyTorchが動いたのですが，デモ当日にGPU周りで謎のエラーが出ました．
"""},

"5":{"head":"デモについて","text":"""
先日, 大学のオープンキャンパスで私はGANによる動画生成のデモ展示をしました．
動画合成というタスクで，題名がEverytext dance now という論文です.
PyTorchでの実装をGithubから見つけたので試してみました．

デモが録画した映像からボーズを推定し，推定したポーズからAIが全身画像を生成します．
(結果はWindows落ちるしポーズ推定めっちゃかかるしでデモとしては大失敗でした.)

元々BlenderのAnimationNodesを初めて使って，同じ感じなのかな...と思ったら全然違いました．
(blenderはPythonをまるっと消して, 同じ場所にconda createすると，楽しいことができました．)
TouchDesignerで面白いことをしてる方を見つけたので，もっといじってみます
[Style Transfer in TouchDesigner](https://freesoft.dev/program/98209499)
"""},


"5.2":{"head":"about demo","text":"""
The other day, I did a demonstration of the moving image generation by GAN in the open campus of the University.
In the task of video synthesis, the title of paper is the thesis that Everytextdancenow.
I found The implementation in PyTorch tried from Github.
Demo estimates the Bose from video recorded,
AI will generate a whole text image from the estimated pose.
"""},
}
