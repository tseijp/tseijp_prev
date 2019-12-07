
function ScrollHeight() {
    var element = document.documentElement;
    var bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
}
{% include "index/nav.js" %}
{% include "index/content.js" %}
{% include "app_note/list/objects.js" %}
