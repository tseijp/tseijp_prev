$(document).on('click', '.option', function(){
   $(".option").removeClass("active");
   $(this).addClass("active");
});
function home_add  (){paper_home_add()}            //a
function home_sync (){paper_home_sync()}           //q
function home_trash(){paper.project.clear()}      //c
function home_eye  (){paper_background()}

function note_home(){window.location.href="{% url 'note' %}";}
function note_bell(){window.location.href="{% url 'note' %}#coming_soon";}
function note_message(){window.location.href="{% url 'note' %}#coming_soon";}
function note_add(){}

{% if user.is_authenticated %}
function note_add(){window.location.href="{% url 'signup' %}";}

{% else %}
function note_add(){window.location.href="{% url 'signup' %}";}
{% endif %}
