notes = [
# """"""""""""""""""""""""" TouchDesigner """"""""""""""""""""""""" #
"""# TouchDesignerで動画生成
先日, 大学のオープンキャンパスでGANによる動画生成のデモ発表をしました．

TouchDesigner使えばリアルタイムで実装できるかな...と思って使ってみました．
他の方のコードをかなり使ってますが，もしよければ試してみてください．

以降では二つのことを共有出来たらなーと思います．最後にデモについて少し書きます！

  1. TouchDesignerでPythonの重い処理の実行.
  1. Pythonライブラリ（PyTorch等）を入れる.

TouchDesignerを初めて数か月なのに, 何故かqiitaの記事に登録してました．qiitaも初めてです．あまり実用性ありそうなこと書けませんでした(;_;)
""",

"""## 重い処理の実行について
TouchDesignerは  Pythonが中の処理にも使われており，他で重い処理をするとフリーズします．
なので，サブプロセスとして処理をいくつかに分けます

前のプロセスの終了を`chop_exec`で取得し，`td_utils.py`で実行するコマンドを渡します．
処理が終わったらsocket通信で`udpin`に送り，`datexec2`で通知を次の処理に送ります．

* [ref]
* [td_utils.pyコードサンプル](https://gist.github.com/tseijp/caab3149c3c9fcbe1e45c466c1f41a53)
* [参考:TouchDesigner | Python and the Subprocess Module | Matthew Ragan](https://matthewragan.com/2019/08/14/touchdesigner-python-and-the-subprocess-module/)
```javascript
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
""",

"""
poseの動画から全身の動画をするベースCOMPです. 前処理が終わったら生成を開始します．
生成が終わったら次の処理に通知させます．

![demo](https://res.cloudinary.com/dpimrj9cp/image/upload/v1575855138/pose2vid.jpg)
""",

"""
# TouchDeisngerでのPythonライブラリについて
`venv`で`pip install` -> TouchDesinger内でPathを通す or `sys.path.append()`

  1. TouchDesingerでは内部にNumpyを含んでおり，しかも結構内部で依存してそうでした．
  1. PyTorchを入れたとき，一緒にNumpyが入ってきて使えなくなり，環境構築しなおしました．


condaで仮想環境 -> TouchDesignerの`site-packages`消す -> `mlink /d site-packages {{path-to-venv}}/site-packages`

  1. この方法が唯一PyTorchが動いたのですが，デモ当日にGPU周りで謎のエラーが出ました．
  (`libiomp5md.dll、libiomp5mmd.pdb libiompstubs5md.dll` を上書きしたら動きました)
  1. 結局最初からプロセスを分ければよかったなと反省してます．結論はまだ出てないですが，自分なりの考えをまとめました．
""",

"""
左上が生成結果です．ボーン検出がうまくできてないので，うまく動画が生成できなかったです．（RealSenseとかを使ったほうが早いし安定してよかったかも）
![demo](https://res.cloudinary.com/dpimrj9cp/image/upload/v1575855510/output2.gif)
""",

0,# """"""""""""""""""""""""" AWS """"""""""""""""""""""""" #
"""# Django in AWS and Nginx

1. [ref]
1.  [【20分でデプロイ】AWS EC2にDjango+PostgreSQL+Nginx環境を構築してササッと公開 - Qiita](https://qiita.com/tachibanayu24/items/b8d73cdfd4cbd42c5b1d)
1. [Djangoの既存プロジェクトをec2にデプロイ - Qiita](https://qiita.com/kur/items/fb75354ee53671c79614)
1. [【AWSでサイト制作5】独自ドメイン設定 - Qiita](https://qiita.com/HitomiHoshisaki/items/7d7345eb67390f16fed4)
1. [AWS Route 53を使って独自ドメインのWebページを表示させてみよう | Avintonジャパン株式会社](https://avinton.com/academy/route53-dns-vhost/)
1. [お名前.comで取ったドメインをAWSの「Route 53」で利用する | melon.Lab](https://mel.onl/onamae-domain-aws-route-53/#toc2)
1. [EC2上のDjangoアプリを独自ドメイン、SSL対応する - Qiita](https://qiita.com/moto2g/items/e6454a51d61570948171)

今年の春にDjangoを勉強して，gunicornとHerokuでデプロイしたサービスを半年放置していたらサーバーエラーで動かなくなっていました．．．

[Advent Calendar](https://qiita.com/advent-calendar/2019/touchdesigner)に参加したくて，でも初投稿は自分のサイトでしてみたかったので，結局別のサーバーでデプロイし直しました．（あと，夏の増税前に駆け込みで買ったドメインも供養しないとなと思ってました．）

AWSがKyashというバーチャルVisaカードを使えたので使ってみました．下のサイト通りにしたらうまくいきました（特に最初のサイト凄い！20分！）．AWSで初めてデプロイしたので，作業中のメモをまとめました．
""",

"""## AWS EC2
最初間違えてUbuntuを選んでなくて気づくのに時間かかりました．．．(;__;)

1. サービス(左上) -> EC2 -> インスタンス(左側)->インスタンスの管理画面へ
1. [インスタンスの作成] を押下 -> `AMI(Amazon Machine Image)`にUbuntu選択 -> 新規にキーを作成する -> `aws_ubuntu.pem` をダウンロード
1. インスタンスの状態がrunningかを確認
1. `chmod 400 aws-ubuntu.pem`:パーミッションを変更->自分の`~/.ssh`ディレクトリとかに保管
1. `ssh -i "~/.ssh/aws_ubuntu.pem" ubuntu@<ip address>`:ユーザー名はubuntu以外だとec2-userとか
""",

"""## Ubuntu env
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
""",

"""## PostgreSQL
Herokuとかとだいたい同じです．

1. `sudo -u postgres psql`
1. `CREATE DATABASE <DB_NAME>;`
1. `CREATE USER <DB_USERNAME> WITH PASSWORD '<DB_PASSWORD>';`
1. `ALTER ROLE <DB_USERNAME> SET client_encoding TO 'utf8';`
1. `ALTER ROLE <DB_USERNAME> SET default_transaction_isolation TO 'read committed';`
1. `ALTER ROLE <DB_USERNAME> SET timezone TO 'UTC+9';`
1. `GRANT ALL PRIVILEGES ON DATABASE <DB_NAME> TO <DB_USERNAME>;`


```python
...
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
}}
```
""",

"""## AWS
1. 左カラムから、セキュリティグループ -> セキュリティグループを作成
1. 作成したものを右クリック -> ルールの作成 ->
    1. `カスタムTCP▽`,
    1. `TCP`,
    1. `8000`
    1. `0,0,0,0/0`
1. インスタンス -> 右クリック -> ネットワーキング -> セキュリティグループの変更->作成したものを選択

1. `python3 manage.py runserver 0.0.0.0:8000`
1. `http://<your_ip>:8000`で確認->`deactivate`:venvぬける
""",

"""## gunicorn
gunicornの設定をします．自分はアクセスログとエラーログをホームディレクトリに保存してます．gunicornの場所を間違えてはまったので気を付けてください．（venv使ったかで変わります）

1. `sudo vi /etc/systemd/system/gunicorn.service`
1. `sudo systemctl start gunicorn.service`
1. `sudo systemctl enable gunicorn`

```bash
[Unit]
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
```
""",

"""## nginx
nginxの設定をします．一度したらあんまり触れないです．viを使います🔥

1. `sudo vi /etc/nginx/sites-available/<PJ_NAME>`
1. `sudo ln -s /etc/nginx/sites-available/<PJ_NAME> /etc/nginx/sites-enabled/`
1. `sudo systemctl restart nginx`
1. `sudo ufw delete allow 8000`
1. `sudo ufw allow 'Nginx Full'`

```
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
}
```
""",

"""## ec2
1. セキュリティグループ -> セキュリティグループにタイプ: HTTPのルールを追加
1. （インスタンス-> ネットワーキング -> セキュリティグループの変更->セキュリティグループ選択）←先ほどしてなかったら

### Elastic IPs
1. サイドメニュー -> Elastic IPsからポチポチ
1. Elastic IP アドレスの割り当て -> 割り当て
1. Elastic IP アドレスの関連付け -> 関連付け
""",

"""## domain
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
""",

"""## SSL
HTTPSで繋がるように設定します．

1. [certbot](https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx)でUbuntuとNginx選択->コマンド上から実行
1. `sudo add-apt-repository universe`ができないので，URLから直接入れる
1. `sudo certbot --nginx`でポチポチ -> `whether or not to redirect HTTP`で2を選択
1. `sudo certbot renew --post-hook "systemctl restart nginx"`:を試す
1. `sudo vi /etc/cron.d/letsencrypt` -> `0 1 * * 1 sudo certbot renew --post-hook "systemctl restart nginx"`
1. ec2 -> セキュリティグループ -> セキュリティグループにタイプ: HTTPSのルールを追加
""",

0,# """"""""""""""""""""""""" pip """"""""""""""""""""""""" #
"""# pipenvで管理しなおす
pipでインストールしたlibを消して，再びinstallしようと思う.
PyTorchのバージョンを新しくしようとしたら，solサーバーのメモリが30GBを超えてて，datasetsやcheckpointsを消してからもう一度調べてみても22GBも使っていた．

通常なら`pip freeze > instaled.txt`->`pip uninstall -r installed.txt`で
使っていないlibやバージョンを消せるらしいが，普段--userオプションでインストールしており，一気に削除しようとするとPermission Errorで処理が止まってしまうので，Pythonでなんとかしようと思った．
""",

"""
```bash
[***@sol ~]$ du -h -d 3 | sort -hr | head -25
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
206M    ./IED_HOME/.local/share
```
""",

"""
pythonからpipを実行するために，次のような関数を定義しておく．

```python
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
    return ''.join(buf)
```
""",

"""
次に，現在のlibraryを取得し，配列を返す関数を用意する．

```python
def get_libs():
    run('python3 -m pip freeze > libs.txt')
    with open("libs.txt", 'r') as f:
        return [l.rstrip('
') for l in f.readlines()]

```

それでこう
```python
if __name__=='__main__':
    pri_libs = get_libs()
    # delete libs
    cmd = ["python3 -m pip uninstall %s -y"%l.split('==')[0] for l in installed_lib]
    _=[print(run(c)) for c in cmd]
    del_libs = [l for l in get_libs() if not l in pri_libs]
    # result
    libs_len = tuple(len(l) for l in [pri_libs, get_libs(), del_libs])
    print("
pri:%s	now:%s	del:%s"%libs_len)
    _=[print("	del:",l) for l in del_libs ]

```
""",

"""
結果を確認すると，ちょっとへったかも
`pri:250,now:209`
```bash
22->20G     .
12->7.4G    ./.ced_ubuntu
1.9G->0?    ./.ced_ubuntu/.local
1.8G->0?    ./.ced_ubuntu/.local/lib

```

`conda clean --all`したらちょっと減った
```bash
20->18G     .
7.4->4.8G    ./.ced_ubuntu
1.9G->177M    ./.ced_ubuntu/.local
1.8G->?M    ./.ced_ubuntu/.local/lib

```

iedでもcedと同様にためした．
`pri:249 now:239 del:3`
```bash

18->16G     .
12->11G     ./IED_HOME
2.9G->0?M    ./.ced_ubuntu/.cache/pip
2.9->1.5G    ./IED_HOME/.local
2.7G->0?M    ./IED_HOME/.local/lib
2.7->1.3G    ./IED_HOME/.local/lib


```
""",

"""
`.cache`削除したらすごいことになった（消していいのかよくわかってないです）
```bash
8.5G    .
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

```
""",

"""
# pipenvで環境構築
sudoでない環境でvirtualenvだと 構文エラーかきょかがないといわれるので使えなかった．

1. `python3 -m pip install pipenv`
1. `python3 -m pipenv install --python 3.6`
1. `python3 -m pipenv shell`
1. `python --version` -> 3.6.9になっているはず
1. `pip install torch==1.2.0 torchvision==0.4.0`
1. `pip install numpy==1.17` 1.18だとエラー
1. `pip install pillow==6.2.2` : 7.0だとエラー
1. `pip install opencv-python scipy pytz`
""",

0,# """"""""""""""""""""""""" gan """"""""""""""""""""""""" #
"""# few-shot-vid2vid
自分用のメモです．英弱なので，ざっくり読んで，重要そうな部分をひたすらgoogle先生に聞いて読んでます．
GAN全く詳しくないので間違ってる箇所多いと思います．無断転載なので1割理解出来たら消します🔥

* [ref]()
* [arXiv](https://arxiv.org/abs/1910.12713)
* [youtube](https://youtu.be/8AZBuyEuDqc)
* [github](https://github.com/NVlabs/few-shot-vid2vid)
""",

"""# Introdunction
1. vid2vid: 人間のポーズやマスクのセマンティックを入力ビデオとし，フォトリアルなビデオに変換するタスク．大きな制限がある．
  1.  生成したい人やシーンの多数の画像がトレーニングに必要
  1. トレーニングした人の動画のみ合成できる
1.  `Typically, to obtain such a model, one begins with collecting a training dataset for the target task.` !?!?

1. 新たな入力セマンティックビデオへの一般化は不十分である!?
  1. データセットに含まれていない被験者の動画を生成するなど目に見えないドメインに一般化できるモデルを目指すべき
  1. vid2vidモデルが少数の画像だけで一般化できない場合，多くの画像を収集する必要がある
1. attention(注目の？)メカニズムを使った新しいNetwork weight生成モジュールを介して、一般化を実現.
1. vid2vidがtrainデータと同じビデオのみ合成できるのに対し，このモデルでは,ビデオ合成メカニズムを動的に構成.
1. サンプル画像を使用してネットワークの重みを生成するモジュールをトレーニング.
1. 生成モジュールの学習を促進するため,the learning objective function(学習目的関数？)を慎重に設計する。
""",

"""## Related work
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
""",

"""## Adaptive networks
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

vid2vid model can convert a sequence of input semantic images $s^T_1 : s_1,s_2,...s_T$ to a sequence of output images $x^T_1=x_1,x_2,...x_T$
sequential generative model given by

$$x_t = F(x^{t-1}_{t-r}, s^t_{t-r}) = (1-m_t) \kentengCircle w_{t-1}(x_{t-1})+m_t \kentengCircle h_t$$

- $m_t = M_{	heta_M}(x^{t-1}_{t-r},s^t_{t-r})$ is  a soft occlution map
- $w_{t-1} = W_	heta_W(x^{t-1}_{t-r},s^t_{t-r})$ is the optical flow warped version of the last generated images
- $h_t=H_	heta_H(x^{t-1}_{t-r},s^t_{t-r})$ is the synthesized intermediate image
""",

"""
# few shot vid2vid synthesis
fewshot vid2vid model convert novel input semantic videos,  K-shot example image and semantic image ${e_1,e_2,...e_K},{S_{e_1},S_{e_2},...S_{e_K}}$.

$$x_t = F(x^{t-1}_{t-	au}, s^t_{t-	au},{e_1,e_2,...e_K}, {S_{e_1}, S_{e_2},...S_{e_K})$$

we propose a network weight $	heta$ generation module $E$ for the image synthesis network $H$.

$$	heta_H = E(x_{t-1}^{t-	au}, s^t_{t-	au},{e_1,e_2,...e_K},{s_{e_1},s_{e_2}})$$

few-shot vid2vid framework based on Wang et al. [57],], which is the state-of-the-art. for the vid2vid task .we adopt the SPADE generator [41]
""",

0,# """"""""""""""""""""""""" 500 """"""""""""""""""""""""" #
"""# How to hack Django Server Error 500
Error文をSlackで送れたら簡単にServer Error 500を簡単に直せたので覚え書き．Errorが出るたびに悲しくなるので，ついでにエラー画面に猫のGIFを表示させた．

* [ref]()
* [Django Server Error (500)攻略法【2019 アドカレ】 - Qiita](https://qiita.com/yuu-eguci/items/a1e4b0a2f238d5ccc985)
* [Pythonを使ってSlackに送信する方法 - Qiita](https://qiita.com/yoshitaku_jp/items/8a53272a0118e7604994)
""",

"""## Step1
1. SlackでLogin後，[Incoming](https://slack.com/services/new/incoming-webhook)にアクセス -> チャンネルを選び，Webhook URLを控え，ポチポチ進む
1. 適当なviews.pyに以下のように書く

```python
your_app/views.py
from django.http import HttpResponseServerError
from django.views.decorators.csrf import requires_csrf_token
webhook_url = '控えたSlack Webhook URL をコピペ'
cat_iframes = [
  '(https://giphy.com/)で検索して，埋め込み分をコピペ',
]

@requires_csrf_token
def my_server_error(request, template_name='500.html'):
    import json
    import random
    import requests
    import traceback
    requests.post(
        webhook_url,
        data=json.dumps({
            'text': '
'.join([
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
```
""",

"""
# Step2
Djangoのhandler500にカスタムしたものを上書きする．

```python
your_prj_name/urls.py
from your_app_name.views import my_server_error
from django.conf.urls import handler500
handler500 = my_server_error
```
""",

0,# """"""""""""""""""""""""" linux """"""""""""""""""""""""" #
"""# Linux コマンドメモ
`export: Command not found.`がでてきて，また何か悪いことをしたのかと思って焦った．そもそもshellに種類があるらしい．

1. setenv：csh系
1. export：sh系

tcshコマンドチートシート

1. `set var1 = ham` -> シェル変数
1. `setenv var2 egg` -> 環境変数
1. `alias python python3` -> pythonで2系が出ないようにする
""",

"""## Shellについて
- [ref]()
- [初心者が調べた。shellとは](https://qiita.com/ycoda/items/87d23b818cb06ba1c348)
- [シェル入門](http://webcache.googleusercontent.com/search?q=cache:RYdotdNX1RUJ:www-kn.sp.u-tokai.ac.jp/com/computer/shell/shell.html+&cd=7&hl=ja&ct=clnk&gl=jp)

知らなかった．．．

1. shell: UNIX系OSで操作するスクリプトの一種．bashやtcsh, ksh,zsh,fishなど無数に存在.カーネルとシェルは分離している．
1. sh, bash, schはログインしたときに適用されるタイプ．
1. CUI（bashとか）とGUI（エクスプローラー）がある
1. Bシェル系（sh,bash,...）とCシェル系（csh, tcsh）がある
1. `echo $SHELL` -> tcshを使っていた
1. `cat /etc/shells` -> 8つでてきた（screenやtmuxもあった）
1. 'cat /etc/profile' -> 起動時に読み込まれるファイル
""",

"""## 環境変数について
ref
1. [シェル変数と環境変数の違いをコマンドラインで確認する - Qiita](https://qiita.com/kure/items/f76d8242b97280a247a1)

1. シェル変数：実行中のシェルだけで有効
1. 環境変数：子プロセスでも有効
""",

0,# """"""""""""""""""""""""" datasets """"""""""""""""""""""""" #
"""# auto download datasets
リモートサーバーからデータセットをwgetすると，`403 Forbidden`が出る．(`wget  <URL> -d`で確認すると，`You don't have permission to access <URL>といわれていた)．
いつもはsshでデータを送っていたが，今回は600GBを超えていて(ローカルはあと5GBしかない...)どうにもできないので，直接いれたい．

最近試したnvidiaのサンプルコードに[データセットを自動setupしてくれるscript](https://github.com/tseijp/few-shot-vid2vid/blob/master/scripts/download_gdrive.py) があって感動した.
なので，Pythonで何とかしようとしたが，メモリがあふれていたのとデータが大きすぎて途中で止めていたことに気づかず結構はまってしまった．

requests.Sesssionの.iter_contentでメモリを分けてダウンロードし，tqdmでプログレスバーを表示させるとうまくいった．

- [ref]()
-  [Requestsとtqdmでダウンロードの進捗を表示する - Narito Blog](https://narito.ninja/blog/detail/66/)
- [Pythonのrequestsを利用してファイルダウンロードする方法 - Qiita](https://qiita.com/5zm/items/366f10fcde5d3435b417)
""",

"""次のような関数を定義しておく．
```python
import requests, zipfile, os, sys, subprocess
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
        traceback.print_exc()
```
""",

"""
unzipする．[torchnlp](https://pytorchnlp.readthedocs.io/en/latest/_modules/torchnlp/download.html)のコードを変えて利用する.
```python
def unzip_file(url, dir='./'):
    destination  = os.path.join(dir, os.path.basename(url) )
    extension    = extension = os.path.basename(url).split('.', 1)[1]
    if 'zip' in extension:
        with zipfile.ZipFile(destination, "r") as f:
            f.extractall(dir)
    elif 'tar.gz' in extension or 'tgz' in extension:
        subprocess.call(['tar', '-C', dir, '-zxvf', destination])
    elif 'tar' in extension:
        subprocess.call(['tar', '-C', dir, '-xvf', destination])
    os.remove(destination)
```

メインをかいておしまい．今回はrgb_urlにダウンロードできるurlの一覧があったので，リストで取得して各ダウンロードする．
```python
def main():
    rgb_url = "URL"
    chpt_path = "./datasets"
    rgb_dir = os.path.join(chpt_path, "train_images")
    dirs = [chpt_path, rgb_dir]
    \_=[os.makedirs(dir) for dir in dirs if not os.path.isdir(dir)]
    for url in [u for u in requests.get(rgb_url).text.split("
") if u][:1]:  #Debug mode
        download_file(url, rgb_dir)
        unzip_file(url, rgb_dir)
if \_\_name\_\_=="\_\_main\_\_":
    main()

```
""",

"""## 追記：dataloader
本来のnvidiaのコードとは異なるディレクトリ構成なので，dataloaderの構成を変えようと思ったら，そもそも画像データが入ったpathかで判別していた．

```python
IMG_EXTENSIONS = [
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
    return images
```

一行にすると`[p for p in [[os.path.join(fn[0],f) for f in sorted(fn[2])if is_image_file(f)] for fn in sorted(os.walk(dir))]if len(p)>0]`
""",

"""
importlibによって, dataset_nameからimportするclassを選択できる．
```python
dataset_filename = "data." + dataset_name + "_dataset"
datasetlib = importlib.import_module(dataset_filename)
```
importしたlibの中から，BaseDatasetを継承したカスタムデータセットのclassを見つける
```python
dataset=None
for name, cls in datasetlib.__dict__.items():
    if name.lower() == target_dataset_name.lower() \
       and issubclass(cls, BaseDataset):
        dataset = cls
```
""",

0,# """"""""""""""""""""""""" python """"""""""""""""""""""""" #

"""# Python memo
他人のコードで見かけた不思議な書き方を少しずつメモしていく

- `new_w = new_w // 4 * 4`：4で割り切れる数にできる．`//`は切り捨て除算の演算子．
- `is_img = input_type=='img'`：論理値を一行で代入.
- `a, b = b, a`：参照先を入れ替える`a,b = copy.copy(b), copy.copy(a)`も
""",

"""## opの関数一覧を取得
`obj = op('/project1/...')`でopを取得したあと，dir(obj)でメンバー一覧が見れるが，`inspect.getmembers(obj, inspect.ismethod)`でメソッド一覧が取得できない．obj.errorかobj.warningが呼ばれると強制停止するらしい．

- `[s for s in dir(obj) if not s in ['error','warning'] and callable(eval('obj.%s'%s))]` : 呼び出し可能のリスト
""",

0,# """"""""""""""""""""""""" django """"""""""""""""""""""""" #
"""# htmlとviews.pyだけでDjango
Djangoばかり触っていたので，組み込みタグなしではwebページが作れないけど，Djangoは設定とか面倒なので，簡単にする方法を考えました．
glsl1,2,3,4...と量産するアプリを例にコードをかきます．

まず，threejsというprojectを作ります

* `django-admin startproject threejs`
* `cd threejs`
* `python manage.py startapp glsl1` : glsl2,3,4も同様に...
* `INSTALLED_APPS+=['glsl%s'%s for s in [1,2,3,4]]` をthreejs/settings.py 最後に追加
""",

"""
次に，下の様にディレクトリを作る(各appはviews.py以外消してok)
```bash
C:.
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
   └─urls.py
```
threejs/urls.pyの最後に追加する
```python
for i, app in enumerate(['glsl%s'%s for s in [1,2,3,4]]):
    views_name = app + ".views"
    views_lib  = importlib.import_module(views_name)
    for name, cls in views_lib.__dict__.items():
        if name.lower() == "fromdirview":
            url = "%s/%s"%( i, cls.url() )
            urlpatterns += [path(url, cls.as_view()]

```
""",

"""
各appのviews.pyに次のViewを追加する
```python
class FromDirView(TemplateView):
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
        return paths
```
""",

"""
FromDirViewで用いたmake_grouped_pagesは, urlの?p=で指定した名前と同じディレクトリがtemplatesディレクトリ内にあり，かつその内に同じ名前+.htmlファイルがある場合，そのhtmlファイルをtemplateに指定する.
ospは`import os.path as osp`で略して利用している．
settings.pyの変数は`from django.conf import settings`で取得できる
一行にすると`{osp.basename(fname[0]):osp.join(fname[0], osp.basename(fname[0])+'.html')
                for fname in sorted(os.walk(self.template_path))
                if any([ f==osp.basename(fname[0])+'.html' for f in fname[2] ])}`


glsl1/test.htmlは次の様に追加しておく
```python
{% for p in pages%}
  \<a href="?p={{p}}">{{p}} \</a>
{% endfor %}
```
""",

0,# """"""""""""""""""""""""" js """"""""""""""""""""""""" #

"""# 開眼！Python vs JS

* [ref]()
* [# Python VS ES6 syntax comparison](https://gist.github.com/revolunet/537a3448cff850231a74)
* [開眼! JavaScript - 言語使用から学ぶJavaScriptの本質](https://www.amazon.co.jp/%E9%96%8B%E7%9C%BC-JavaScript-%E2%80%95%E8%A8%80%E8%AA%9E%E4%BB%95%E6%A7%98%E3%81%8B%E3%82%89%E5%AD%A6%E3%81%B6JavaScript%E3%81%AE%E6%9C%AC%E8%B3%AA-Cody-Lindley/dp/487311621X)

JSの優れた演算子の使いかたと足りない関数の代用のメモです．内包表記など，自分がよくつかう（忘れる）かき方をPythonと比べました．
以下では次の変数a,b,c,dを共通して用います．

- >> List
  >
  >> `a = [1,2,3]`
- >> List
  >
  >> `b = [4,5,6]`
- >> Int
  >
  >> `c = 4`
- >> Dict
  >
  >> `d = {'a':a,'b':b}`


### e.g. spread operator

* >>Python
  >
  >> JS
* >> `a + b + [c]`
  >
  >>`[...a, ...b, c]`
* >> `{**d, 'c':c, **dict(d=0)}`
  >
  >>`{...d, c, ...{d:0}}`
* (`*`,`...`はshallow copyなので注意)
""",

"""# basic Python vs JS
* >>Python
  >
  >> JS
* >> `50//c*c`
  >
  >> `~~(50/c)*c` //48 (c=4)
* >> `True if c>0 else c`
  >
  >> `c>0 || c`
* >> `c if c>0 else False`
  >
  >> `c>0 && c`
* >> `value, _, _ = a`
  >
  >> `var [value, _, _] = a`
* >> `func = lambda v: v*2`
  >
  >> `func = v => v*2`
* >> `bool = b[0]==c`
  >
  >> `bool=b[0]===c` : 値の一致
* >> `bool = a==b`
  >
  >>  `bool=!a.map((v,i)=>v===b[i] ).includes(false)` 配列の一致(jsでは配列は===できない)
""",

"""
# array Python vs JS
* >>Python
  >
  >> JS
* >> `sum(a)`
  >
  >> `a.reduce((x,y)=>x+y)`
* >> `max(a)`
  >
  >> `a.reduce((x,y)=>x>y?x:y)` //`x<y?`でmin
* >> `map(lambda: v**2, a)`
  >
  >> `a.map(v=>v**2)`
* >> `[0]*c`
  >
  >> `Array(c).fill(0)` // `[0, 0, 0, 0]`
* >> `[i for i in range(c)]`
  >
  >> `[...Array(c)].map((_,i)=>i)` //`[0,1,2,3,4]`
* >> `[v for v in zip(a,b)]`
  >
  >> `a.map((v,i)=>[v,b[i]])`
* >> `[[k,v] for k,v in d.items()]`
  >
  >> `Object.keys(d).map((v,i)=>[v,Object.values(d)[i]])`
""",

"""
# class-based vs functional
class X extends React.Component{...}
  >
  >> const X=(props)=>{...}

* >> access to state? : Yes
  >
  >> Yes
* >> lifecycle hooks ? : Yes
  >
  >> No
* >> acess state via ?: `this.state`
  >
  >> `useState`
* >> acess props via ?: `this.props`
  >
  >> `props`
* >> when use which?: use lifecycle or state<=> other

more

* >> init delays via?  : `componentDidMount`
  >
  >> `useEffect(()=>{...}, [])`
* >> run delays via?  : `componentDidUpdate`
  >
  >> `useEffect(()=>{...},[...])`
* >> clean up via?     : `commponentWillUnmount`
  >
  >> `useEffect(()=>{return()=>{...}}, [])`
* >> optimize via?     : `shouldCommponentUpdate`
  >
  >> `useMemo` and `useCallback`
""",

0,# """"""""""""""""""""""""" glsl """"""""""""""""""""""""" #


"""# GLSL and THREE.js in React
THREE.jsはWebGLを用いて3D表現ができるライブラリで，GLSLファイルもビルドしてくれるのでとてもわくわくできます．
（[トップページ](https://tsei.jp)にglslを利用してます．）
従来のjsだと大規模なアプリになると予期しないことが多く起こるので，
viewに特化したReactのライフサイクル上で安全に構築します．(特にhookだと関数型プログラミングできる．)

### ポイント
DOMを直接操作するライブラリなどはReactでは使えないけど，
hookでは`useEffect`内に処理をかくと,
Reactのライフサイクルから隠すことができます.
classベースでは`componentDidMount`をうまく利用すればできる.）

あと,THREE.jsはmountごとに再実行すると重くなるので，
Reactのライフサイクルと関係ない変数には`useRef`を使うと再renderせずうまくいきます．
""",

"""
useEffect内に初期処理をかき，一度だけ実行されるようにしてます．
特に`WebGLRenderer`作成時にcanvasを指定させ，
sceneとcameraには`useRef`を使うことであとから変更しても初期処理が再実行されないようにします．
```javascript
import React, {useState, useRef, useEffect} from 'react'
import * as THREE from "three";

const App = (props) => {
    const scene = useRef(new THREE.Scene());
    const camera = useRef(new THREE.Camera());
    useEffect(()=>{
        const canvas   = document.getElementById('renderer');
        const renderer = new THREE.WebGLRenderer({canvas});
        const light    = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set( 1, 1, 1 );
        scene.current.add(light);
        /*~~more process~~*/
        const render = () => {
            requestAnimationFrame( render );
            renderer.render( scene.current, camera.current );
        }
        render();
    }, []);
    return <canvas id="renderer" style={{position:"fixed",top:0,left:0}}/>
}
```
""",

"""
### GLSLを利用する
glslファイルを`fetch`でloadし，変数へsetしたとき, 二つ目の`useEffect`が実行します. （mount時と,各glslファイルがloadできたときの計三回実行される.）
glslに渡す`uniforms`の値は`useRef`で後から変更しても再実行されないようにします．
""",

0,# """"""""""""""""""""""""" rollup """"""""""""""""""""""""" #

"""# webpackとrollupでビルド
- [ref]()
- [create-react-appでフォルダ名(src)を変更する具体的な手順](https://freelance-jak.com/technology/react/2409/)
- [create-react-app で作成したコードをrollupで整形する](https://qiita.com/kspotfujita/items/f3a50f613828170170ba)
- [Reactコンポーネントをnpmで公開する](https://qiita.com/Takumon/items/945335b0e0fa035f2201)

アプリにはcss等のファイルが扱える`webpack`, ライブラリには一つのファイルに縮小して変換してくれる`rollup`が使いやすいです．

特に`create-react-app`でReact環境を作成後，デモページの作成と同時にライブラリを開発するのが安定しているのでおすすめです．

今回は，`cross-env`でグローバル変数を設定し，`react-app-rewired`で`create-react-app`の中の設定を変更します.

tsやcssなど追加で用いる場合は[rollup/plugins: 🍣](https://github.com/rollup/plugins)からプラグインを選んで使います．
- `create-react-app {yourapp}` and `cd {yourapp}`
- `npm i -D cross-env react-app-rewired rollup @rollup/plugin-babel @rollup/plugin-node-resolve @rollup/plugin-commonjs fs`
""",

"""
次に`config-overrides.js`ファイルを追加します．(ウェブページを`src`から`docs`に変更する．`appSrc`を`src`から`.`にすると，`src`と`docs`の両方がつかえる．)
```javascript
const fs = require('fs');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
module.exports = {
    paths: function(paths, env) {
        paths.appSrc     = resolveApp('.');
        paths.appIndexJs = resolveApp('docs/index.js');
        // Typescript の場合
        // paths.appTypeDeclarations = resolveApp('docs/react-app-env.d.ts');
        return paths;
    }
}
```
""",

"""
次に`package.json`を修正します．（ライブラリのコンパイルには`rollup`を用い，他は`react-app-rewired`を使う．）Typescriptの場合は，`tsconfig.json`の`include:[...]`のフォルダを修正します.
```json
{
  "module": "index.js",
  "types": "index.d.ts",
  "main": "index.cjs.js",
  "private": false,
  "scripts": {
    "test":"react-app-rewired test",
    "eject":"react-app-rewired eject",
    "start":"cross-env NODE_ENV=development BABEL_ENV=development react-app-rewired start",
    "build":"cross-env NODE_ENV=production BABEL_ENV=production react-app-rewired build",
    "compile":"cross-env NODE_ENV=production BABEL_ENV=production rollup -c config-rollup.js"
  },
  ~~省略~~
}
```
""",

"""
先程，`scripts`の`compile`で指定したファイルの`config-rollup.js`を追加します.
（`json`や`glsl`をつかうなど，場合によってライブラリをインポートし，`plugins`に追加していく）
```javascript
import { promises as fs } from 'fs';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

const input = 'src/index'
const external = Object.keys({...pkg.dependencies,...pkg.devDependencies})
const extensions = ['.js', '.jsx', '.ts', '.tsx']

function babelOption (useESModules) {
    return {
        babelrc:false,
        babelHelpers:'runtime',
        exclude:'**/node_modules/**',
        extensions,
        presets : [
            ['@babel/env', {loose:true, modules:false}],
             '@babel/preset-react','@babel/preset-typescript'
        ],
        plugins : [
            [ '@babel/proposal-class-properties'         ,    {loose:true} ],
            [ '@babel/plugin-proposal-object-rest-spread',    {loose:true} ],
            [ '@babel/transform-runtime', {regenerator:false,useESModules} ],
        ],
    }
}
```
""",

"""
```javascript
function targetTypings(out) {
  return {
    writeBundle () {
      return fs.lstat(pkg.types).catch(() => {
        return fs.writeFile(pkg.types, `export * from "./${input}"`)
      })
    }
  }
}

export default [
    { input, output:{file:pkg.main   ,format:'cjs'}, external, plugins:[
        babel( babelOption(true) ),
        commonjs({extensions}),
        resolve ({extensions}),
        targetTypings(),
    ]},
    { input, output:{file:pkg.module ,format:'esm'}, external, plugins:[
        babel( babelOption(false) ),
        commonjs({extensions}),
        resolve ({extensions}),
        targetTypings(),
    ] },
]
```
""",

"""# npmで公開

- デモページができたら，`npm run build`
- ライブラリができたら，`npm run compile`
- `.npmignore`を作成し, rollupで作成したファイルとREADME.md以外を指定する.
- `npm publish`で公開
```bash
.git
.gitignore
build
docs
node_modules
public
scripts
```
""",

0,# """"""""""""""""""""""""" barcode """"""""""""""""""""""""" #

"""# Reactでバーコード認識

- [ref]
- [Quagga.js on react - CodeSandbox](https://codesandbox.io/s/quaggajs-on-react-eexx8)

React上でブックカバーのバーコードから商品の画像を取得する[ライブラリ](https://github.com/tseijp/use-amazon)を公開しました．
Webでカメラからバーコードを認識して探索結果の一覧を表示します．
[デモ](https://tsei.jp/useamazon)で用いたコードは，[Github](https://github.com/tseijp/use-amazon/blob/master/src/components/Scanner.tsx)で公開してます．
""",

"""## スキャナーのサンプルコード
開始時に実行する関数`onStarted`と認識後に実行する関数`onDetected`は，親コンポーネントから`props`として入力します．
(再Renderするといくつも開始してしまうので，これらの関数は`useRef`内で再定義させます.)
`useEffect`内の①にはQuaggaの初期化処理，②にはQuaggaがバーコードを認識した際の処理を後で入れます．
また，Canvasに認識結果を描写する関数の`drawPath()`, `drawRect()`, `clearRect()`を定義しておきます．

```javascript
import React, { useCallback, useEffect, useRef } from "react";
import config from "./config-camera.json";
const Quagga = require ('quagga');

export function Scanner ({onStarted, onDetected}) {
    const onStartedRef = useRef((bool)=>onStarted(bool))
    const onDetectedRef  = useRef((code)=>onDetected(code))
    const drawPath = useCallback((path,ctx,xy,color) => Quagga.ImageDebug.drawPath(path,xy,ctx,{color,lineWidth:2}),[])
    const drawRect = useCallback((path,ctx,isMain) => drawPath(path,ctx,{x:0,y:1},isMain?'#0F0':"#00F"),[])
    const clearRect = useCallback((dom,ctx) => ctx.clearRect(0,0,...["width","height"].map(s=>Number(dom.getAttribute(s)))),[])

    useEffect ( () => {/*...①...*/}, [] ) // 後述
    useEffect( () => {/*...②...*/}, [] )  // 後述

    return <div id="interactive" className="viewport" style={{width:"100%",height:"100%"}}/>
}
```
""",

"""## Quaggaの初期化と認識処理
カメラの起動は`Quagga.init()`を実行してから数秒間かかります．
起動したかを`onStarted()`で親コンポーネントに伝え，カメラが開始してから表示させます．
```javascript
    useEffect (() => {/*...①...*/
        Quagga.init(config, (err) => {
            if (err) return
            return (Quagga.start(), onStartedRef.current(true))
        })
        return ()=>(Quagga.stop(), onStartedRef.current(false))
    }, []);
```

`result.boxes`，`result.box`にはバーコードを検出した情報があるので，場合によって色を変えます．
```javascript
    useEffect(()=>{/*...②...*/
        Quagga.onProcessed( (result) => {
            if (!result) return
            const ctx = Quagga.canvas.ctx.overlay
            const dom = Quagga.canvas.dom.overlay
            result.boxes && clearRect(dom, ctx)
            result.boxes.forEach( box => drawRect(box,ctx,box===result.box) )
            result.codeResult && drawPath(result.line,ctx,{x:"x",y:"y"},"#F00")
        });
        Quagga.onDetected((result) => onDetectedRef.current(result.codeResult.code))
    }, [])
```
""",

"""
以上で，開始したときと認識したときに実行する`onStarted, onDetected`関数を定義すれば，
`<Scanner {{...onStarted, onDetected}}/>`のように使用できます．

また，Quaggajsはcanvasを作成するので，次の様なCSSを別で用意しておく必要があります．

```css
#interactive.viewport canvas.drawingBuffer,
#interactive.viewport canvas, video {
  width:100%; height:auto;
  position:absolute; top:0; left:0;
  border-radius:2em 2em 0px;
}
```
""",

0,# """"""""""""""""""""""""" media """"""""""""""""""""""""" #

"""# Reactでメディアクエリを使う
css in jsではメディアクエリ(`@media`)でのスタイルの場合分けができないので，
`styled`や`Radium`というライブラリを使ってましたが，
typescriptやReactの新しいバージョンへの対応が遅かったり変なエラーが多かったり不便なので，
代わりとして，自作hookの[ライブラリ](https://github.com/tseijp/use-grid)を公開しました．
[use-media](https://github.com/streamich/use-media)というリポジトリを参考にしています．
""",

"""## use-mediaについて
入力した値をメディアクエリの文字列に変換して`useRef`の中に入れます．
はじめに，メディアクエリの初期値`defaultMedia`と，css in js をcss
（例えば`minWidth`から`min-width`）に直す`queryObjectToString`関数をインポートしています．
`const isMedium = useMedia({minWidth:500})`のようにつかえば，
指定したメディアクエリを満たしているかを判定できるようになります．
```javascript
import {defaultMedia, queryObjectToString as qO2S, } from '../utils'
export function useMedia (rawQuery={}, defaultState=false) {
    const query = useRef( qO2S(rawQuery) );
    const [state, set] = useState(defaultState);
    useEffect (()=>{
        const media = typeof window===undefined
          ? defaultMedia
          : window.matchMedia(query.current)
        const onChange =()=> set(Boolean(media.matches))
        state && (onChange(), media.addListener(onChange))
        return () => media.removeListener(onChange)
    }, [])
    return state
}
```
""",

"""## use-gridについて
`const fontSize = useGrid({xs:"25px", md:"50px", xl:"75px"})`のように使うと，
値の内容を画面のサイズに合わせてtレスポンシブに変化させられます．
```javascript
import {mockMediaString, queryPropsToList as qP2L } from '../utils'
const useGrid = (props) => {
    const queries = useRef( qP2L(props) )
    const [state, set] = useState(queries.current[0][1])
    useEffect ( () => {
        const media = queries.current.map( ([query,value]) => {
            const md = typeof window==="undefined"? mockMediaString:window.matchMedia(query)
            const fn =()=> Boolean(md.matches) && set(value)
            value && (fn(), md.addListener(fn))
            return {md, fn}
        })
        return () => media.map( ({md,fn}) => md.removeListener(fn) )
    }, [] )
    return state
}
```
""",

"""## queryObjectToStringについて
css in jsのオブジェクトからcssに変換する関数`queryObjectToString`を定義します．
例えば，`{minWidth:500}`を`min-width:500`のように変換します．
```javascript
export function queryObjectToString (query) {
    if (typeof query === 'string') return query;
    const toS = ([key, val]) => {
        const feature = key.replace(/[A-Z]/g,s=>`-${s.toLowerCase()}`).toLowerCase();
        const isN = typeof val==='number' && /[height|width]$/.test(feature)
        return (typeof val==='boolean')
          ? `${val?'':'not '}${feature}`;
          : `(${feature}: ${val}${isN?'px':''})`;
    }
    return Object.entries(query).map(toS).join(' and ');
}
```
""",

"""## queryPropsToListについて
"md"(medium)のような文字列からメディアクエリの文字列に変換する関数を定義します．
例えば，`useGrid({xs:"ham",lg:"egg"})`内で実行される`qP2L([["xs","ham"],["lg","egg"]])`は，
`[["(min-width:1px)and(max-width:969px)","ham"],["(min-width:970)","egg"]]`のように変換します．
```javascript
export function queryPropsToList ( props ) {
    const SIZE = ["xs","sm","md","lg","xl"]
    const toN =(key)=> SIZE.find(s=>s===key)? {xs:1,sm:576,md:720,lg:960,xl:1140}[key] : 0
    const toS =(key,next)=>`(min-width:${ toN(key) }px)${ next?` and (max-width:${toN(next)-1}px)`:'' }`
    const getMedia = (props) => {
        const grid = SIZE.map(s=>props.find(p=>p[0]===s)||null).filter((m)=>m!==null)
        const xsGr = (grid.length)? grid.find(g=>g[0]==="xs")?[]:[["xs",grid[0][1]]]: []
        const noGr = (grid.length)? props.filter(p=>!SIZE.find(s=>s===p[0]))        : props
        return [...noGr, ...[...xsGr,...grid].map((g,i) => [
            toS(g[0],i<grid.length-1?grid[i+1][0]:null), g[1]]) ]
    }
    return getMedia( props.map( ([key,val]) => [queryObjectToString(key),val] ) )
}
```
""",

0,# """"""""""""""""""""""""" props """"""""""""""""""""""""" #
"""# 引数に代入すると便利

`useState`のような状態を扱う自作hookを作る際，引数に関数を使うことがあります．
Reactのpropsなど，引数代入することで型を特定できたり，コードが縮小できて便利です．
たとえば，[useState](https://github.com/facebook/react/blob/c21c41ecfad46de0a718d059374e48d13cf08ced/packages/react-reconciler/src/ReactFiberHooks.js)
では初期値の計算が重かったり前の値を扱痛い場合，引数に関数を指定させます．
`const [rows, setRows] = useState(() => createRows(props.count));`

このuseStateの[ソースコード](https://github.com/facebook/react/blob/c21c41ecfad46de0a718d059374e48d13cf08ced/packages/react-reconciler/src/ReactFiberHooks.js)をみると，引数の型は`(()=>S)|S`として，初めに引数自体に関数の結果を代入していました．

```javascript
function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function')
    initialState = initialState();    // 引数にも代入できる！
   /*...*/
}
```
""",

"""# Reactのchildrenに便利
props.childrenでは子要素が二つ以上のときだけ配列になります．なので子要素がなかったり一つだったりするときは配列ではないので，
`children.length`や`children.map`にエラーが出ます．次のように`children`を先に配列に直すと予期しないエラーを減らすことができたりできます．
```javascript
import React, {Children} from 'react';
const App = ({children}) => {
    children = Children.toArray(children)
    return children.filter(c=>c)         // エラー出ない！
}
```
""",

"""# 再帰化させるのに便利
孫要素に自身のコンポーネントを付与することで，自作した機能を子要素すべてに作用させることができます．
次のようにchildrenを変更すれば，孫要素が複数のときだけ再帰的に機能を与えられます．
（以下の例では，Redsで囲んだすべての子要素が赤くなります．）

```
import React, {Children, cloneElement} from 'react'
const Reds = ({children}) => {
    children = Children.map( children, (child, key) => {
        const grand = Children.toArray( child.props.children ) || []
        return grand.length > 1
          ? cloneElement(child, {children:grand[0], grand:
                <Reds> {grand.slice(0)} </Reds>
            })
          : child
    }
    const style = {background:"red"}
    return <div {...{style, children}} />
}}
```
""",

0,# """"""""""""""""""""""""" HOOKS """"""""""""""""""""""""" #
"""# hookのゆかいななかま
Reactは簡単にいうと，Web上の処理と開発を最適化するための新しいエコシステムといえます．
また，hookは関数ベースのみでReactを実装する方法なので，型システムと相性がいいです．


前半では，DOMを直接触らない大体のjsコードをhookで使用する方法をまとめました．
後半では，前半で使ったhookを使って，独自のhookを新たに作る方法をまとめました．
""",

"""## useRefについて
Reactでは，データは一方向（親から子）へ渡されて計算されるが，
親から子のElementのrefに参照することで, 子の要素の値を外から参照したり操作できます．
また，React向けでないライブラリの変数を入れることで，全体が再renderしても初期化されないようにできます．


以下の例で➊では，指定した要素の値を参照するための基本的な使い方です．
➋では，再renderしたときuseCallbackやChildrenのpropsを変化させず，子要素の再renderを防ぎます
➌では，App全体が再renderしたときに再びインスタンス化されないように値を保持します．
```javascript
import {useRef, useCallback} from 'react'
const App = ({src="/static/test.png"}) => {
    const ref = useRef(null)       // ➊：通常のref
    const err = useRef(false)      // ➋：変化しても再renderしたくない!
    const obj = useRef(new Image())// ➌：再renderしても初期化されない!
    const onError = useCallback(()=>(err.current=true), [])
    const onClick = useCallback(()=> err.current&&window.open(ref.current.src)),[])
    return <img {...{src, ref, onClick, onLoad}} />
}
```
""",

"""## useEffectについて
componentを生成し，Renderしたあとに実行する処理を入れます．
例えば，fetchなど時間がかかる処理を入れることで，ほかの要素のrenderに影響を与えません．
また，第二引数を空の配列にすることで，再renderしたときに再実行したくない重い処理を入れることができます
React向けではない（DOMを直接触るような）ライブラリは，すべての処理をこの中の入れることで利用できます．
```javascript
const App = ({url="/static/README.md"}) => {
    const [data, set] = useState('')
    useEffect(()=>{
        fetch(url).then(res=>set(res))
    }, [url])
    return data && <span>{data}</span>
}
```
### その他
- `useState`：値が変化したら，再renderしてほしいような値に使う．(特に表示させる値)
- `useSpring`：useStateの上位互換．ばねの力と加速度を計算して滑らかに遷移してくれる.
- `useMemo`    : とりあえずすべての変数をこの中に入れておくと，高速化する．
- `useCallback`: とりあえずすべての関数をこの中に入れておくと，高速化する．
""",

"""### 自作hookについて
アプリの状態を保存するuseStateでは，前の値を参考に新たな値をsetするときは関数を引数に指定します．
例として，デフォルト値`defaultPage, defaultConf`をimportし，
window.locationから状態を管理するhookを作成します．
事前に，新しい値に関数を指定できるように, 次のような型を定義します．`
```javascriot
export type BasicProps<T>  = (()=>T) | T
export type BasicState<T>  = ((pre:T)=>T) | T
export type BasicAction<T> = (fn:BasicState<T>) => void
```
引数の型が関数の場合を最初に除き，useRef内で値を補完することで，
(useStateのset(p=>p)の様な)，過去を参照するhoookを作成することができます．
useRefにはデフォルト値と入力値をmergeして入力することで，多くの状態を同時に管理できます．
""",

"""
```javascript
import {useState, useRef} from 'react'
import {Page, Conf} from '../types'
import {defaultConf, defaultPage} from '../utils'
export const usePage = <T=any>(
    props :BasicProps<Partial<Page<T>>>={},
    config:BasicProps<Partial<Conf<T>>>={},
) : [
    Page<T>,
    BasicAction<Partial<Page<T>>>
] => {
    if ( typeof props==="function" )
        props = props()
    if ( typeof config==="function" )
        config= config()
    const pageRef = useRef<Page<T>>({...defaultPage, ...props } as Page<T>)
    const confRef = useRef<Conf<T>>({...defaultConf, ...config} as Conf<T>)
    const [page,set] = useState<Page<T>>( pageRef.current )

    const setPage = useCallback(state => {
        if (typeof state==="function")
            state = state(pageRef.current as Partial<Page<T>>)
        pageRef.current = {...pageRef.current, ...state}
        set( pageRef.current )
    }, [set])

    return [page, setPage]
}
```
""",


0, # """"""""""""""""""""""""" Pagination """"""""""""""""""""""""" #
"""# Paginationについて

- [ref]
- [docs](https://www.django-rest-framework.org/api-guide/pagination/)
- [generics](https://github.com/encode/django-rest-framework/blob/master/rest_framework/generics.py)
- [pagination](https://github.com/encode/django-rest-framework/blob/master/rest_framework/pagination.py)
- [Override page size orderin](https://stackoverflow.com/questions/54198331/override-page-size-ordering-of-cursorpagination-in-django-rest-framework)
- [slide](https://www.slideshare.net/c-bata/django-rest-framework-api-pycon-jp-2018-114941317)

本サイトに使ったfetchするurlを相対的に指定するCursorPaginationのメモです．
次のDjangoのPaginationのうち，データ更新が頻繁なアプリにはカーソル型が適しています．
- PageNumberPagination  `e.g. ~/?page=4`
- LimitOffsetPagination `e.g. ~/?limit=5&offset=400`
- CursorPagination      `e.g. ~/?cursor=cj0xJnA9MjAxOC`
""",

"""
## viewsetに適用する
ListViewsetなどでは，pagination_classを指定するだけで完了します．
今回はテンプレートを利用していないため，自分でページネーションを適用します．
後半の関数引数`request`は，各クラスにrequestを与えるためあとでオーバーライドさせます
```python
class CustomViewSet (GenericViewSet):
    queryset = CustomModel.objects.all() //CustomModelは別で定義
    serializer_class = CustomSerializer  //CustomSerializerは後で定義
    pagination_class = CustomPagination  //CustomPaginationは後で定義
    def list (self, request):
        queryset = self.filter_queryset( self.get_queryset() )
        paginate = self.paginate_qeryset(objs)
        if paginate is None:
            return self.get_paginated_response(None   , request=request)
        data = self.get_serializer(paginate, many=True, request=request)
        return self.get_paginated_response(data.data  , request=request)
```
""",

"""## ViewsetのResponseを拡張する
GenericViewSetで定義されている`self.get_paginated_response`のソースコードを確認すると，
`self.paginator`の値を参照し,Dictを返しているだけなので，簡単にオーバーライドできます．
第二引数にrequestを指定することで，アクセスしたユーザー情報によってResponseを指定できます．
```python
class CustomViewSet (GenericViewSet):
    ...
    def get_paginated_response(self, data, request=None):
        return Response({
            'next'    : self.paginator.get_next_link()     if data else None,
            'previous': self.paginator.get_previous_link() if data else None,
            'results' : data if data else "Page Not found.",
            'isAuth'  : True if request.user else False,
        }, status = 404 if data is None else 200)
```
""",

"""## Serializerを拡張する
ユーザーの情報によって，シリアライズする値を変更します．
例えば，アクセスしたユーザーがそのデータの著者かどうかを判定します．
```javascript
from rest_framework import serializers as s

class NoteSerializer(s.ModelSerializer):
    ...
    is_author   = s.SerializerMethodField()
    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super().__init__()
    def get_is_author(self, obj):
        user = self.request and self.request.user
        return user and user.id == obj.posted_user.id
```
""",

"""paginationをカスタムする
`self.ordering = yyy`とViewSetの途中のコードからpaginationの値を変更させるため，
各パラメータの[get_xxxのコード](https://github.com/encode/django-rest-framework/blob/master/rest_framework/pagination.py#L797)
（例えばorderingだと，`get_ordering`）をつぎのようにオーバーライドします．
```javascript
class CustomViewSet (GenericViewSet):
    ordering = "-id"
    ...
    def ...
        self.ordering = "id"

class CustomPagination(CursorPagination):
    page_size = 5
    max_page_size = 5
    cursor_query_param = 'cursor'
    invalid_cursor_message = 'Invalid cursor(;_;)'
    def get_ordering(self, request, queryset, view):
        view_ordering = getattr(view, 'ordering', None)
        if view_ordering:
            self.ordering = view_ordering
        return super(NotePagination, self).get_ordering(request, queryset, view)
```
""",

0, # """"""""""""""""""""""""" Types """"""""""""""""""""""""" #
"""# Typescriptの合併|と公差&

- [ref]()
- [How to combine object properties](https://stackoverflow.com/questions/37042602/how-to-combine-object-properties-in-typescript)
- [Typescript merge object types](https://stackoverflow.com/questions/49682569/typescript-merge-object-types/49683575)

Typescriptの合併`|`と公差`&`がわかりにくかったので，食事の例で考えてみました．
（OLのための）献立表を作るとき，次のようにサラダとパスタとピザの型を定義します．
今回は，サラダとパスタのトマトは数を数えられるとしてnumber型，
ピザのトマトはペースト状なのでboolean型にしているので注意してください．

```javascript
type Salad = {tomato:number}
type Pasta = {tomato:number , macaroni:boolean}
type Pizza = {tomato:boolean, cheeze  :boolean}
```
""",

"""## 合併|について
以下では，`各食事で必ずサラダをとり，ランチではパスタ，ディナーではピザを食べる` とします．
一日目では，サラダとPasta,Pizzaの合併`|`を考えます．

```javascript
type Lunch  = Salad | Pasta
type Dinner = Salad | Pizza
```

合併は，いわゆる"または"の意味なので，どちらかの食事である必要があります．
ランチはPasta ⇒ Saladの関係なので， 少なくともtomatoがbooleanであればtrueとなり，
ディナーはPizzaとSaladは全く異なるので，SaladでもPizzaでもないとfalseとエラーになります．

```javascript
const  salad: Lunch  = {tomato:0} //OK!
const  pasta: Lunch  = {tomato:0,   macaroni:true} //OK!
const  pizza: Dinner = {tomato:false, cheeze:true} //OK!
const _pizza: Dinner = {tomato:1    , cheeze:true} //ERROR!
//Object literal may only specify known properties, and 'cheeze' does not exist in type 'Salad'.
```
""",

"""## 交差&について
二日目でも，ランチではパスタ，ディナーではピザを食べる食生活として，サラダとの交差`&`を用いて定義します．
```javascript
type Lunch2  = Salad & Pasta
type Dinner2 = Salad & Pizza
```

公差`&`はかつという意味なのですが，Typescriptでは少しあつかいにくいので注意が必要です．
ランチではPasta ⇒ Saladの関係であり，必要条件であるパスタでないとfalseになるので，
SaladかつPastaだとマカロニサラダしか該当しなくなります．
ディナーに関しては，tomatoの型がSaladとPizzaで異なるので，
`tomato:number&boolean)`=>`tomato:never`になり, どんな料理でも合致しなくなります．

```javascript
const salad2: Lunch2 = {tomato:0} //ERROR!
const pasta2: Lunch2 = {tomato:0, macaroni:true} //OK!

//Property 'macaroni' is missing in type '{ tomato: number; }' but required in type 'Pasta'.

const  _pizza2: Dinner2 = {tomato:1   , cheeze:true} //ERROR!
const __pizza2: Dinner2 = {tomato:true, cheeze:true} //ERROR!

//  Type 'number' is not assignable to type 'never'.
//  Type 'true' is not assignable to type 'never'.
```
""",

"""
# 型のmergeについて
## 片方を優先するmerge
重複したkeyの型が異なるSaladとPizzaの型を合体させるには，条件とマップが必要となります．
Pizzaのkeyに対して，keyがSaladのkeyにあればSaladの型，出なければPizzaの型を返すことができます．
このとき，tomatoの型は，saladが優先されるのでnumber型になります．

```
type Salad = {tomato:number}
type Pizza = {tomato:boolean, cheeze:boolean}
type Dinner<P=Pizza, S=Salad> = {
    [K in keyof P]: K extends keyof S ? S[K] : P[K]
} & S
const  pizza : Dinner = {tomato:0    , cheeze:true} // OK !
const _pizza : Dinner = {tomato:false, cheeze:true} //Error !

//  Type 'false' is not assignable to type 'number'.
//  Dinner is {tomato:number, cheeze:boolean}
```
""",

"""## 完全な型のmergeについて
次のように定義すれば，完全に型を合体できます.
二つのObjectの型をspread演算子などで合体するときに利用しやすいです．
```
const pizza:Spread<Salad, Pizza> = { //OK!
    ...{tomato:0},
    ...{tomato:false, cheeze:true}
}

export type Spread<L extends object, R extends object> = Id<
  Partial<{ [P in keyof (L & R)]: SpreadProp<L, R, P> }> &
    Pick<L, Exclude<keyof L, keyof R>> &
    Pick<R, RequiredProps<R>>
>
type SpreadProp<
  L extends object,
  R extends object,
  K extends keyof (L & R)
> = K extends keyof R
  ? (undefined extends R[K] ? L[Extract<K, keyof L>] | R[K] : R[K])
  : L[Extract<K, keyof L>]
type RequiredProps<T extends object> = {
  [P in keyof T]-?: undefined extends T[P] ? never : P
}[keyof T]
type Id<T> = { [P in keyof T]: T[P] }
```
""",

0, # """"""""""""""""""""""""" JS """"""""""""""""""""""""" #
"""# JS の落とし穴と対策
よく指摘されるエラーと，回避させる方法をまとめました．


`Uncaught SyntaxError: Unexpected token '.'`
- xxx.yyyなどで参照するとき，xxxがnullだとerrorが出る
- `xxx && xxx.yyy`と一間開けるか，`xxx?.yyy`で回避できる

`Uncaught TypeError: xxx.map is not a function.`
- props.children.map(v=>v.key)などで参照するとき, childrenが配列でないとerrorが出る
- `const getarr =a=>a instanceof Array?a:a?[]:[a]`が便利．
- getarr(props.children).map(v=>v.key)と一間開けるか，`React.Children.map`を使う．

`Cannot read property '1' of undefined`
- 長さ1の配列`arr`に `arr[1]`するとプロパティーがないといわれる
- arr.find((_,i)=>i===1)||nullを使うか，型を定義する．
""",

"""## Typescript error
`JSX element 'T' has no corresponding closing tag.`
- Typescriptの`<T>`がcomponentsとして認識されてしまう...
- 以下の`<T>`を`<T extends any>`にする

```javascript
const getF = (f:void) => <T>(ret:T) => [ f(ret) ]
f = getF ( (value:number) => value*2 )
f<number>(2)
```

`Argument of type 'any[]' is not assignable to parameter of type 'ConcatArray<never>'.`
- 型がない場合は，`.concat(...(arr as never[])`を通す
""",

"""## その他
 Objectに入れるときは，key名の変数を定義してから入れる．
- `const hoge = ...; setState({hoge})`

Objectでmap関数を使えるようにする
```javascript
import objsx from 'objsx'
const obj = {a:[0,0,0], b:[1,2,0], c:[-1,2,0]}
const isLong = objsx({
    filter:([k,v])=>val[0]>0,
    map:([k,v])=>[k,v.map(a=>a**2)]
    map:([k,v])=>[k,v.reduce((a,b)=>a+b))]
    map:([k,v])=>[k,v>1]
},  obj)

export const objsx = <T=any> (
    fns:{[mode:string]:(
        [key,val]:[string,T]
    ) => [string,T]},
    props:{[key:string]:T}|{[key:string]:T}[]
) : {[key:string]:T}|{[key:string]:T}[] => {
    if (!(props instanceof Array))
        props = [props]
    const state = props.map(prop=>{
        var entries = Object.entries(prop)
        Object.entries(fns).forEach(([mode,fn])=>{
            entries = (entries[mode as any] as any)(fn)
        })
        return Object.fromEntries(entries)
    })
    return props instanceof Array ? state : state[0]
}
```
""",

0, # """"""""""""""""""""""""" Atom """"""""""""""""""""""""" #
"""# Atomのセットアップ
外出中に突然Atomが起動しなくなったときに，再び入れたときのメモです．
AtomはChromeベース (electron)で作られたアプリなので拡張機能が多く．
vimのようなコマンドやほかのエディターのツールなど，無限に拡張できます．

## インストール
- ( 設定ファイルがあれば`git clone`する )
- ( cacheがあれば消す`~/.atom`, `~/AppData/Local/atom` )
- [atom.io](atom.io)から`AtomSetup`をインストール -> 実行 -> 起動
- ファイルタブ(alt+F) -> Setting(T) -> + Install -> japanese-menuをインストール
- `~/AppData/Local/atom`, `~/AppData/Local/atom/bin`のPathを通す
- （任意）Githubエディター設定を残す
    - `~/.atom/gitignore`に`packages/*`を追加
    - `apm list --installed --bare > packages.txt`
    - `git add .` => `git commit`
""",

"""## 設定
- [o]コア設定すべて
- [o]エディタ設定すべて
- [x]ソフトラップと右端ソフトラップ ：折り返して開業しないようにする
- タブ幅 ：4
- タブタイプ : soft
- テーマをインストール
    - [ref]()
    - [github-atom-dark-syntax](https://atom.io/themes/github-atom-dark-syntax)
    - [github-atom-light-syntax](https://atom.io/themes/github-atom-light-syntax)
- インターフェーステーマ : `One Dark`
- シンタックステーマ : `Github Atom Dark`
""",

"""## ツールの拡張
- INSTALL FOR UTILS
- [clipboard-plus](https://atom.io/packages/clipboard-plus) : clipboardの履歴の一覧を表示
- [editor-stats](https://atom.io/packages/editor-stats) : 6時間分の作業履歴をグラフにして表示
- [hyperclick](https://atom.io/packages/hyperclick) : `Ctrl+Alt+Enter`で，選択した単語が定義がされた場所を開く
- [git-plus](https://atom.io/packages/git-plus) : atomでgithubを扱う決定版
- [merge-conflicts](https://atom.io/packages/merge-conflicts) : githubでconfligtが起きたときに直しやすくする（精神を安定させる）
""",

"""## タブの拡張
- INSTALL FOR Tabs
- [file-icons](https://atom.io/packages/file-icons) : ファイル名の隣にアイコンがつく
- [foldername-tabs](https://atom.io/packages/foldername-tabs) : タブにディレクトリ名も表示
- [multiline-tab](https://atom.io/packages/multiline-tab) : タブが多いとき，改行して表示する
- [tree-view-git-status](https://atom.io/packages/tree-view-git-status)：treeにgitの情報を細かく表示させる
- [tool-bar](https://atom.io/packages/tool-bar) ：押すとコマンドを実行するボタンを設置できる
- [flex-tool-bar](https://atom.io/packages/flex-tool-bar) : tool-barの設定が簡単になる
- [Zen](https://atom.io/packages/Zen) :
    - Fullscreenを[x] : あるとよくバグる（別のコマンドで代用できる）
    - SoftWrapを[x] && Width=200 （横幅が広いディスプレイ用）
    - Typewriterを[x] : クリックした位置が中心になるが，邪魔．
""",

"""## カーソルの拡張
- INSTALL FOR CURSOR
- [highlight-column](https://atom.io/packages/highlight-column) : カーソルの位置に縦ハイライト
- [highlight-line](https://atom.io/packages/highlight-line) : カーソルの位置に横ハイライト
    - Enable Background Colorを[o]
    - Enable Selection Borderを[o]
- [highlight-selected](https://atom.io/packages/highlight-selected) : 選択した単語すべてにハイライト
- [atom-bracket-highlight](https://atom.io/packages/atom-bracket-highlight) : 選択した括弧をハイライト
- [quick-highlight](https://atom.io/packages/quick-highlight) : クリックした単語すべてにハイライト
- [auto-highlight](https://atom.io/packages/auto-highlight) : クリックした単語すべてにハイライト (過去の選択も残る)
    - Decolateを`box`
    - [x]Display Count On Status Bar : あまり見ないのでoff
""",

"""## デザインの拡張
- INSTALL FOR GAMING
- [activate-power-mode](https://atom.io/packages/activate-power-mode) : コーディングをゲームっぽくする
    - screen-shakeを[x]
    - play audioを[x]
    - pluginsを[x]
- [neon-selection](https://atom.io/packages/neon-selection) : 選択した場所がネオンの光を発する
- [glowing-cursor](https://atom.io/packages/glowing-cursor) : カーソルがネオンの光を発する
- [syntax-neonize](https://atom.io/packages/syntax-neonize)：シンタックスが光る（`Github Atom Dark`だと逆に見やすくなる）

- FOR SCROLL
- [scroll-marker](https://atom.io/packages/scroll-marker) : スクロールバー（右端）にハイライトを追加
- [find-scroll-marker](https://atom.io/packages/find-scroll-marker) : 検索した単語の位置をスクロールバーにハイライト
""",


"""## ミニマップの追加
- FOR minimap
- [minimap](https://atom.io/packages/minimap) : ソースコードのプレビューを表示する
- [minimap-cursorline](https://atom.io/packages/minimap-cursorline)：minimapにカーソル位置を表示
- [minimap-find-and-replace](https://atom.io/packages/minimap-find-and-replace)：検索結果をminimapに表示できる
- [minimap-highlight-selected](https://atom.io/packages/minimap-highlight-selected) ：highlight-selectedのminimapバインディング
- [minimap-quick-highlight](https://atom.io/packages/minimap-quick-highlight) : quick-highlightのminimapバインディング
- [minimap-lens](https://atom.io/packages/minimap-lens)：minimapをホバーしたとき，拡大表示される
- [minimap-git-diff](https://atom.io/packages/minimap-git-diff) ：githubの差分の位置をminimapに表示できる
    - [o]Use Gutter Decoration
    - （`minimap-linter`は，入れたときに入る`linter`と後で入れる`ide`が競合する）
""",

"""## その他
- FOR jsx, tsx
- [atom-browser](https://atom.io/packages/atom-browser) : atom内でブラウザを使用できる．自動リロード付き．
- [atom-ide-ui](https://atom.io/packages/atom-ide-ui) : Atomをエディターから総合開発環境にする．
- [atom-typescript](https://atom.io/packages/atom-typescript)：他の`ide-typescript`だと変なエラーが出る
- [react](https://atom.io/packages/react)：JSXのシンタックス用．
- FOR Markdown
- [mathjax-wrapper](https://atom.io/packages/mathjax-wrapper) : MathJax（`$x$`タグ）を利用できるようにする
- [markdown-preview-plus](https://atom.io/packages/markdown-preview-plus): マークダウンビュアーの決定版
- FOR Unity
- [autocomplete-glsl]()
- [language-glsl]()
- [lazy-unity-helper]()
- [unity-shader-files]()
""",

0, # """"""""""""""""""""""""" Jest """"""""""""""""""""""""" #
]
