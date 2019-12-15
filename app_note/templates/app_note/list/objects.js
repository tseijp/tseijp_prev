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
                'la'    :now_la,
                'user'  :{%if user.id%}{{user.id}}{%else%}''{%endif%},
                'mode'  :mode,
                'head'  :$("#id_update_head_"+note_id).val(),
                'text'  :$("#id_update_text_"+note_id).val(),
                'tag'   :$("#id_update_tag_" +note_id).val(),
                'img'   :$("#id_update_img_" +note_id).val(),
            },
            headers :{'X-CSRFToken': csrftoken },//[ref](https://jpn.itlibra.com/article?id=20974)
            dataType: 'json',
            success : function(data){
                if (data['note_user_id'] != "{{user.id}}"){
                    console.log("this is comment");
                    window.location.replace("{%url 'note'%}?id="+note_id);
                } else {reload_iframe(note_id);}
            }
        });
    }, 1000);
    return false;
};
var get_message = function (){
    dict = {}
    {% for note in object_list %}
    {% if not user is note.user and note.text %}
    dict.id_{{note.id}} = $("#id_message_head_{{note.id}}").val();
    dict.head = $("#id_message_head_{{note.id}}").val();
    dict.text = $("#id_message_text_{{note.id}}").val();
    dict.tag  = $("#id_message_tag_{{note.id}}").val();
    dict.img  = $("#id_message_img_{{note.id}}").val();
    {% endif %}
    {% endfor %}
    return JSON.stringify(dict)// JSON.parse(dict)
}
$(document).ready( function(){
    {% for note in object_list %}
        //var editor_{{note.id}}  = get_mirror("id_update_text_{{note.id}}");
        //$("#id_update_text_{{note.id}}").keyup(function(){send_message("{%url 'note_list_ajax' %}","{{note.id}}")});
        $('#send_message_{{note.id}}').click(function(){
            send_message("{%url 'note_list_ajax' %}","{{note.id}}", "posted");
        });
    {% endfor %}
});

var add_comment = function(){
    var form = document.getElementById(form);
    var request = document.createElement('input');
    request.setAttribute('type', 'json');
    request.setAttribute('name', 'message');
    request.setAttribute('value',get_message());
    form.appendChild(request);
}

var open_japanese = function () {
    {% for note in object_list %}
    window.open("{% url 'note_ja' note.id %}", "iframe_{{note.id}}")
    {% endfor %}
}
var open_english = function () {
    {% for note in object_list %}
    window.open("{% url 'note_en' note.id %}", "iframe_{{note.id}}")
    {% endfor %}
}
