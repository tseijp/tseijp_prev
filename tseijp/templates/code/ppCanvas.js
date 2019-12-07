paper.install(window);
var paper_home_add;
var paper_home_sync;
var paper_background;
window.onload = function(){
    var canvas = document.getElementById("myCanvas");//canvasを取得
    paper.setup(canvas);                             //空のproject,viewを作成
    ajax_json('')
    var post;
    var path;
    var delayTimer;
    var is_black = 0;
    var background = new Path.Rectangle(view.bounds);
    var back_color ='rgba(46,46,46,0.75)';
    paper_background = function(){
        console.log("test",background.color);
        if  (is_black==0){
             background.fillColor=back_color;is_black=1}
        else{background.fillColor="white";;is_black=0}
    }
    /* -------------------- ajax process -------------------- */
    function new_path (seg, color){
        path = new paper.Path({
    		segments   :  seg,
    		strokeColor:color,
            opacity    :  0.5,
            strokeWidth:    5,
            selected   : false,
            strokeCap: 'round',
        });
    }
    function ajax_json (json){
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function(){
            $.ajax({
                url     : "{% url 'index_json' %}",
                data    : {'json':json,'user': {{user.id}} },//$("#id_update_text").val()},
                dataType: 'json',
                success : function(data){
                    paper.project.clear();
                    if (json==''){
                        background = new Path.Rectangle(view.bounds);
                        for(path of data['json']){new_path(path, "rgba(255,255,255,1)");};
                        for(path of data['last']){new_path(path, "rgba(46,46,46,0.75)");};
                    }
                },
                timeout :3000,//https://qiita.com/hanaita0102/items/9e2f7984ecb71440c322
            });
        }, 1000);
        return false;
    }
    ajax_json('')
    paper_home_add = function(){ajax_json(project.exportJSON())}
    paper_home_sync= function(){ajax_json('')}
    /* -------------------- main process -------------------- */
    view.onMouseDown = function(event) {
    	if (path) {path.selected=false;}
        path = new Path({
    		segments: [event.point],
    		strokeColor: "rgba(46,46,46,0.75)",
            opacity: 0.5,
            strokeWidth: 5,
            strokeCap: 'round',
        });
    }
    view.onMouseDrag = function(event) {path.add(event.point)}
    view.onMouseUp = function(event) {
    	path.simplify(10);
    	path.fullySelected = true;
    }
    //$('#update_frame').attr('src', $('#update_frame').attr('src'));
    // ----------------------------------------------
    {% if user.is_authenticated %}
    view.onKeyDown = function(event) {
        if(event.key=='e' && path.length>0) {post =paper.project.exportJSON();}
        if(event.key=='y' && path.length>0) {project.clear();paper.project.importJSON(post)}
        if(event.key=='z') {post=paper.project.exportJSON();path.remove()}
        if(event.key=='i') {paper.project.importJSON(post)}
        if(event.key=='c') {project.clear();}
        if(event.key=='a'){ajax_json(project.exportJSON())}
        if(event.key=='q'){ajax_json('')}
    }
    {% endif %}
    /* -------------------- p5   process -------------------- */
    /* ------------------------------------------------------ */
    paper.view.draw();                               //viewを描画
};
