
$(document).ready( function(){
    sendHeight();
})
function sendHeight(){
  var h = document.documentElement.scrollHeight;
  parent.postMessage({'height':h, 'id':{{object.id}}}, "*");
}
// -----------------------------------------------------------------------------
var renderer = new marked.Renderer()
function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
}
// -----------------------------------------------------------------------------
// [ref](https://qiita.com/tiwu_official/items/4e56c833aff3dfb16231)
// [ref](https://www.suzu6.net/posts/38/)

//Block level renderer.
/*renderer.code   = function (code, language) {
    return '<pre><code class='+language+'>'
    + hljs.highlightAuto(htmlDecode(code))
    + '</code></pre>';
};*/

/*[ref](https://qiita.com/59naga/items/7d46155715416561aa60)*/
hljs.initHighlightingOnLoad();
var highlight = function(code, lang, callback){
  return hljs.highlight(lang,code).value;
}
renderer.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(htmlDecode(code), lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
    //  + (escaped ? htmlDecode(code) : escape(htmlDecode(code), true))
      + htmlDecode(code)
      + '\n</code></pre>';
  }
  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};
renderer.html   = function (html) {return htmlDecode(html)};
renderer.heading = function(text, level) {
    return `<h${level + 1} class="blog-post-title font-italic border-bottom">${htmlDecode(text)}`
            +'<div style="text-align:right;float:right;">'
            +`<a href="#" onclick="javascript:window.history.back(-1);return false;">Back</a>`
            +'</div>'
            +`</h${level + 1}>`
}
renderer.table   = function(header, body) {
    if (body) body = '<tbody>' + body + '</tbody>';
    return '<div class="wrapper mx-auto mt-5">'
    + '<table class="table table-hover table-striped">'
    + '<thead>'
    + htmlDecode(header)
    + '</thead>'
    + htmlDecode(body)
    + '</table>'
    + '</div>';
};
// ----------------------------------------------
new ClipboardJS('button');
renderer.codespan   = function (code){
    decode=htmlDecode(code)
    return '<span class="codespan">'
            +'<button class="btn btn-sm" data-clipboard-text="'+decode+'">'
            +'<i class="fas fa-copy"></i></button>'
            +'<code class="code">'+decode+'</code>'
            +'</span>';
};
renderer.em         = function(text) {
    var indexNumber = text.indexOf('/');
    if (indexNumber !== -1 && text.substr(indexNumber - 1, 1) !== "\\") {
        return '<span style="color:' + text.substr(0, indexNumber) + ';">' + text.substr(indexNumber + 1) + '</span>';
    }
    return '<em>' + text.replace('\\/','/') + '</em>';
};
renderer.image  = function (href, title, text) {return '';};
renderer.text   = function (text){return htmlDecode(text)}
// -----------------------------------------------------------------------------
marked.setOptions({
  gfm        : true , //Githubっぽいmd形式.use approved GitHub Flavored Markdown (GFM) specification.
  tables     : true , //Githubっぽいmdの表.
  breaks     : true , //Githubっぽいmdの改行形式.add <br> on a single line break (copies GitHub).
  pedantic   : true , //Markdownのバグを修正するか.conform to the original markdown.pl as much as possible.
  sanitize   : false, //HTML文字をエスケープするか. A function to sanitize the HTML passed into markdownString.
  //sanitizer  : escape,

  mangle     : false, //自動リンクされたメールアドレスがエスケープ
  silent     : false, //例外をスローしません
  smartLists : true , // スマートなリストにするか.use smarter list behavior than those found in markdown.pl.
  smartypants: false, //クオートやダッシュの使い方.use "smart" typographic punctuation for things like quotes and dashes.
  //langPrefix : 'language-',
  //highlight  : highlight,//function(code, lang) {return hljs.highlightAuto(code, [lang]).value;}, //A function to highlight code blocks
  renderer   : renderer, //An object containing functions to render tokens to HTML.
        //langPrefix: '',
        //highlight: function(code, lang) {
        //  return hljs.highlightAuto(code, [lang]).value
        //}
});
// -----------------------------------------------------------------------------
// Monkey in String.trimStart() support for browsers that don't support it
/*
String.prototype.trimStart = String.prototype.trimStart || function() {
    return this.replace(/^\s+/, '').replace(/&lt;/g, 'kkk');
}*/

document.getElementById("mdrender").innerHTML = marked(
    document.getElementById("mdraw").innerHTML//.trimStart()
);

var clip_copy = function(){
    var target = null;
    var p = null;
    window.getSelection().removeAllRanges();
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        target = document.querySelector('#target_text');
        target.contentEditable  = true;
        target.readOnly = false;
    } else {
        p = document.createElement('p');
        p.setAttribute('id', 'target')
        document.body.appendChild(p);
        p.innerHTML = $('#target_text').val();
        target = document.querySelector('#target');
    }
    var range = document.createRange();
    range.selectNode(target);
    window.getSelection().addRange(range);
    document.execCommand("copy");
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        target.contentEditable  = false;
        target.readOnly = true;
    } else {
        document.body.removeChild(p);
    }
    window.getSelection().removeAllRanges();
}
