
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    //document.getElementById("main").style.marginLeft = "250px";
    //document.body.style.backgroundColor = "rgba(46,46,46,0.95)";
    paper_background()
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    //document.getElementById("main").style.marginLeft= "0";
    //document.body.style.backgroundColor = "white";
    paper_background()

}
var now_la = "ja";
function note_la_to(la, id, head=false, text=false) {
    url = "{% url 'note_ja'  99999 %}".replace('ja',la).replace("99999", id).toString();
    console.log(url)
    $("#iframe_"+id).attr("src", url);
    if(head || text){
        $("#id_update_head_"+id).val(head);
        $("#id_update_text_"+id).val(text);
    }
}
function to_ja(){
now_la = "ja";
{% if object_list %}
{% for note in object_list %}
    note_la_to('ja', {{note.id}},{%if user.id == note.posted_user.id%}
    head={%if note.ja_head%}`{{note.ja_head}}`{%else%}''{%endif%},
    text={%if note.ja_text%}`{{note.ja_text}}`{%else%}''{%endif%}{%endif%});
{% endfor %}
{% endif %}
}
function to_en(){
now_la = "en";
{% if object_list %}
{% for note in object_list %}
    note_la_to('en', {{note.id}}{%if user.id == note.posted_user.id%},
    head={%if note.en_head%}`{{note.en_head}}`{%else%}''{%endif%},
    text={%if note.en_text%}`{{note.en_text}}`{%else%}''{%endif%}{%endif%});
{% endfor %}
{% endif %}
}
