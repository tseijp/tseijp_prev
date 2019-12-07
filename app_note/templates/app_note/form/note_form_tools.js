var delayTimer;
$('#id_translate_form').keyup(function(){
  clearTimeout(delayTimer);
  delayTimer = setTimeout(function(){
      $.ajax({
          url     : "{% url 'note_tool_ajax' %}" ,
          data    : {'translate_form': $("#id_translate_form").val()},
          dataType: 'json',
          success :  function(data){
              $('#translate_results').val(data['result']);//.text(data['result']);
          }
      });
  }, 500);
});
$(function () {
var clipboard = new Clipboard('.btn-dark');
clipboard.on('success', function(e) {
    e.clearSelection();
});
});
