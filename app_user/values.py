def get_index_content(active="home"):
    return {
    "home":{
        "active":[" active" if active=="home" else ""][0],
        "shadow":"",
        "main":{
            "add"  :{"f":"home_add"  ,"d":""  ,"i":"fas fa-plus-circle"},
            #"sync" :{"f":"home_sync" ,"d":"lg","i":"fas fa-sync-alt",},
            "trash":{"f":"home_trash","d":"lg","i":"fas fa-trash-alt",},
            "eye"  :{"f":"home_eye"  ,"d":""  ,"i":"fas fa-eye"},},
        "icon":"fas fa-home"+[" fa-spin" if active=="home" else ""][0],
        "url"  :"home",
        "cloud":"rgba(46,46,46,1)"},

    "note":{
        "active":[" active" if active=="note" else ""][0],
        "shadow":"",
        "main":{
            "add"    :{"f":"note_add"    ,"d":"lg","i":"fas fa-plus-circle"},
            "bell"   :{"f":"note_bell"   ,"d":""  ,"i":"fas fa-bell"},
            "message":{"f":"note_message","d":""  ,"i":"fas fa-envelope"},},
        "icon" :"fas fa-sticky-note"+[" fa-spin" if active=="note" else ""][0],
        "url"  :"note",
        "cloud":"rgba(46,46,46,0)"},

    "coming soon":{
        "active":[" active" if active=="idea" else ""][0],
        "shadow":"",
        "main":{},
        "icon":"fas fa-walking"+[" fa-spin" if active=="idea" else ""][0],
        "url": "idea",
        "cloud":""},

    "coming soon!":{
        "active":[" active" if active=="idea" else ""][0],
        "shadow":"",
        "main":{},
        "icon":"fas fa-walking",
        "url": "idea",
        "cloud":""},
    }
