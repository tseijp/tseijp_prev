[ { 'id':1, 'note_object':None, 'posted_user':'tseijp', 'posted_time':'',
    'ja_text':'''# TouchDesignerで動画生成
都内の某国立大で化学生命（バイオ系）専攻してます.
先日, 大学のオープンキャンパスでGANによる動画生成のデモ発表をしました．

TouchDesigner使えばリアルタイムで実装できるかな...と思って使ってみました．
他の方のコードをかなり使ってますが，もしよければ試してみてください．

以降では二つのことを共有出来たらなーと思います．最後にデモについて少し書きます！

  1. TouchDesignerでPythonの重い処理の実行.
  1. Pythonライブラリ（PyTorch等）を入れる.

TouchDesignerを初めて数か月なのに, 何故かqiitaの記事に登録してました．qiitaも初めてです．あまり実用性ありそうなこと書けませんでした(;_;)
'''},
  { 'id':2, 'note_object':1, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# 重い処理の実行について
TouchDesignerはPythonが中の処理にも使われており，他で重い処理をするとフリーズします．
なので，subprocessとしてプロセスをいくつかに分けます

前のプロセスの終了をchop_execで取得し，td_utils.pyで実行するコマンドを渡します．
処理が終わったらsocket通信でudpinに送り，datexec2で通知を次の処理に送ります．
```
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
```
* [td_utils.pyコードサンプル](https://gist.github.com/tseijp/caab3149c3c9fcbe1e45c466c1f41a53)
* [参考:TouchDesigner | Python and the Subprocess Module | Matthew Ragan](https://matthewragan.com/2019/08/14/touchdesigner-python-and-the-subprocess-module/)
'''},
  { 'id':3, 'note_object':1, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''poseの動画から全身の動画をするベースCOMPです. 前処理が終わったら生成を開始します．
生成が終わったら次の処理に通知させます．
[img](https://res.cloudinary.com/dpimrj9cp/image/upload/v1575855138/pose2vid.jpg)
'''},
  { 'id':4, 'note_object':1, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# TouchDeisngerでのPythonライブラリについて
venvでpip install -> TouchDesinger内でPathを通す or sys.path.append()

  1. TouchDesingerでは内部にNumpyを含んでおり，しかも結構内部で依存してそうでした．
  1. PyTorchを入れたとき，一緒にNumpyが入ってきて，壊れました．環境構築しなおしました．


condaで仮想環境 -> TouchDesignerのsite-packages消す -> `mlink /d site-packages {{path-to-venv}}/site-packages`

  1. この方法が唯一PyTorchが動いたのですが，デモ当日にGPU周りで謎のエラーが出ました．
  (`libiomp5md.dll、libiomp5mmd.pdb libiompstubs5md.dll` を上書きしたら動きました)
  1. 結局最初からprocessを分ければよかったなと反省してます．結論はまだ出てないですが，自分なりの考えをまとめました．
'''},
  { 'id':5, 'note_object':1, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''左上が生成結果です．Webカメラを忘れて，内カメラで録画してます．
[img](https://res.cloudinary.com/dpimrj9cp/image/upload/v1575855510/output2.gif)
'''},
  { 'id':6, 'note_object':None, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# Django in AWS and Nginx with お名前.com
今年の春にDjangoを勉強して，gunicornとHerokuでデプロイしたサービスを半年放置していたらサーバーエラーで動かなくなっていました．．．

[Advent Calendar](https://qiita.com/advent-calendar/2019/touchdesigner)に参加したくて，でも初投稿は自分のサイトでしてみたかったので，結局別のサーバーでデプロイし直しました．（あと，夏の増税前に駆け込みで買ったドメインも供養しないとなと思ってました．）

AWSがKyashというバーチャルVisaカードを使えたので使ってみました．下のサイト通りにしたらうまくいきました（特に最初のサイト凄い！20分！）．AWSで初めてデプロイしたので，作業中のメモをまとめました．

### ref
1.  [【20分でデプロイ】AWS EC2にDjango+PostgreSQL+Nginx環境を構築してササッと公開 - Qiita](https://qiita.com/tachibanayu24/items/b8d73cdfd4cbd42c5b1d)
1. [Djangoの既存プロジェクトをec2にデプロイ - Qiita](https://qiita.com/kur/items/fb75354ee53671c79614)
1. [【AWSでサイト制作5】独自ドメイン設定 - Qiita](https://qiita.com/HitomiHoshisaki/items/7d7345eb67390f16fed4)
1. [AWS Route 53を使って独自ドメインのWebページを表示させてみよう | Avintonジャパン株式会社](https://avinton.com/academy/route53-dns-vhost/)
1. [お名前.comで取ったドメインをAWSの「Route 53」で利用する | melon.Lab](https://mel.onl/onamae-domain-aws-route-53/#toc2)
1. [EC2上のDjangoアプリを独自ドメイン、SSL対応する - Qiita](https://qiita.com/moto2g/items/e6454a51d61570948171)

'''},
  { 'id':7, 'note_object':6, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# AWS EC2
最初間違えてUbuntuを選んでなくて気づくのに時間かかりました．．．(;__;)

1. サービス(左上) -> EC2 -> インスタンス(左側)->インスタンスの管理画面へ
1. [インスタンスの作成] を押下 -> `AMI(Amazon Machine Image)`にUbuntu選択 -> 新規にキーを作成する -> `aws_ubuntu.pem` をダウンロード
1. インスタンスの状態がrunningかを確認
1. `chmod 400 aws-ubuntu.pem`:パーミッションを変更->自分の`~/.ssh`ディレクトリとかに保管
1. `ssh -i "~/.ssh/aws_ubuntu.pem" ubuntu@<ip address>`:ユーザー名はubuntu以外だとec2-userとか
'''},
  { 'id':8, 'note_object':6, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# Ubuntu env
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

# Python env

1. `apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib`
1. `sudo -H pip3 install virtualenv`
1. `virtualenv <venv_name>`
1. `source <venv_name>/bin/activate`
1. `pip install django gunicorn psycopg2 psycopg2-binary Pillow`
'''},
  { 'id':9, 'note_object':6, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# PostgreSQL
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
'''},
  { 'id':10, 'note_object':6, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# AWS
1. 左カラムから、セキュリティグループ -> セキュリティグループを作成
1. 作成したものを右クリック -> ルールの作成 ->
    1. `カスタムTCP▽`,
    1. `TCP`,
    1. `8000`
    1. `0,0,0,0/0`
1. インスタンス -> 右クリック -> ネットワーキング -> セキュリティグループの変更->作成したものを選択

1. `python3 manage.py runserver 0.0.0.0:8000`
1. `http://<your_ip>:8000`で確認->`deactivate`:venvぬける
'''},
  { 'id':11, 'note_object':6, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# gunicorn
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
'''},
  { 'id':12, 'note_object':6, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# nginx
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
'''},
  { 'id':13, 'note_object':6, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# ec2
1. セキュリティグループ -> セキュリティグループにタイプ: HTTPのルールを追加
1. （インスタンス-> ネットワーキング -> セキュリティグループの変更->セキュリティグループ選択）←先ほどしてなかったら

### Elastic IPs
1. サイドメニュー -> Elastic IPsからポチポチ
1. Elastic IP アドレスの割り当て -> 割り当て
1. Elastic IP アドレスの関連付け -> 関連付け
'''},
  { 'id':14, 'note_object':6, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# domain
ドメインとサーバーの繋げ方がいろいろあって混乱しますが，

* [お名前.comでのドメイン取得とRoute 53との連携(お名前.comへのRoute 53DNS登録) - のぴぴのメモ](http://nopipi.hatenablog.com/entry/2019/01/03/132701)

に
各メリットデメリットがまとめられていて，結局ネームサーバーをいじるのがが一番楽でした


1. AWS SERVICE -> Route 53 -> DNS 管理 -> Create Hosted Zone -> 取得したドメインを記入 -> create
1. ホストゾーンの詳細 -> レコードセットの作成 -> type:A, value:<取得したElastic IP記入> -> 作成
1. レコードセットの一覧に元々あるType:NSの四つのvalue（ns-\*\*.\*\*.\*\*）を控えておく
1. レコードセットの一覧のいずれを選択 -> TTL（キャッシュする時間）を300sに設定
1. お名前.com -> ドメイン一覧 -> 取得したドメインを選択 -> ネームサーバー情報
1. 他のネームサーバを利用 -> ネームサーバに先ほどのNSの四つのvalue -> 設定
1. `sudo vi /etc/nginx/sites-available/<PJ_NAME>` -> `server_name <your doman> <your Elastic IP>;`
1. `vi <PJ_NAME>/<settings file>.py` -> `ALOWED_HOST=["<DOMAIN>","<Elastic IP>"]`
'''},
  { 'id':15, 'note_object':6, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# SSL
HTTPSで繋がるように設定します．

1. [certbot](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx)でUbuntuとNginx選択->コマンド上から実行
1. `sudo add-apt-repository universe`ができないので，URLから直接入れる
1. `sudo certbot --nginx`でポチポチ -> `whether or not to redirect HTTP`で2を選択
1. `sudo certbot renew --post-hook "systemctl restart nginx"`:を試す
1. `sudo vi /etc/cron.d/letsencrypt` -> `0 1 * * 1 sudo certbot renew --post-hook "systemctl restart nginx"`
1. ec2 -> セキュリティグループ -> セキュリティグループにタイプ: HTTPSのルールを追加
'''},
  { 'id':16, 'note_object':None, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# pipenvで管理しなおす
pipでインストールしたlibを消して，再びinstallしようと思う.
PyTorchのバージョンを新しくしようとしたら，solサーバーのメモリが30GBを超えてて，datasetsやcheckpointsを消してからもう一度調べてみても22GBも使っていた．

通常なら`pip freeze > instaled.txt`->`pip uninstall -r installed.txt`で
使っていないlibやバージョンを消せるらしいが，普段--userオプションでインストールしており，一気に削除しようとするとPermission Errorで処理が止まってしまうので，Pythonでなんとかしようと思った．
'''},
  { 'id':17, 'note_object':16, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''<pre><code>[***@sol ~]$ du -h -d 3 | sort -hr | head -25
22G     .
12G     ./IED_HOME
9.1G    ./.ced_ubuntu
5.7G    ./IED_HOME/notebook
5.2G    ./IED_HOME/notebook/project
3.9G    ./.ced_ubuntu/.cache
3.3G    ./IED_HOME/.cache
2.9G    ./IED_HOME/.local
2.9G    ./.ced_ubuntu/.cache/pip
2.7G    ./IED_HOME/.local/lib
2.7G    ./IED_HOME/.cache/pip
2.7G    ./.ced_ubuntu/.conda/pkgs
2.7G    ./.ced_ubuntu/.conda
1.9G    ./.ced_ubuntu/.local
1.8G    ./.ced_ubuntu/.local/lib
549M    ./IED_HOME/.cache/torch
549M    ./.ced_ubuntu/.torch/models
549M    ./.ced_ubuntu/.torch
549M    ./.ced_ubuntu/.cache/torch
464M    ./.cache
445M    ./.cache/mozilla/firefox
445M    ./.cache/mozilla
374M    ./.ced_ubuntu/.cache/mozilla
281M    ./IED_HOME/notebook/y7_test_super_slomo
206M    ./IED_HOME/.local/share</code></pre>
'''},
  { 'id':18, 'note_object':16, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''pythonからpipを実行するために，次のような関数を定義しておく．

<pre><code>
import os
import sys
import subprocess
def run(cmd):
    proc = subprocess.Popen(cmd, shell=True,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)
    buf = []
    while True:
        line = proc.stdout.readline().decode('utf-8')
        buf.append(line)
        sys.stdout.write(line)
        if not line and proc.poll() is not None:
            break
    return ''.join(buf)</code></pre>
'''},
  { 'id':19, 'note_object':16, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''次に，現在のlibraryを取得し，配列を返す関数を用意する．

<pre><code>def get_libs():
    run('python3 -m pip freeze > libs.txt')
    with open("libs.txt", 'r') as f:
        return [l.rstrip('\n') for l in f.readlines()]
</code></pre>

それでこう
<pre><code>if __name__=='__main__':
    pri_libs = get_libs()
    '''delete libs'''
    cmd = ["python3 -m pip uninstall %s -y"%l.split('==')[0] for l in installed_lib]
    _=[print(run(c)) for c in cmd]
    del_libs = [l for l in get_libs() if not l in pri_libs]
    '''result'''
    libs_len = tuple(len(l) for l in [pri_libs, get_libs(), del_libs])
    print("\npri:%s\tnow:%s\tdel:%s"%libs_len)
    _=[print("\tdel:",l) for l in del_libs ]
</code></pre>
'''},
  { 'id':20, 'note_object':16, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''結果を確認すると，ちょっとへったかも
`pri:250,now:209`
<pre><code>22->20G     .
12->7.4G    ./.ced_ubuntu
1.9G->0?    ./.ced_ubuntu/.local
1.8G->0?    ./.ced_ubuntu/.local/lib
</code></pre>

`conda clean --all`したらちょっと減った
<pre><code>20->18G     .
7.4->4.8G    ./.ced_ubuntu
1.9G->177M    ./.ced_ubuntu/.local
1.8G->?M    ./.ced_ubuntu/.local/lib
</code></pre>

iedでもcedと同様にためした．
`pri:249 now:239 del:3`
<pre><code>
18->16G     .
12->11G     ./IED_HOME
2.9G->0?M    ./.ced_ubuntu/.cache/pip
2.9->1.5G    ./IED_HOME/.local
2.7G->0?M    ./IED_HOME/.local/lib
2.7->1.3G    ./IED_HOME/.local/lib

</code></pre>
'''},
  { 'id':21, 'note_object':16, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''`.cache`削除したらすごいことになった（消していいのかよくわかってないです）
<code><pre>8.5G    .
7.3G    ./IED_HOME
5.7G    ./IED_HOME/notebook
5.2G    ./IED_HOME/notebook/project
1.5G    ./IED_HOME/.local
1.3G    ./IED_HOME/.local/lib
899M    ./.ced_ubuntu
549M    ./.ced_ubuntu/.torch/models
549M    ./.ced_ubuntu/.torch
281M    ./IED_HOME/notebook/y7_test_super_slomo
206M    ./IED_HOME/.local/share
177M    ./.ced_ubuntu/.local
123M    ./.local
114M    ./.local/share
113M    ./.local/share/Trash
110M    ./.mozilla/firefox/57lndhxp.default
110M    ./.mozilla/firefox
110M    ./.mozilla
90M     ./.ced_ubuntu/.local/lib
87M     ./.ced_ubuntu/.local/share
75M     ./IED_HOME/notebook/y5_opencw
64M     ./IED_HOME/notebook/y11_test_dence_pose
53M     ./.ced_ubuntu/.old/ダウンロード
53M     ./.ced_ubuntu/.old
45M     ./.torch/models
</code></pre>
'''},
  { 'id':22, 'note_object':16, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# pipenvで環境構築
sudoでない環境でvirtualenvだと 構文エラーかきょかがないといわれるので使えなかった．

1. `python3 -m pip install pipenv`
1. `python3 -m pipenv install --python 3.6`
1. `python3 -m pipenv shell`
1. `python --version` -> 3.6.9になっているはず
1. `pip install torch==1.2.0 torchvision==0.4.0`
1. `pip install numpy==1.17` 1.18だとエラー
1. `pip install pillow==6.2.2` : 7.0だとエラー
1. `pip install opencv-python scipy pytz`
'''},
  { 'id':23, 'note_object':None, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# few-shot-vid2vid
自分用のメモです．英弱なので，ざっくり読んで，重要そうな部分をひたすらgoogle先生に聞いて読んでます．GAN全く詳しくないので間違ってる箇所多いと思います．無断転載なので5割理解出来たら消します🔥

* [arXiv](https://arxiv.org/abs/1910.12713)
* [youtube](https://youtu.be/8AZBuyEuDqc)
* [github](https://github.com/NVlabs/few-shot-vid2vid)

'''},
  { 'id':24, 'note_object':23, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# Introdunction
1. vid2vid: 人間のポーズやマスクのセマンティックを入力ビデオとし，フォトリアルなビデオに変換するタスク．大きな制限がある．
  1.  生成したい人やシーンの多数の画像がトレーニングに必要
  1. トレーニングした人の動画のみ合成できる
1.  `Typically, to obtain such a model, one begins with collecting a training dataset for the target task.` !?!?

1. 新たな入力セマンティックビデオへの一般化は不十分である!?
  1. データセットに含まれていない被験者の動画を生成するなど目に見えないドメインに一般化できるモデルを目指すべき
  1. vid2vidモデルが少数の画像だけで一般化できない場合，多くの画像を収集する必要がある
'''},
  { 'id':25, 'note_object':23, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''1. attention(注目の？)メカニズムを使った新しいNetwork weight生成モジュールを介して、一般化を実現.
1. vid2vidがtrainデータと同じビデオのみ合成できるのに対し，このモデルでは,ビデオ合成メカニズムを動的に構成.
1. サンプル画像を使用してネットワークの重みを生成するモジュールをトレーニング.
1. 生成モジュールの学習を促進するため,the learning objective function(学習目的関数？)を慎重に設計する。
'''},
  { 'id':26, 'note_object':23, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# Related work
### GAN

1. GANs [[13](https://arxiv.org/abs/1612.05424)]: few-shot vid2vid modelの基盤．ノイズ分布からサンプルを変換して出力
1. conditional GAN framework[[13](https://arxiv.org/abs/1612.05424), [42](https://arxiv.org/abs/1511.06434), [32](https://arxiv.org/abs/1606.07536), [14](https://arxiv.org/abs/1704.00028), [25](https://arxiv.org/abs/1812.04948)]: 入力データに基づいて出力を生成することで，出力をより柔軟に制御．入力データ形式はさまざま..．
  1. images [[22](https://arxiv.org/abs/1611.07004), [68](https://arxiv.org/abs/1703.10593), [30](https://arxiv.org/abs/1703.00848), [41](https://arxiv.org/abs/1903.07291)]
  1. categorical labels [39, 35, 65, 4]
  1. textual descriptions [43, 66, 62]
  1. videos [7, 12, 57, 67]: 今回使用したがこれは入力動画が一つ．

### Video generative models

1.  unconditional video synthesis models [54, 45, 51]:ランダムノイズから動画に変換
2. future video prediction models [48, 24, 11, 34, 33, 63, 55, 56, 10, 53, 29, 27, 18, 28, 16, 40]:未来のビデオフレームを観察されたものに基づいて生成
3. vid2vid models [57, 7, 12, 67]: semantic入力動画からフォトリアルな動画に変換．見えないドメイン（学習していないモデル）のビデオを合成できることが新規性.
'''},
  { 'id':27, 'note_object':23, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''### Adaptive networks
重みの一部が入力データに基づいて動的に計算されるnetworks. 通常のネットワークとは異なるinductive bias(誘導バイアス?)がある．

  1. sequence modeling [15],
  1. image filtering [23, 59, 49]
  1. frame interpolation [38, 37]
  1. neural architecture search [64]:aply

### Human pose transfer

1. 異なるポーズの人間の画像を利用することにより、見えないポーズの人間を合成
1. Human pose transferの方法は人体の事前優先順位を主に利用する
  1. 身体部分モデリング[1]
  1. 人間の表面ベースの座標マッピング[36]
1. 今回は入力semanticビデオのみ使用し，特定の人体優先順位は使用しない．ストリートシーンビデオ合成などの他のvid2vidタスクに同じモデルを直接使用できる．．．！？！？え
1. (既存の人間のポーズ転送方法は主に静止画像合成用に設計されており、問題の時間的側面を考慮していない．より時間的に一貫した結果をレンダリングする)
'''},
  { 'id':28, 'note_object':23, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''vid2vid model can convert a sequence of input semantic images $s^T_1 : s_1,s_2,...s_T$ to a sequence of output images $x^T_1=x_1,x_2,...x_T$
sequential generative model given by

$$x_t = F(x^{t-1}_{t-r}, s^t_{t-r}) = (1-m_t) \kentengCircle w_{t-1}(x_{t-1})+m_t \kentengCircle h_t$$

- $m_t = M_{\theta_M}(x^{t-1}_{t-r},s^t_{t-r})$ is  a soft occlution map
- $w_{t-1} = W_\theta_W(x^{t-1}_{t-r},s^t_{t-r})$ is the optical flow warped version of the last generated images
- $h_t=H_\theta_H(x^{t-1}_{t-r},s^t_{t-r})$ is the synthesized intermediate image

'''},
  { 'id':29, 'note_object':23, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# few shot vid2vid synthesis
fewshot vid2vid model convert novel input semantic videos,  K-shot example image and semantic image ${e_1,e_2,...e_K},{S_{e_1},S_{e_2},...S_{e_K}}$.

$$x_t = F(x^{t-1}_{t-\tau}, s^t_{t-\tau},{e_1,e_2,...e_K}, {S_{e_1}, S_{e_2},...S_{e_K})$$

we propose a network weight $\theta$ generation module $E$ for the image synthesis network $H$.

$$\theta_H = E(x_{t-1}^{t-\tau}, s^t_{t-\tau},{e_1,e_2,...e_K},{s_{e_1},s_{e_2}})$$

few-shot vid2vid framework based on Wang et al. [57],], which is the state-of-the-art. for the vid2vid task .we adopt the SPADE generator [41]

'''},
  { 'id':30, 'note_object':None, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# How to hack Django Server Error 500
Error文をSlackで送れたら簡単にServer Error 500を簡単に直せたので覚え書き．Errorが出るたびに悲しくなるので，ついでにエラー画面に猫のGIFを表示させた．

* [Django Server Error (500)攻略法【2019 アドカレ】 - Qiita](https://qiita.com/yuu-eguci/items/a1e4b0a2f238d5ccc985)
* [Pythonを使ってSlackに送信する方法 - Qiita](https://qiita.com/yoshitaku_jp/items/8a53272a0118e7604994)
'''},
  { 'id':31, 'note_object':30, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# Step1
1. SlackでLogin後，[Incoming](https://slack.com/services/new/incoming-webhook)にアクセス -> チャンネルを選び，Webhook URLを控え，ポチポチ進む
1. 適当なviews.pyに以下のように書く

<pre><code>your_app/views.py
from django.http import HttpResponseServerError
from django.views.decorators.csrf import requires_csrf_token
webhook_url = '控えたSlack Webhook URL をコピペ'
cat_iframes = [
  '(https://giphy.com/)で検索して，埋め込み分をコピペ',
]
</code></pre>
'''},
  { 'id':32, 'note_object':30, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''<pre><code>続き
@requires_csrf_token
def my_server_error(request, template_name='500.html'):
    import json
    import random
    import requests
    import traceback
    requests.post(
        webhook_url,
        data=json.dumps({
            'text': '\n'.join([
                f'Request uri: {request.build_absolute_uri()}',
                traceback.format_exc(),
            ]),
            'username': 'Django Server Error 500',
            'icon_emoji': ':jack_o_lantern:',
        })
    )
    message  = '\<h1\>Server Error (500)\</h1\>'
    message +=  random.choices(cat_iframes)[0]
    return HttpResponseServerError(message)
</code></pre>
'''},
  { 'id':33, 'note_object':30, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# Step2
Djangoのhandler500にカスタムしたものを上書きする．

<pre><code>your_prj_name/urls.py
from your_app_name.views import my_server_error
from django.conf.urls import handler500
handler500 = my_server_error</code></pre>
'''},
  { 'id':34, 'note_object':None, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# Linux コマンドメモ
`export: Command not found.`がでてきて，また何か悪いことをしたのかと思って焦った．そもそもshellに種類があるらしい．

1. setenv：csh系
1. export：sh系

tcshコマンドチートシート

1. `set var1 = ham` -> シェル変数
1. `setenv var2 egg` -> 環境変数
1. `alias python python3` -> pythonで2系が出ないようにする

'''},
  { 'id':35, 'note_object':34, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# Shellについて
ref

1. [初心者が調べた。shellとは](https://qiita.com/ycoda/items/87d23b818cb06ba1c348)
1. [シェル入門](http://webcache.googleusercontent.com/search?q=cache:RYdotdNX1RUJ:www-kn.sp.u-tokai.ac.jp/com/computer/shell/shell.html+&cd=7&hl=ja&ct=clnk&gl=jp)

知らなかった．．．

1. shell: UNIX系OSで操作するスクリプトの一種．bashやtcsh, ksh,zsh,fishなど無数に存在.カーネルとシェルは分離している．
1. sh, bash, schはログインしたときに適用されるタイプ．
1. CUI（bashとか）とGUI（エクスプローラー）がある
1. Bシェル系（sh,bash,...）とCシェル系（csh, tcsh）がある
1. `echo $SHELL` -> tcshを使っていた
1. `cat /etc/shells` -> 8つでてきた（screenやtmuxもあった）
1. 'cat /etc/profile' -> 起動時に読み込まれるファイル
'''},
  { 'id':36, 'note_object':34, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# 環境変数について
ref
1. [シェル変数と環境変数の違いをコマンドラインで確認する - Qiita](https://qiita.com/kure/items/f76d8242b97280a247a1)

1. シェル変数：実行中のシェルだけで有効
1. 環境変数：子プロセスでも有効


'''},
  { 'id':37, 'note_object':None, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# auto download datasets
リモートサーバーからデータセットをwgetすると，`403 Forbidden`が出る．(`wget  <URL> -d`で確認すると，`You don't have permission to access <URL>といわれていた)．
いつもはsshでデータを送っていたが，今回は600GBを超えていて(ローカルはあと5GBしかない...)どうにもできないので，直接いれたい．

最近試したnvidiaのサンプルコードに[データセットを自動setupしてくれるscript](https://github.com/tseijp/few-shot-vid2vid/blob/master/scripts/download_gdrive.py) があって感動した.
なので，Pythonで何とかしようとしたが，メモリがあふれていたのとデータが大きすぎて途中で止めていたことに気づかず結構はまってしまった．

requests.Sesssionの.iter_contentでメモリを分けてダウンロードし，tqdmでプログレスバーを表示させるとうまくいった．

ref

1.  [Requestsとtqdmでダウンロードの進捗を表示する - Narito Blog](https://narito.ninja/blog/detail/66/)
1. [Pythonのrequestsを利用してファイルダウンロードする方法 - Qiita](https://qiita.com/5zm/items/366f10fcde5d3435b417)
'''},
  { 'id':38, 'note_object':37, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''次のような関数を定義しておく．
<pre><code>import requests, zipfile, os, sys, subprocess
from tqdm import tqdm
def download_file(url, dir='./'):
    session  = requests.Session()
    response = session.get(url, stream=True)
    destination = os.path.join(dir, os.path.basename(url) )
    content_size = int(response.headers["content-length"])
    try:
        print('download %s'%destination)
        CHUNK_SIZE = 32768
        pbar = tqdm(total=content_size, unit="B", unit_scale=True)
        with open(destination, "wb") as f:
            for chunk in [c for c in response.iter_content(CHUNK_SIZE) if c]:
                pbar.update(len(chunk))
                f.write(chunk)
        pbar.close()
    except:
        import traceback
        traceback.print_exc()</code></pre>
'''},
  { 'id':39, 'note_object':37, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''unzipする．[torchnlp](https://pytorchnlp.readthedocs.io/en/latest/_modules/torchnlp/download.html)のコードを変えて利用する.
<pre><code>def unzip_file(url, dir='./'):
    destination  = os.path.join(dir, os.path.basename(url) )
    extension    = extension = os.path.basename(url).split('.', 1)[1]
    if 'zip' in extension:
        with zipfile.ZipFile(destination, "r") as f:
            f.extractall(dir)
    elif 'tar.gz' in extension or 'tgz' in extension:
        subprocess.call(['tar', '-C', dir, '-zxvf', destination])
    elif 'tar' in extension:
        subprocess.call(['tar', '-C', dir, '-xvf', destination])
    os.remove(destination)</code></pre>

メインをかいておしまい．今回はrgb_urlにダウンロードできるurlの一覧があったので，リストで取得して各ダウンロードする．
<pre><code>def main():
    rgb_url = "URL"
    chpt_path = "./datasets"
    rgb_dir = os.path.join(chpt_path, "train_images")
    dirs = [chpt_path, rgb_dir]
    \_=[os.makedirs(dir) for dir in dirs if not os.path.isdir(dir)]
    for url in [u for u in requests.get(rgb_url).text.split("\n") if u][:1]:  #Debug mode
        download_file(url, rgb_dir)
        unzip_file(url, rgb_dir)
if \_\_name\_\_=="\_\_main\_\_":
    main()
</code></pre>
'''},
  { 'id':40, 'note_object':37, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''### 追記：dataloader
本来のnvidiaのコードとは異なるディレクトリ構成なので，dataloaderの構成を変えようと思ったら，そもそも画像データが入ったpathかで判別していた．

<pre><code>IMG_EXTENSIONS = [
    '.jpg', '.JPG', '.jpeg', '.JPEG',
    '.png', '.PNG', '.ppm', '.PPM', '.bmp', '.BMP', '.tiff', '.webp',
    '.txt', '.json',]
def is_image_file(filename):
    return any(filename.endswith(extension) for extension in IMG_EXTENSIONS)
def make_grouped_dataset(dir):
    for fname in sorted(sorted(os.walk(dir))):
        paths = []; root = fname[0]
        for f in sorted(fname[2]):
            if is_image_file(f):
                paths.append(os.path.join(root, f))
        if len(paths) > 0:
            images.append(paths)
    return images</code></pre>

一行にすると`[p for p in [[os.path.join(fn[0],f) for f in sorted(fn[2])if is_image_file(f)] for fn in sorted(os.walk(dir))]if len(p)>0]`
'''},
  { 'id':41, 'note_object':37, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''importlibによって, dataset_nameからimportするclassを選択できる．
<pre><code>dataset_filename = "data." + dataset_name + "_dataset"
datasetlib = importlib.import_module(dataset_filename)</code></pre>
importしたlibの中から，BaseDatasetを継承したカスタムデータセットのclassを見つける
<pre><code>dataset=None
for name, cls in datasetlib.__dict__.items():
    if name.lower() == target_dataset_name.lower() \\
       and issubclass(cls, BaseDataset):
        dataset = cls</code></pre>
'''},
  { 'id':42, 'note_object':None, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# Python memo
他人のコードで見かけた不思議な書き方を少しずつメモしていく

- `new_w = new_w // 4 * 4`：4で割り切れる数にできる．`//`は切り捨て除算の演算子．
- `is_img = input_type=='img'`：論理値を一行で代入.
- `a, b = b, a`：参照先を入れ替える`a,b = copy.copy(b), copy.copy(a)`も
'''},
  { 'id':43, 'note_object':42, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''### opの関数一覧を取得
`obj = op('/project1/...')`でopを取得したあと，dir(obj)でメンバー一覧が見れるが，`inspect.getmembers(obj, inspect.ismethod)`でメソッド一覧が取得できない．obj.errorかobj.warningが呼ばれると強制停止するらしい．

- `[s for s in dir(obj) if not s in ['error','warning'] and callable(eval('obj.%s'%s))]` : 呼び出し可能のリスト
'''},
  { 'id':44, 'note_object':None, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# htmlとviews.pyだけでDjango
Djangoばかり触っていたので，組み込みタグなしではwebページが作れないけど，Djangoは設定とか面倒なので，簡単にする方法を考えました．
glsl1,2,3,4...と量産するアプリを例にコードをかきます．

まず，threejsというprojectを作ります

* `django-admin startproject threejs`
* `cd threejs`
* `python manage.py startapp glsl1` : glsl2,3,4も同様に...
* `INSTALLED_APPS+=['glsl%s'%s for s in [1,2,3,4]]` をthreejs/settings.py 最後に追加
'''},
  { 'id':45, 'note_object':44, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''次に，下の様にディレクトリを作る(各appはviews.py以外消してok)
<pre><code>C:.
├─glsl1
│  └─views.py
├─glsl2
│  └─views.py
│(...同様に3,4と作る)
├─templates
│  ├─glsl1
│  └─glsl2
│    (...同様に3,4と作る)
└─threejs
   ├─settings.py
   └─urls.py</code></pre>
threejs/urls.pyの最後に追加する
<pre><code>for i, app in enumerate(['glsl%s'%s for s in [1,2,3,4]]):
    views_name = app + ".views"
    views_lib  = importlib.import_module(views_name)
    for name, cls in views_lib.__dict__.items():
        if name.lower() == "fromdirview":
            url = "%s/%s"%( i, cls.url() )
            urlpatterns += [path(url, cls.as_view()]
</code></pre>
'''},
  { 'id':46, 'note_object':44, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''各appのviews.pyに次のViewを追加する
<pre><code>class FromDirView(TemplateView):
    def __init__(self):
        self.name = osp.basename(osp.dirname(osp.abspath(__file__)))
        self.path = osp.join(settings.TEMPLATES[0]['DIRS'][0], self.name)
        self.pages = self.make_grouped_pages()
        self.page  = osp.join(self.path, 'test.html')
    def url():
        return ''
    def get(self, request, *args, **kwargs):
        page = request.GET['p'] if 'p' in request.GET else ''
        self.template_name = self.pages[page] if page in self.pages else self.page
        return super().get(request, *args, **kwargs)
    def get_context_data(self):
        context = super().get_context_data()
        context['pages'] = self.pages.keys()
        return context
    def make_grouped_pages(self):
        paths = {}
        for fname in sorted(os.walk(self.path)):
            page = osp.basename(fname[0])
            if any([ f==page+'.html' for f in fname[2] ]):
                paths[page] = osp.join(fname[0], page+'.html')
        return paths</code></pre>
'''},
  { 'id':47, 'note_object':44, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''各appのviews.pyに次のViewを追加する
<pre><code>class FromDirView(TemplateView):
    def __init__(self):
        self.name = osp.basename(osp.dirname(osp.abspath(__file__)))
        self.path = osp.join(settings.TEMPLATES[0]['DIRS'][0], self.name)
        self.pages = self.make_grouped_pages()
        self.page  = osp.join(self.path, 'test.html')
    def url():
        return ''
    def get(self, request, *args, **kwargs):
        page = request.GET['p'] if 'p' in request.GET else ''
        self.template_name = self.pages[page] if page in self.pages else self.page
        return super().get(request, *args, **kwargs)
    def get_context_data(self):
        context = super().get_context_data()
        context['pages'] = self.pages.keys()
        return context
    def make_grouped_pages(self):
        paths = {}
        for fname in sorted(os.walk(self.path)):
            page = osp.basename(fname[0])
            if any([ f==page+'.html' for f in fname[2] ]):
                paths[page] = osp.join(fname[0], page+'.html')
        return paths</code></pre>
'''},
  { 'id':48, 'note_object':44, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''FromDirViewで用いたmake_grouped_pagesは, urlの?p=で指定した名前と同じディレクトリがtemplatesディレクトリ内にあり，かつその内に同じ名前+.htmlファイルがある場合，そのhtmlファイルをtemplateに指定する.
ospは`import os.path as osp`で略して利用している．
settings.pyの変数は`from django.conf import settings`で取得できる
一行にすると`{osp.basename(fname[0]):osp.join(fname[0], osp.basename(fname[0])+'.html')
                for fname in sorted(os.walk(self.template_path))
                if any([ f==osp.basename(fname[0])+'.html' for f in fname[2] ])}`


glsl1/test.htmlは次の様に追加しておく
<pre><code>{% for p in pages%}
  \<a href="?p={{p}}">{{p}} \</a>
{% endfor %}</code></pre>
'''},
  { 'id':49, 'note_object':None, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# 開眼！JS
JSメモ
ref

* [# Python VS ES6 syntax comparison](https://gist.github.com/revolunet/537a3448cff850231a74)
* [開眼! JavaScript - 言語使用から学ぶJavaScriptの本質](https://www.amazon.co.jp/%E9%96%8B%E7%9C%BC-JavaScript-%E2%80%95%E8%A8%80%E8%AA%9E%E4%BB%95%E6%A7%98%E3%81%8B%E3%82%89%E5%AD%A6%E3%81%B6JavaScript%E3%81%AE%E6%9C%AC%E8%B3%AA-Cody-Lindley/dp/487311621X)

JSの優れた演算子の使いかたと足りない関数の代用のメモです．内包表記好きなので，Pythonと比べました．
以下では次の変数a,b,c,dを共通して用います．

* List`a = [1,2,3]`
* List`b = [4,5,6]`
* Int`c = 4`
* Dict`d = {'a':a,'b':b}`

左がPython <=> 右がJSでの比較 e.g. spread operator

* `a + b + [c]` <=> `[...a, ...b, c]`
* `{**d, 'c':c, **dict(d=0)}` <=> `{...d, c, ...{d:0}}`
* (shallow copyなので注意)
'''},
  { 'id':50, 'note_object':49, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# basic Python vs JS

* `value=50//c*c` <=> `value=~~(50/c)*c` //48 (c=4)
* `value, _, _ = a` <=> `var [value, _, _] = a`
* `value = True if c>0 else c` <=> `value = c>0 || c`
* `value = c if c>0 else False` <=> `value = c>0 && c`
* `func = lambda v: v*2` <=>`func = v => v*2`
* `bool = b[0]==c` <=> `bool=b[0]===c` : 値の一致
* `bool = a==b` => `bool=!a.map((v,i)=>v===b[i] ).includes(false)` : 配列の一致(jsでは配列は===できない)

array Python vs JS

* `[0]*c` <=> `Array(c).fill(0)` // [0, 0, 0, 0]
* `max(a)` <=> `a.reduce((a,b)=>a>b?a:b)` //a < b?でmin
* `map(lambda: v**2, a)` <=> `a.map(v=>v**2)`
* `[v for v in zip(a,b)]` <=> `a.map((v,i)=>[v,b[i]])`
* `[i for i in range(c)]` <=> `[...Array(c)].map((_,i)=>i)` //[0,1,2,3,4]
* `[[k,v] for k,v in d.items()]` <=> `Object.keys(d).map((v,i)=>[v,Object.values(d)[i]])`
'''},
  { 'id':51, 'note_object':49, 'posted_user':'tseijp', 'posted_time':'',
    'posted_body':'''# class-based vs functional
class X extends React.Component{...} <=> const X=(props)=>{...}

* access to state? : Yes <=> Yes
* lifecycle hooks ? : Yes <=> No
* acess state via ?: `this.state` <=> `useState`
* acess props via ?: `this.props` <=> `props`
* when use which?: use lifecycle or state<=> other

more

* init delays via?  : `componentDidMount` <=> `useEffect(()=>{...}, [])`
* run delays via?  : `componentDidUpdate` <=> `useEffect(()=>{...},[...])`
* clean up via?     : `commponentWillUnmount` <=> `useEffect(()=>{return()=>{...}}, [])`
* optimize via?     : `shouldCommponentUpdate` <=> `memo`
'''},
]
