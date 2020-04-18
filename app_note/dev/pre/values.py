note_list_context = {"carousel":[
    {'active':' active',
    'back':"{% url 'note_iframe' %}"
    },
    {'active':'',
    'back':'https://mdbootstrap.com/img/Photos/Others/images/77.jpg'}
]}

note_qiita_8 = {
"1":{"head":"TouchDesignerで動画生成","text":"""
都内の某国立大で化学生命（バイオ系）専攻してます.
先日, 大学のオープンキャンパスでGANによる動画生成のデモ発表をしました．

TouchDesigner使えばリアルタイムで実装できるかな...と思って使ってみました．
他の方のコードをかなり使ってますが，もしよければ試してみてください．
<s>[デモソースコード](https://gigthub.com/tsei/pytorch-yanai)</s>近日

以降では二つのことを共有出来たらなーと思います．最後にデモについて少し書きます！

  1. TouchDesignerでPythonの重い処理の実行.
  1. Pythonライブラリ（PyTorch等）を入れる.

TouchDesignerを初めて数か月なのに, 何故かqiitaの記事に登録してました．qiitaも初めてです．あまり実用性ありそうなこと書けませんでした(;_;)

"""},


"2":{"head":"重い処理の実行について","text":"""
TouchDesignerはPythonが本来の処理にも使われており，他で重い処理をするとフリーズします．
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

"3":{"head":"TouchDeisngerでのPythonライブラリについて","text":"""
venvでpip install -> TouchDesinger内でPathを通す or sys.path.append()

  1. TouchDesingerでは内部にNumpyを含んでおり，しかも結構内部で依存してそうでした．
  1. PyTorchを入れたとき，一緒にNumpyが入ってきて，壊れました．環境構築しなおしました．


condaで仮想環境 -> TouchDesignerのsite-packages消す -> `mlink /d site-packages {{path-to-venv}}/site-packages`

  1. この方法が唯一PyTorchが動いたのですが，デモ当日にGPU周りで謎のエラーが出ました．
  (`libiomp5md.dll、libiomp5mmd.pdb libiompstubs5md.dll` を上書きしたら動きました)
  1. 結局最初からprocessを分ければよかったなと反省してます．結論はまだ出てないですが，自分なりの考えをまとめました．
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
今年の春にDjangoを勉強して，gunicornとHerokuでデプロイしたサービスを半年放置していたらサーバーエラーで動かなくなっていました．．．

12月はqiitaが熱いですね！🔥自分も[Advent Calendar](https://qiita.com/advent-calendar/2019/touchdesigner)に参加したくて，でも初投稿は自分のサイトでしたかったので，結局AWSでデプロイし直しました．（あと，夏の増税前に駆け込みで買ったドメインも供養しないとなと思ってました．）

AWSがKyashというバーチャルVisaカードが使えたので使ってみました．下のサイト通りにしたらうまくいきました（特に最初のサイト凄い！20分！）．AWSで初めてデプロイしたので，作業中のメモをまとめました．

### ref
1.  [【20分でデプロイ】AWS EC2にDjango+PostgreSQL+Nginx環境を構築してササッと公開 - Qiita](https://qiita.com/tachibanayu24/items/b8d73cdfd4cbd42c5b1d)
1. [Djangoの既存プロジェクトをec2にデプロイ - Qiita](https://qiita.com/kur/items/fb75354ee53671c79614)
1. [【AWSでサイト制作5】独自ドメイン設定 - Qiita](https://qiita.com/HitomiHoshisaki/items/7d7345eb67390f16fed4)
1. [AWS Route 53を使って独自ドメインのWebページを表示させてみよう | Avintonジャパン株式会社](https://avinton.com/academy/route53-dns-vhost/)
1. [お名前.comで取ったドメインをAWSの「Route 53」で利用する | melon.Lab](https://mel.onl/onamae-domain-aws-route-53/#toc2)
1. [EC2上のDjangoアプリを独自ドメイン、SSL対応する - Qiita](https://qiita.com/moto2g/items/e6454a51d61570948171)
"""},

"2":{"head":"AWS EC2", "text":"""
最初間違えてUbuntuを選んでなくて気づくのに時間かかりました．．．(;__;)

1. サービス(左上) -> EC2 -> インスタンス(左側)->インスタンスの管理画面へ
1. [インスタンスの作成] を押下 -> `AMI(Amazon Machine Image)`にUbuntu選択 -> 新規にキーを作成する -> `aws_ubuntu.pem` をダウンロード
1. インスタンスの状態がrunningかを確認
1. `chmod 400 aws-ubuntu.pem`:パーミッションを変更->自分の`~/.ssh`ディレクトリとかに保管
1. `ssh -i "~/.ssh/aws_ubuntu.pem" ubuntu@<ip address>`:ユーザー名はubuntu以外だとec2-userとか
"""},

"3":{"head":"env","text":"""
### Ubuntu env
Ubuntuのユーザーを作成し，作ったユーザーでsshできるようにします．

1. `sudo -i`
1. `apt update -y`
1. `adduser <app-user>` : ubuntu以外はuseraddでまた違うらしい
1. `gpasswd -a user_name sudo` : sudo グループに追加
1. `usermod -aG sudo <app-user>`
1. `cp -r /home/ec2-user/.ssh /home/<app-user>/.ssh`
1. `chown -R <app-user>:<app-user> /home/<app-user>/.ssh`
1. `sudo su <app-user>`
1. `chmod 0600 ~/.ssh/authorized_keys`

### Python env

1. `apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib`
1. `sudo -H pip3 install virtualenv`
1. `virtualenv <venv_name>`
1. `source <venv_name>/bin/activate`
1. `pip install django gunicorn psycopg2 psycopg2-binary Pillow`
"""},

"4":{"head":"PostgreSQL", "text":"""
Herokuとかとだいたい同じです．

1. `sudo -u postgres psql`
1. `CREATE DATABASE <DB_NAME>;`
1. `CREATE USER <DB_USERNAME> WITH PASSWORD '<DB_PASSWORD>';`
1. `ALTER ROLE <DB_USERNAME> SET client_encoding TO 'utf8';`
1. `ALTER ROLE <DB_USERNAME> SET default_transaction_isolation TO 'read committed';`
1. `ALTER ROLE <DB_USERNAME> SET timezone TO 'UTC+9';`
1. `GRANT ALL PRIVILEGES ON DATABASE <DB_NAME> TO <DB_USERNAME>;`


<pre><code>...
ALLOWED_HOSTS = ['{{ip adress}}']
...
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '{{DB_NAME}}',
        'USER': '{{DB_USERNAME}}',
        'PASSWORD': '{{DB_PASSWORD}}',
        'HOST': 'localhost',
        'PORT': '',
}}</code></pre>
"""},

"5":{"head":"AWS","text":"""
1. 左カラムから、セキュリティグループ -> セキュリティグループを作成
1. 作成したものを右クリック -> ルールの作成 ->
    1. `カスタムTCP▽`,
    1. `TCP`,
    1. `8000`
    1. `0,0,0,0/0`
1. インスタンス -> 右クリック -> ネットワーキング -> セキュリティグループの変更->作成したものを選択
1. `python3 manage.py runserver 0.0.0.0:8000`
1. `http://<your_ip>:8000`で確認->`deactivate`:venvぬける
"""},

"6":{"head":"gunicorn","text":"""
gunicornの設定をします．自分はアクセスログとエラーログをホームディレクトリに保存してます．gunicornの場所を間違えてはまったので気を付けてください．（venv使ったかで変わります）

1. `sudo vi /etc/systemd/system/gunicorn.service`
1. `sudo systemctl start gunicorn.service`
1. `sudo systemctl enable gunicorn`

<pre><code>[Unit]
Description=gunicorn daemon
After=network.target
[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/<PJ_NAME>
ExecStart={{`which gunicorn` ででたpath. **/gunicornとか}}
--workers 3 --bind unix:/home/{{user}}/{{prj}}/{{prj}}.sock
{{prj_name}}.wsgi:application
--access-logfile "{{any_dir}}/access.log"
--error-logfile "{{any_dir}}/error.log"
[Install]
WantedBy=multi-user.target
</code></pre>
"""},

"7":{"head":"nginx","text":"""
nginxの設定をします．一度したらあんまり触れないです．viを使います🔥

1. `sudo vi /etc/nginx/sites-available/<PJ_NAME>`
1. `sudo ln -s /etc/nginx/sites-available/<PJ_NAME> /etc/nginx/sites-enabled/`
1. `sudo systemctl restart nginx`
1. `sudo ufw delete allow 8000`
1. `sudo ufw allow 'Nginx Full'`

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
"""},

"8":{"head":"ec2","text":"""
1. セキュリティグループ -> セキュリティグループにタイプ: HTTPのルールを追加
1. （インスタンス-> ネットワーキング -> セキュリティグループの変更->セキュリティグループ選択）←先ほどしてなかったら

### Elastic IPs
1. サイドメニュー -> Elastic IPsからポチポチ
1. Elastic IP アドレスの割り当て -> 割り当て
1. Elastic IP アドレスの関連付け -> 関連付け
"""},

"9":{"head":"domain", "text":"""
ドメインとサーバーの繋げ方がいろいろあって混乱しますが，

* [お名前.comでのドメイン取得とRoute 53との連携(お名前.comへのRoute 53DNS登録) - のぴぴのメモ](http://nopipi.hatenablog.com/entry/2019/01/03/132701)

に
各メリットデメリットがまとめられていて，結局ネームサーバー1をいじるのがが一番楽でした


1. AWS SERVICE -> Route 53 -> DNS 管理 -> Create Hosted Zone -> 取得したドメインを記入 -> create
1. ホストゾーンの詳細 -> レコードセットの作成 -> type:A, value:<取得したElastic IP記入> -> 作成
1. レコードセットの一覧に元々あるType:NSの四つのvalue（ns-\*\*.\*\*.\*\*）を控えておく
1. レコードセットの一覧のいずれを選択 -> TTL（キャッシュする時間）を300sに設定
1. お名前.com -> ドメイン一覧 -> 取得したドメインを選択 -> ネームサーバー情報
1. 他のネームサーバを利用 -> ネームサーバに先ほどのNSの四つのvalue -> 設定
1. `sudo vi /etc/nginx/sites-available/<PJ_NAME>` -> `server_name <your doman> <your Elastic IP>;`
1. `vi <PJ_NAME>/<settings file>.py` -> `ALOWED_HOST=["<DOMAIN>","<Elastic IP>"]`
"""},

"10":{"head":"ssl","text":"""
HTTPSで繋がるように設定します．

1. [certbot](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx)でUbuntuとNginx選択->コマンド上から実行
1. `sudo add-apt-repository universe`ができないので，URLから直接入れる
1. `sudo certbot --nginx`でポチポチ -> `whether or not to redirect HTTP`で2を選択
1. `sudo certbot renew --post-hook "systemctl restart nginx"`:を試す
1. `sudo vi /etc/cron.d/letsencrypt` -> `0 1 * * 1 sudo certbot renew --post-hook "systemctl restart nginx"`
1. ec2 -> セキュリティグループ -> セキュリティグループにタイプ: HTTPSのルールを追加
"""}
}
