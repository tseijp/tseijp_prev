notes = [
# """"""""""""""""""""""""" HOOKS """"""""""""""""""""""""" #
'''# React hook のゆかいななかまたち
Reactは簡単にいうと新しいhtmlで，処理と制作を最適化するためのエコシステム．
なので，（DOMを直接触らないような）ほぼ全てのjsはReact上で再現できる．
useEffect内にすべて書けば再現できるが，変数の依存関係を考えれば処理を最適化できる．
また，hookは関数型なので，特定の処理や要素どうしを合体できたりする．
大体はuseRefとuseEffectで作ることができる．
''',

'''### useRef
外からjsxに参照すると, どんな要素の値をいじれる.（基本）
React向けじゃないライブラリの変数はすべてこの中の初期値に入れる
変化しても再renderさせたくないなって時に使える
```javascript
function Test () {
    const src="/static/test.png"
    const ref = useRef(null)       // 通常のref
    const obj = useRef(new Image())// 再renderしても初期化されない!
    const err = useRef(false)      // 変化しても再renderしたくない!
    const onClick =()=> err.current&&window.open(ref.current.src))
    const onError =()=>(err.current=true)
    return (
        <div onClick={onClick}}>
            <img {...{src, ref, onLoad}}>
        </div>
    )
}
```
''',

'''
### `useEffect`
- componentをrenderしたあとにする処理を入れる．
- React向けじゃないライブラリの処理はすべてこの中の処理に入れる．

### `useState`
- 値が変化したら，再renderしてほしいような値に使う．(特に表示させる値)
- 何にでも使ってると，値をsetしたときに無駄に再rendeしたり再mountしてしまう．

### `useSpring` (`npm i use-spring`でいれる)
- useStateの上位互換．値をsetしたときに滑らかに遷移して気持ちいいし，再renderしない.
- (例えば0から100に) 値をsetしたときに，ばねの力と加速度を計算してゆっくり遷移してくれる．

### パフォーマンス
- useMemo    : とりあえずすべての変数をこの中に入れておくと，超高速化する．
- useCallback : とりあえずすべての関数をこの中に入れておくと，超高速化する．
''',

0, # """"""""""""""""""""""""" JS """"""""""""""""""""""""" #
'''# JS の落とし穴と対策
よく指摘されるエラーを回避させる方法をまとめた

### `Cannot read property '1' of undefined`
- 配列以外の変数`xxx`に `xxx[1]`するとプロパティーがないといわれる
''',

'''### `Uncaught SyntaxError: Unexpected token '.'` : keyがあるか先に確認
- xxx.props.childrenなどで参照するとき，xxxにpropsがないとerrorが出る
- `xxx.props && xxx.props.children`と一間開ける
- TypeScriptなら，`xxx.props?.children`で回避できる
''',

'''## `Uncaught TypeError: xxx.map is not a function` : mapできるか確認
- props.children.map(v=>v.key)などで参照するとき, childrenが配列でないとerrorが出る
- `const getarr =arr=> arr?(arr.length?arr:[arr]).filter(a=>a):[]`
- getarr(props.children).map(v=>v.key)と一間開ける
- もしくは`React.Children.map`を使う．
''',

'''### (TS) `Argument of type 'any[]' is not assignable to parameter of type 'ConcatArray<never>'.` :as never[]を通す
- (arr:any)=>[].concat(...arr) :
- (arr:any)=>[].concat(...(arr as ever[])) :
''',

'''### (TS) `JSX element 'T' has no corresponding closing tag.` ：`<T extends any>`を使う
- 例："任意の関数をとおして，配列に入れる関数"を取得する`getF`
- Typescriptのジェネリック型と二重アロー関数を使うと怒られる．
- `<T>`のかき方がcomponentsとして認識されてしまう...
```javascript
const getF = (f:void) => <T>(ret:T) => [ f(ret) ]
f = getF ( (value:number) => value*2 )
f<number>(2)
```
''',

'''### (他)
- const 以外使わない
- Objectに入れるときは，key名の変数を定義してから入れる．
- `const hoge = ...; this.setState({hoge})`

```sharrow equal for obj
const f=(p,q)=>{
    const a = Object.keys(p).map(k=>[k,v[k]]).sort();
    const b = Object.keys(q).map(k=>[k,w[k]]).sort();
    return !a.map((v,j)=>!v.map((w,i)=>w===b[j][i]).includes(false)).includes(false);
}```
const f=(p,q)=>Array.from(new Set(...Object.keys(p),...Object.keys(q))).every(k=>p[k]===q[k])
props.request_user[v]===props.posted_user[v])
''',

'''### Objectでmap関数を使えるようにする
```javascript
import objsx from 'objsx'
const obj = {a:[0,0,0], b:[1,2,0], c:[-1,2,0]}
const isLong = objsx({
    filter:([k,v])=>val[0]>0,
    map:([k,v])=>[k,v.map(a=>a**2)]
    map:([k,v])=>[k,v.reduce((a,b)=>a+b))]
    map:([k,v])=>[k,v>1]
},  obj)
```
''',

'''
```javascript
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
''',

0, # """"""""""""""""""""""""" TS """"""""""""""""""""""""" #
'''# Typescriptで引数に`(()=>T)|T`を使う
`useState`のような状態を扱う自作hookを作る際，値を更新するset関数が必要になりますが，
前の状態を踏まえて値を更新するには，引数に関数を使うことがあります．

[useStateのソースコード](https://github.com/facebook/react/blob/c21c41ecfad46de0a718d059374e48d13cf08ced/packages/react-reconciler/src/ReactFiberHooks.js)
をみると，引数に関数の結果を代入していた．（引数って値を代入していいのか．．．）
''',

'''### CODE OF USESTATE
```javascript
type Dispatch<A> = A => void;
type BasicStateAction<S> = (S => S) | S;
Dispatch<BasicStateAction<S>>

function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const hook = mountWorkInProgressHook();
  if (typeof initialState === 'function') {
    initialState = initialState();
  }
   /*...*/
}
```
''',

0, # """"""""""""""""""""""""" CSS """"""""""""""""""""""""" #
'''## css メモ
- absoluteの外はrelativeにする (今まで全absoluteにしていた)
- absoluteでcenteringは`margin:"0px auto"`
- そのほかのcenteringは`left:"50%, transform:"translateX(-50%)`

''',

'''#

''',

0, # """"""""""""""""""""""""" Atom """"""""""""""""""""""""" #
'''# Atomのセットアップ
外出中に突然Atomが起動しなくなったときに，再び入れたときのメモです．
Atomはとにかく重く，起動時に毎回エラーが出るので不満があったこともあり，
VSCodeに挑戦したのですが，普段よりも進捗が出ず半日過ぎてました．
結局，もう半日かけて開発環境を構築ました.

Atomの一番の強みは，Atomはハッカブルなエディターなので，拡張機能が多いことです．
たとえばvimのようなコマンドやellipseのようなGUIなど，エディター機能を無限に拡張できます．

また，React.jsで作られたアプリなので，拡張機能を作りやすい利点もあります．
特にシンタックスやハイライトなどのテーマが豊富に利用でき，自分で拡張できます．
''',

'''### インストール
- （任意）cacheがあれば消す（設定ファイルがあれば`git clone`する）
  - `~/.atom`
  - `~/AppData/Local/atom`
- [atom.io](atom.io)から`AtomSetup`をインストール -> 実行 -> 起動
- ファイルタブ(alt+F) -> Setting(T) -> + Install -> japanese-menuをインストール
- `~/AppData/Local/atom`, `~/AppData/Local/atom/bin`のPathを通す
- （任意）Githubエディター設定を残す
    - `~/.atom/gitignore`に`packages/*`を追加
    - `apm list --installed --bare > packages.txt`
    - `git add .` => `git commit -m "Init Commit"`
''',

'''### 設定
- [o]コア設定すべて
- [o]エディタ設定すべて
- [x]ソフトラップと右端ソフトラップ ：折り返して開業しないようにする
- タブ幅 ：4
- タブタイプ : soft
- テーマをインストール
    - [github-atom-dark-syntax](https://atom.io/themes/github-atom-dark-syntax)
    - [github-atom-light-syntax](https://atom.io/themes/github-atom-light-syntax)
- インターフェーステーマ : `One Dark`
- シンタックステーマ : `Github Atom Dark`
''',

'''### エディターとGithubの拡張
- [clipboard-plus](https://atom.io/packages/clipboard-plus) : clipboardの履歴の一覧を表示
- [editor-stats](https://atom.io/packages/editor-stats) : 6時間分の作業履歴をグラフにして表示
- [hyperclick](https://atom.io/packages/hyperclick) : `Ctrl+Alt+Enter`で，選択した単語が定義がされた場所を開く
- [git-plus](https://atom.io/packages/git-plus) : atomでgithubを扱う決定版
- [merge-conflicts](https://atom.io/packages/merge-conflicts) : githubでconfligtが起きたときに直しやすくする（精神を安定させる）
''',

'''### ツールの拡張
- [file-icons](https://atom.io/packages/file-icons) : ファイル名の隣にアイコンがつく
- [foldername-tabs](https://atom.io/packages/foldername-tabs) : タブにディレクトリ名も表示
- [multiline-tab](https://atom.io/packages/multiline-tab) : タブが多いとき，改行して表示する
- [tree-view-git-status](https://atom.io/packages/tree-view-git-status)：treeにgitの情報を細かく表示させる
- [tool-bar](https://atom.io/packages/tool-bar) ：押すとコマンドを実行するボタンを設置できる
- [flex-tool-bar](https://atom.io/packages/flex-tool-bar) : tool-barの設定が簡単になる
- [Zen](https://atom.io/packages/Zen) :
    - [x]Fullscreen : あるとよくバグる（別のコマンドで代用できる）
    - [x]SoftWrap && Width=200 （横幅が広いディスプレイ用）
    - [x]Typewriter : クリックした位置が中心になるが，邪魔．
''',

'''### HighLightの拡張
- [activate-power-mode](https://atom.io/packages/activate-power-mode) : コーディングをゲームっぽくする
    - [x]screen-shake
    - [x]play audio
    - [x]plugins
- [highlight-column](https://atom.io/packages/highlight-column) : カーソルの位置に縦ハイライト
- [highlight-line](https://atom.io/packages/highlight-line) : カーソルの位置に横ハイライト
    - [o]Enable Background Color
    - [o]Enable Selection Border
- [highlight-selected](https://atom.io/packages/highlight-selected) : 選択した単語すべてにハイライト
- [atom-bracket-highlight](https://atom.io/packages/atom-bracket-highlight) : 選択した括弧をハイライト
- [quick-highlight](https://atom.io/packages/quick-highlight) : クリックした単語すべてにハイライト
- [auto-highlight](https://atom.io/packages/auto-highlight) : クリックした単語すべてにハイライト (過去の選択も残る)
    - Decolateを`box`
    - [x]Display Count On Status Bar : あまり見ないのでoff
- [scroll-marker](https://atom.io/packages/scroll-marker) : スクロールバー（右端）にハイライトを追加
- [find-scroll-marker](https://atom.io/packages/find-scroll-marker) : 検索した単語の位置をスクロールバーにハイライト
- [neon-selection](https://atom.io/packages/neon-selection) : 選択した場所がネオンの光を発する
- [glowing-cursor](https://atom.io/packages/glowing-cursor) : カーソルがネオンの光を発する
- [syntax-neonize](https://atom.io/packages/syntax-neonize)：シンタックスが光る（`Github Atom Dark`だと逆に見やすくなる）
''',

'''### for minimap
- [minimap](https://atom.io/packages/minimap) : ソースコードのプレビューを表示する
- [minimap-cursorline](https://atom.io/packages/minimap-cursorline)：minimapにカーソル位置を表示
- [minimap-find-and-replace](https://atom.io/packages/minimap-find-and-replace)：検索結果をminimapに表示できる
- [minimap-highlight-selected](https://atom.io/packages/minimap-highlight-selected) ：highlight-selectedのminimapバインディング
- [minimap-quick-highlight](https://atom.io/packages/minimap-quick-highlight) : quick-highlightのminimapバインディング
- [minimap-lens](https://atom.io/packages/minimap-lens)：minimapをホバーしたとき，拡大表示される
- [minimap-git-diff](https://atom.io/packages/minimap-git-diff) ：githubの差分の位置をminimapに表示できる
     - [o]Use Gutter Decoration
（`minimap-linter`は，入れたときに入る`linter`と後で入れる`ide`が競合するので，お勧めしない）
''',

'''### for jsx, tsx
- [atom-browser](https://atom.io/packages/atom-browser) : atom内でブラウザを使用できる．自動リロード付き．
- [atom-ide-ui](https://atom.io/packages/atom-ide-ui) : Atomをエディターから総合開発環境にする．
- [atom-typescript](https://atom.io/packages/atom-typescript)：他の`ide-typescript`だと変なエラーが出る
- [react](https://atom.io/packages/react)：JSXのシンタックス用．

### for markdown
- [mathjax-wrapper](https://atom.io/packages/mathjax-wrapper) : MathJax（`$x$`タグ）を利用できるようにする
- [markdown-preview-plus](https://atom.io/packages/markdown-preview-plus): マークダウンビュアーの決定版

### for Unity
- [autocomplete-glsl]()
- [language-glsl]()
- [lazy-unity-helper]()
- [unity-shader-files]()
''',

]
