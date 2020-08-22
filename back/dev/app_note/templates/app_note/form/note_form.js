//settings --------------------------------------------
var delayTimer;
var preview       = document.getElementById("preview");
var previewWrapper= document.getElementById("previewWrapper");
var editor        = CodeMirror.fromTextArea(document.getElementById('id_update_text'), {
    mode:  "markdown",
    lineNumbers  : true,
    matchBrackets: true,
    lineWrapping : true,
    extraKeys: {
        "Enter": "newlineAndIndentContinueMarkdownList"
    }
});

marked.setOptions({gfm: true});
//-----
//ajax
//-----

//left--------------------------------------------------------------------------
$('#search_results_left').text('Not Working');
preview.innerHTML = marked($("#id_update_text").val())
editor.on("change" , function(e){
    //markdown --------------------------------------
    preview.innerHTML= marked(e.getValue());
    //ajax ------------------------------------------
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function(){
        e.preventDefault();//デフォルトのform操作を一時的に防止
        var form = $(this);
        $.ajax({
            url     : "{% url 'note_edit_ajax' pk=object.id %}" ,
            method  : form.prop("method"),
            data    : {'update_text': e.getValue().serialize(),},//$("#id_update_text").val()},
            dataType: 'text', //'json'  ,
            success :  function(data){
                $('#search_results_left').text(data['result']);
                //$('#update_frame').attr('src', $('#update_frame').attr('src'));
            },
            timeout:3000,//https://qiita.com/hanaita0102/items/9e2f7984ecb71440c322
        });
    }, 1000);
    $('#update_frame').attr('src', $('#update_frame').attr('src'));
    return false;
    // ----------------------------------------------
});
editor.on("scroll" , function(e){
    // http://liuhao.im/english/2015/11/10/the-sync-scroll-of-markdown-editor-in-javascript.html
    var scrollInfo = e.getScrollInfo();

    // get line number of the top line in the page
    var lineNumber = e.lineAtHeight(scrollInfo.top, 'local');
    // get the text content from the start to the target line
    var range = e.getRange({line: 0, ch: null}, {line: lineNumber, ch: null});
    var parser = new DOMParser();
    var doc = parser.parseFromString(marked(range), 'text/html');
    var totalLines = doc.body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');

    // shouldPreviewScroll(length)
    var body = document.getElementById("preview");
    var elems = body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table');
    if (elems.length > 0) {
        previewWrapper.scrollTop = elems[totalLines.length].offsetTop;
    }
});
$('#id_update_head').keyup(function(){
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function(){
        $.ajax({
            url     : "{% url 'note_edit_ajax' pk=object.id %}"  ,
            data    : {'update_head': $("#id_update_head").val()},
            dataType: 'json'  ,
            success :  function(data){
                $('#search_results_left').text(data['result']);
                //$('#update_frame').attr('src', $('#update_frame').attr('src'));
            }
        });
    }, 1000);
    $('#update_frame').attr('src', $('#update_frame').attr('src'));
    return false;
});
$('#id_update_tag').keyup(function(){
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function(){
        $.ajax({
            url     : "{% url 'note_edit_ajax' pk=object.id %}" ,
            data    : {'update_tag': $("#id_update_tag").val()},
            dataType: 'json'  ,
            success :  function(data){
                $('#search_results_left').text(data['result']);
                //$('#update_frame').attr('src', $('#update_frame').attr('src'));
            }
        });
    }, 1000);
    $('#update_frame').attr('src', $('#update_frame').attr('src'));
    return false;
});

//right ------------------------------------------------------------------------
$('#search_results_right').text('Not Working');
$(document).ready(function() {
  $('#reload').click(function() {
      $('#update_frame').attr('src', $('#update_frame').attr('src'));
      return false;
  });
})
$(document).ready(function() {
  $('#origin').click(function() {
        $.ajax({
            url     : "{% url 'note_edit_ajax' pk=object.id %}" ,
            data    : {'update_data': 1 },
            dataType: 'json'  ,
            success :  function(data){
                $('#search_results_right').text(data['result']);
            }
        });
        $('#update_frame').attr('src', $('#update_frame').attr('src'));
        return false;
  });
})
// -----------------------------------------------------------------------------
