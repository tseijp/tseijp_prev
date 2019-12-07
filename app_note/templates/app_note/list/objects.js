var delayTimer;
var reload_iframe = function(note_id){
    $("#iframe_"+note_id).attr('src', $("#iframe_"+note_id).attr('src'));
    return false;
}
var get_mirror = function(text_id){
    CodeMirror.fromTextArea(document.getElementById(text_id),{
        mode:    "markdown",
        lineNumbers  : true,
        matchBrackets: true,
        lineWrapping : true,
        extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
    });
}

var csrftoken = '{{csrf_token}}'
var send_message = function(url, note_id, mode="posted"){
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function(){
        $.ajax({
            url     : url,
            data    : {
                'id'    :note_id,
                'user'  :{{user.id}},
                'mode'  :mode,
                'head'  :$("#id_update_head_"+note_id).val(),
                'text'  :$("#id_update_text_"+note_id).val(),
                'tag'   :$("#id_update_tag_" +note_id).val(),
            },
            headers :{'X-CSRFToken': csrftoken },//[ref](https://jpn.itlibra.com/article?id=20974)
            dataType: 'json',
            success : function(data){reload_iframe(note_id)}
        });
    }, 1000);
    return false;
};
var get_message = function (){
    dict = {}
    {% for note in object_list %}
    dict.id_{{note.id}} = "test";//"$("#id_message_head_{{note.id}}").val();
    {% endfor %}
    return JSON.stringify(dict)// JSON.parse(dict)
}
$(document).ready(function() {
{% for note in object_list %}
{% if user.id is note.posted_user.id %}
    //var editor_{{note.id}}  = get_mirror("id_update_text_{{note.id}}");
    //$("#id_update_text_{{note.id}}").keyup(function(){send_message("{%url 'note_list_ajax' %}","{{note.id}}")});
    $('#send_message_{{note.id}}').click(function(){
      send_message("{%url 'note_list_ajax' %}","{{note.id}}", "posted");
    });
{% endif %}
{% endfor %}
    $('#new_create').click(function(){
        var form = document.getElementById("new_create_form");
        var request = document.createElement('input');
        request.setAttribute('type', 'json');
        request.setAttribute('name', 'message');
        request.setAttribute('value',get_message());
        form.appendChild(request);
    });
});
