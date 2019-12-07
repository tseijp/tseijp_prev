def get_index_content(active="home"):
    return {
    "home":{
        "active":[" active" if active=="home" else ""][0],
        "shadow":"",
        "main":{
            "home_add"  :"fas fa-plus-circle",
            "home_sync" :"fas fa-sync-alt",
            "home_trash":"fas fa-trash-alt",
            "home_eye"  :"fas fa-eye"},
        "icon":"fas fa-home"+[" fa-spin" if active=="home" else ""][0],
        "url"  :"home",
        "cloud":"rgba(46,46,46,1)"},

    "note":{
        "active":[" active" if active=="note" else ""][0],
        "shadow":"",
        "main":{
            "note_add":"fas fa-plus-circle",
            "note_bell":"fas fa-bell",
            "note_message":"fas fa-envelope"},
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
