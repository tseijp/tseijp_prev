#from django.shortcuts import render
# """"""""""""""" ERROR """"""""""""""" #
from django.http import HttpResponseServerError
from django.views.decorators.csrf import requires_csrf_token

# """"""""""""""""""""""""" FOR ERROR """"""""""""""""""""""""" #
webhook_url = 'https://hooks.slack.com/services/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'
cat_iframes = [
    '<iframe src="https://giphy.com/embed/JIX9t2j0ZTN9S" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/JIX9t2j0ZTN9S">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/VbnUQpnihPSIgIXuZv" width="384" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/computer-cat-wearing-glasses-VbnUQpnihPSIgIXuZv">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/jRlP4zbERYW5HoCLvX" width="480" height="270" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/jRlP4zbERYW5HoCLvX">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/33OrjzUFwkwEg" width="435" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-33OrjzUFwkwEg">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/UZzuqeBeRcD3W" width="480" height="346" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/dance-dancing-cat-UZzuqeBeRcD3W">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/6bAZXey5wNzBC" width="480" height="336" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-kitty-funny-6bAZXey5wNzBC">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/uZxa6mNaSihVu" width="480" height="272" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-funny-uZxa6mNaSihVu">via GIPHY</a></p>',
    '<iframe src="https://giphy.com/embed/CCK9EUDEIe2sw" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/cat-everybody-CCK9EUDEIe2sw">via GIPHY</a></p>',
]

@requires_csrf_token
def my_customized_server_error(request, template_name='500.html'):
    import json
    import random
    import requests
    import traceback
    requests.post(
        webhook_url,
        data=json.dumps({
            'text': '\n'.join([
                f'Request uri: {request.build_absolute_uri()}',
                traceback.format_exc(),
            ]),
            'username': 'Django Server Error 500',
            'icon_emoji': ':jack_o_lantern:',
        })
    )
    message  = '<h1>Server Error (500)</h1>'
    message += '<h5>t1810394@edu.cc.uec.ac.jp</h5>'
    message += '<h5>TWITTER:@tseijp</h5>'
    message += random.choices(cat_iframes)[0]
    return HttpResponseServerError(message)
