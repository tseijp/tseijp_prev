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
/* ---------- ajax ---------- */
var csrftoken = '{{csrf_token}}'
var get_message_data = function(url, note_id){
    return {
        'id'    :note_id,
        'la'    :now_la,
        'url'   :url,
        'user'  :{%if user.id%}'{{user.id}}'{%else%}''{%endif%},
    }
}
var get_note_data = function(url, note_id){
    data = get_message_data(url, note_id);
    data['head']= $("#id_update_head_"+note_id).val();
    data['text']= $("#id_update_text_"+note_id).val();
    data['tag' ]= $("#id_update_tag_" +note_id).val();
    data['img' ]= $("#id_update_img_" +note_id).val();
    data['mode']="posted";
    return data
}
var get_like_data = function(url, note_id){
    data = get_message_data (url, note_id);
    data['mode'] = "liked";
    return data
}
var ret_send_data = function(url, note_id){
    data = get_message_data (url, note_id);
    data['mode'] = "ret";
    data['ret']  = $("#ret_text_" +note_id).val();
    return data
}

var send_message = function(data){
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function(){
        $.ajax({
            url     : data['url'],
            data    : data,
            headers :{'X-CSRFToken': csrftoken },//[ref](https://jpn.itlibra.com/article?id=20974)
            dataType: 'json',
            success : function(d){if(d){
                console.log(data['mode']);
                if(data['mode']=="posted"){
                    if (d['note_user_id'] != "{{user.id}}"){
                        window.location.replace("{%url 'note'%}?id="+data['id']);
                    } else {reload_iframe(data['id']);}
                }
                else if(data['mode']=="liked"){
                    $('#info_like_'+data['id']).children('h6').children('i').text(d['liked_number'])
                    if (d['result'] == "delete like"){
                        $('#info_like_'+data['id']).children('h6').children('i').attr("class", "far fa-heart")
                    }
                    else if (d['result'] == "new like"){
                        $('#info_like_'+data['id']).children('h6').children('i').attr("class", "fas fa-heart")
                    }
                } else if(data['mode']=="ret"){
                    $('#ret_ratio_'+data['id']).text(d['assss']+'('+d['ratio']+')');
                    $('#ret_retja_'+data['id']).text(d['retja']);
                    $('#ret_reten_'+data['id']).text(d['reten']);
                }
                else { console.log('no mode')}
            }}
        });
    }, {%if user.is_staff%}1000{%else%}3000{%endif%});
    return false;
};
/* ----------height---------- */
function changeParentHeight(e){
  e.style.height = e.contentWindow.document.body.scrollHeight + "px";
}
var timer = 0;
var iframe_height = {
    {%for note in object_list%}"height_{{note.id}}":700,{%endfor%}
}

window.addEventListener('message', function(e) {
    console.log("parent",$('#iframe_'+e.data.id).parent().height);
    //if(e.origin=="http://rwd-book.info"){
    //$("#iframe_669").parent()[0].style.height = e.data.height;
    //}
}, false);
/* ----------  ---------- */

$(document).ready( function(){
{% for note in object_list %}
    /* ----------init---------- */
    $('#info_like_{{note.id}}').children('h6').children('i').text("{{note.liked_number}}")
    {% if user.is_authenticated and user.id and user.id == note.posted_user.id %}
    $("#id_update_text_{{note.id}}").keyup(function(){
        data = get_note_data("{%url 'note_list_ajax' %}","{{note.id}}");
        send_message(data);
    });
    {% endif %}
    /* ----------button---------- */
    $('#send_message_{{note.id}}').click(function(){
        data = get_note_data("{%url 'note_list_ajax' %}","{{note.id}}");
        send_message(data);
    });
    $('#info_like_{{note.id}}').click(function(){
        data = get_like_data("{%url 'note_list_ajax' %}","{{note.id}}");
        send_message(data)
    })
    {% if  user.is_authenticated %}
    $('#ret_text_{{note.id}}').keyup(function(){
        data = ret_send_data("{%url 'note_list_ajax' %}","{{note.id}}");
        send_message(data);
    })
    $('#ret_send_{{note.id}}').click(function(){
        data = ret_send_data("{%url 'note_list_ajax' %}","{{note.id}}");
        send_message(data);
    });
    {% endif %}
    /* ----------paper---------- */
    $('#info_eye_{{note.id}}').click(function(){
        paper_eye_{{note.id}}();
    });
    $('#info_edit_{{note.id}}').click(function(){
        paper_edit_{{note.id}}();
    });
    /* ---------- ---------- */
    $("#iframe_{{note.id}}").hover(function(){
        console.log("test")
        /*$(this).parent().animate({
            height: "100"
        });*/
    }, function() {/*
        $(this).parent().animate({
            height: "700"
        });*/
    });
{% endfor %}
});
/* ----------message---------- */
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
var add_comment = function(){
    var form    = document.getElementById(form);
    var request = document.createElement('input');
    request.setAttribute('type', 'json');
    request.setAttribute('name', 'message');
    request.setAttribute('value',get_message());
    form.appendChild(request);
}
