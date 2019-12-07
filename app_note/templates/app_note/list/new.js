var editor = CodeMirror.fromTextArea(document.getElementById('id_update_text'), {
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
