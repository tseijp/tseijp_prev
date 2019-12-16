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
他の方のコードをかなり使ってますが，もしよければ試してみてください．
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

* [td_utils.pyコードサンプル](https://gist.github.com/tseijp/caab3149c3c9fcbe1e45c466c1f41a53)
* [参考:TouchDesigner | Python and the Subprocess Module | Matthew Ragan](https://matthewragan.com/2019/08/14/touchdesigner-python-and-the-subprocess-module/)
"""},

"2.5":{"head":"","text":"""
poseの動画から全身の動画をするベースCOMPです. 前処理が終わったら生成を開始します．
生成が終わったら次の処理に通知させます．
""","img":"https://res.cloudinary.com/dpimrj9cp/image/upload/v1575855138/pose2vid.jpg"},

"3":{"head":"TouchDeisngerでのPythonライブラリについて",
    "text":"""
venvでpip install -> TouchDesinger内でPathを通す or sys.path.append()

  * TouchDesingerでは内部にNumpyを含んでおり，しかも結構内部で依存してそうでした．
  * PyTorchを入れたとき，一緒にNumpyが入ってきて，壊れました．環境構築しなおしました．


condaで仮想環境 -> TouchDesignerのsite-packages消す -> <code><pre>mlink /d site-packages {{path-to-venv}}/site-packages</code></pre>

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

"4":{"head":"about demo","text":"""
The other day, I did a demonstration of the moving image generation by GAN in the open campus of the University.
In the task of video synthesis, the title of paper is the thesis that Everytextdancenow.
I found The implementation in PyTorch tried from Github.
Demo estimates the Bose from video recorded,
AI will generate a whole text image from the estimated pose.
"""},

"5":{"head":"","text":"左上が生成結果です．Webカメラを忘れて，内カメラで録画してます．",
"img":"https://res.cloudinary.com/dpimrj9cp/image/upload/v1575855510/output2.gif"},
}
note_qiita_16 ={
"1":{"head":"Django in AWS and Nginx", "text":"""
qiita初投稿は自分のサーバーでと思って，AWSとDjangoでデプロイしました．
しかも間違えて連続して二つ登録してて，qiita才能なかったです．
前提としてDjango,gunicornとPostgreSQLでサービスは作り終えた後の話です．
"""},

"2":{"head":"AWS EC2インスタンス", "text":"""
* サービス > EC2 > インスタンスでインスタンスの管理画面
* [インスタンスの作成] を押下 > `~AMI(Amazon Machine Image)にUbuntu~` -> 新規にキーを作成する -> aws_ubuntu.pem をダウンロード
* インスタンスの状態がrunningを確認
* `chmod 400 aws-ubuntu.pem`:パーミッションを変更->"自分の.sshディレクトリとかに保管"
* `ssh -i "~/.ssh/aws_ubuntu.pem" ubuntu@<ip address>`:ユーザー名はubuntu以外だとec2-userとか"""},

"4":{"head":"Ubuntu env","text":"""
* `sudo -i`
* `apt update -y`
* `adduser <app-user>` : ubuntu以外はuseradd
* `gpasswd -a user_name sudo` : sudo グループに追加
* `usermod -aG sudo <app-user>`
* `cp -r /home/ec2-user/.ssh /home/<app-user>/.ssh`
* `chown -R <app-user>:<app-user> /home/<app-user>/.ssh`
* `sudo su <app-user>`
* `chmod 0600 ~/.ssh/authorized_keys`
* `apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib`"""},

"5":{"head":"Python env", "text":"""
* `apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib`
* `sudo -H pip3 install virtualenv`
* `virtualenv python3`
* `source python3/bin/activate`
* `pip install django gunicorn psycopg2 psycopg2-binary Pillow`"""},

"6":{"head":"PostgreSQL", "text":"""
* `sudo -u postgres psql`
* `CREATE DATABASE <DB_NAME>;`
* `CREATE USER <DB_USERNAME> WITH PASSWORD '<DB_PASSWORD>';`
* `ALTER ROLE <DB_USERNAME> SET client_encoding TO 'utf8';`
* `ALTER ROLE <DB_USERNAME> SET default_transaction_isolation TO 'read committed';`
* `ALTER ROLE <DB_USERNAME> SET timezone TO 'UTC+9';`
* `GRANT ALL PRIVILEGES ON DATABASE <DB_NAME> TO <DB_USERNAME>;`

<pre><code>...
ALLOWED_HOSTS = ['<ip adress>']
...
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '<DB_NAME>',
        'USER': '<DB_USERNAME>',
        'PASSWORD': '<DB_PASSWORD>',
        'HOST': 'localhost',
        'PORT': '',
}}</code></pre>
"""},

"7":{"head":"AWS","text":"""
* 左カラムから、セキュリティグループ -> セキュリティグループを作成
* インスタンス -> 右クリック(副クリック) -> ネットワーキング -> セキュリティグループの変更
* `python3 manage.py runserver 0.0.0.0:8000`->`http://<your_ip>:8000`で確認->`deactivate`"""},

"8":{"head":"gunicorn","text":"""
* `sudo vi /etc/systemd/system/gunicorn.service`

<pre><code>
[Unit]
Description=gunicorn daemon
After=network.target
[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/<PJ_NAME>
ExecStart=<`which gunico` ででたpath:.**/gunicorn> --access-logfile - --workers 3 --bind unix:/home/ubuntu/<PJ_NAME>/<PJ_NAME>.sock <PJ_NAME>.wsgi:application
[Install]
WantedBy=multi-user.target</code></pre>

* `sudo systemctl start gunicorn.service`
* `sudo systemctl enable gunicorn`"""},

"9":{"head":"nginx","text":"""
* `sudo vim /etc/nginx/sites-available/<PJ_NAME>`
<pre><code>
server {
        listen 80;
        server_name <EC2のパブリックIP>;
        location = /favicon.ico {access_log off; log_not_found off;}
        location /static/ {
                root /home/ubuntu/<PJ_NAME>;
        }
        location / {
                include proxy_params;
                proxy_pass http://unix:/home/ubuntu/<PJ_NAME>/<PJ_NAME>.sock;
        }
}</code></pre>
* `sudo ln -s /etc/nginx/sites-available/<PJ_NAME> /etc/nginx/sites-enabled/`
* `sudo systemctl restart nginx`
* `sudo ufw delete allow 8000` : #8000番ポートはもう使わないのでkill
* `sudo ufw allow 'Nginx Full'`"""},

"10":{"head":"ec2","text":"""
* セキュリティグループ -> セキュリティグループにタイプ: HTTPのルールを追加
* インスタンス-> ネットワーキング -> セキュリティグループの変更->セキュリティグループ選択"""},

"11":{"head":"Elastic IPs","text":"""
* サイドメニュー -> Elastic IPsからポチポチ
* Elastic IP アドレスの割り当て -> 割り当て
* Elastic IP アドレスの関連付け -> 関連付け"""},

"12":{"head":"domain", "text":"""
* AWS SERVICE -> Route 53 -> DNS 管理 -> Create Hosted Zone -> 取得したドメインを記入 -> create
* ホストゾーンの詳細 -> レコードセットの作成 -> type:A, value:<取得したElastic IP記入> -> 作成
* レコードセットの一覧に元々あるType:NSの四つのvalue（ns-\*\*.\*\*.\*\*）を控えておく
* レコードセットの一覧のいずれを選択 -> TTL（キャッシュする時間）を300sに設定
* お名前.com -> ドメイン一覧 -> 取得したドメインを選択 -> ネームサーバー情報
* 他のネームサーバを利用 -> ネームサーバに先ほどのNSの四つのvalue -> 設定
* `sudo vi /etc/nginx/sites-available/<PJ_NAME>` -> `server_name <your doman> <your Elastic IP>;`
* `vi <PJ_NAME>/<settings file>.py` -> `ALOWED_HOST=["<DOMAIN>","<Elastic IP>"]`"""},

"13":{"head":"ssl","text":"""
* [certbot](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx)でUbuntuとNginx選択->コマンド上から実行
* `sudo add-apt-repository universe`ができないので，URLから直接入れる
* `sudo certbot --nginx`でポチポチ -> `whether or not to redirect HTTP`で2を選択
* `sudo certbot renew --post-hook "systemctl restart nginx"`:を試す
* `sudo vi /etc/cron.d/letsencrypt` -> `0 1 * * 1 sudo certbot renew --post-hook "systemctl restart nginx"`
* ec2 -> セキュリティグループ -> セキュリティグループにタイプ: HTTPSのルールを追加"""}
}
