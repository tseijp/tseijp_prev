note_list_context = {"carousel":[
    {'active':' active',
    'back':"{% url 'note_iframe' %}"
    },
    {'active':'',
    'back':'https://mdbootstrap.com/img/Photos/Others/images/77.jpg'}
]}

note_qiita_8 = {
"1":{"head":"初めに","text":"""
都内の某国立大で化学生命（バイオ系）専攻してます.
先日, 大学のオープンキャンパスでGANによる動画生成のデモ発表をしました．

TouchDesigner使えばリアルタイムで実装できるかな...と思って使ってみました．
他の型のコードをかなり使ってますがですが，もしよければ試してみてください．
<s>[デモソースコード](https://gigthub.com/tsei/pytorch-yanai)</s>近日

以降では二つのことを共有出来たらなーと思います．最後にデモについて少し書きます！

  * TouchDesignerでPythonの重い処理の実行.
  * Pythonライブラリ（PyTorch等）を入れる.

TouchDesignerを初めて数か月なのに, 何故かqiitaの記事に登録してました．qiitaも初めてです．
しかも間違えて二つ入力しちゃってました．．．代替頂ける方ご連絡お願いします(;__;)
実用性ありそうなこと書けませんでした．．．本当に申し訳ありません．
"""},


"2":{"head":"重い処理の実行について","text":"""
TouchDesignerはPythonが本来の処理にも使われており，他で重い処理をするとフリーズします．
なので，subprocessとしてプロセスをいくつかに分けます


前のプロセスの終了をchop_execで取得し，td_utils.pyで実行するコマンドを渡します．
処理が終わったらsocket通信でudpinに送り，datexec2で通知を次の処理に送ります．
<pre><code>
import subprocess
arg0 = '{{Python Path}}'
arg1 = '{{Python File}}'
args = ["--%s %s"%(a,b) for a,b in op('opt_test_full').rows() if a]
cmd  = ' '.join( [arg0, arg1] + args)
op('udpin2').par.clear.pulse()
subprocess.Popen(['python', 'util/td_utils.py',
                  '-p',str(op('udpin2').par.port.val),
                  '-d','%s'%project.folder,'-c',cmd,'-s','15'],
                  cwd=dir,shell=True)
</code></pre>
[td_utils.pyコードサンプル](https://gist.github.com/tseijp/caab3149c3c9fcbe1e45c466c1f41a53)
[参考:TouchDesigner | Python and the Subprocess Module | Matthew Ragan](https://matthewragan.com/2019/08/14/touchdesigner-python-and-the-subprocess-module/)
"""},

"2.5":{"head":"","text":"""
poseの動画から全身の動画をするopです. 前処理が終わったら生成を開始します．
生成が終わったら次の処理に通知させます．
""","img":"https://res.cloudinary.com/dpimrj9cp/image/upload/v1575855138/pose2vid.jpg"},

"3":{"head":"TouchDeisngerでのPythonライブラリについて",
    "text":"""
venvでpip install -> TouchDesinger内でPathを通す or sys.path.append()
  * TouchDesingerでは内部にNumpyを含んでおり，しかも結構内部で依存してそうでした．
  * PyTorchを入れたとき，一緒にNumpyが入ってきて，壊れました．環境構築しなおしました．


condaで仮想環境 -> TouchDesignerのsite-packages消す -> `mlink /d site-packages {{path-to-venv}}/site-packages`
  * この方法が唯一PyTorchが動いたのですが，デモ当日にGPU周りで謎のエラーが出ました．
  (`libiomp5md.dll、libiomp5mmd.pdb libiompstubs5md.dll` を上書きしたら動きました)
  * 結局最初からprocessを分ければよかったなと反省してます．結論はまだ出てないですが，自分なりの考えをまとめました．
"""},

"4":{"head":"デモについて","text":"""
前記の通り, 大学のオープンキャンパスで私はGANによる動画生成のデモ展示をしました．
動画合成というタスクで，題名がEverytext dance now という論文を試しました.

デモが録画した映像からボーズを推定し，推定したポーズからAIが全身画像を生成します．
(結果はWindows落ちるしポーズ推定めっちゃかかるしでデモとしては大失敗でした.)

SpoutとPyOpenGLでTouchDesignerとリアルタイム処理してる方がいたので色々試しましたが，今回のデモでは処理が重すぎてダメでした．
[TD-EX-OpenCV-BY-Spout](https://github.com/yeataro/TD_KIWI/tree/master/TD-EX-OpenCV-BY-Spout)
実際動画生成には1コアで 15 it/s 程の速度が出るので，RealSenseを使えばリアルタイム生成出来そうです．

元々BlenderのAnimationNodesを使ったことがあって，TouchDesignerも同じ感じなのかな...と思ったら何倍も難しかったです．
(BlenderはPythonをまるっと消して, 同じようにconda create->mklinkすると，楽しいことができます．)

TouchDesignerでスタイル変換をしてる方もいるみたいなので，もっと色々試してみます．
[Style Transfer in TouchDesigner](https://freesoft.dev/program/98209499)
"""},

"5":{"head":"","text":"None","img":"https://res.cloudinary.com/dpimrj9cp/image/upload/v1575855510/output2.gif"},

#"5.2":{"head":"about demo","text":"""
#The other day, I did a demonstration of the moving image generation by GAN in the open campus of the University.
#In the task of video synthesis, the title of paper is the thesis that Everytextdancenow.
#I found The implementation in PyTorch tried from Github.
#Demo estimates the Bose from video recorded,
#AI will generate a whole text image from the estimated pose.
#"""},
}
