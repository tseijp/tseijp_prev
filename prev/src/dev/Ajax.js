const GetAjax =()=> {
    const now_la='ja';
    return (
        <Ajax la={now_la} {%if user.id%}user='{{user.id}}'{%endif%} />
    )
}
class Ajax extends React.Component {
    constructor () {
        super();
        setState({
            la  : 'ja',
            url : props.url ,
            user: props.user_id,
            mode: props.mode,
            dataType: 'json',
        })
    }
    run () {
        clearTimeout(delayTimer);
        delayTimer = setTimeout(function(){
            $.ajax({
                url     : this.state['url'],
                data    : this.state,
                headers :{'X-CSRFToken':csrftoken },//[ref](https://jpn.itlibra.com/article?id=20974)
                success :(d)=>this.setState({response:d}), this.success()} //???
            });
        }, {%if user.is_staff%}1000{%else%}3000{%endif%});
        return false;
    };
    /*
    success_posted(){
        const data = this.state;
        if (this.state.response.note_user_id != "{{user.id}}"){
            window.location.replace("{%url 'note'%}?id="+this.state.id);
        } else {
            reload_iframe(this.state.id);
        }
    }
    success_liked(){
        $('#info_like_'+this.state.id).children('h6').children('i').text(this.state.liked_number)
        if (this.state.result == "delete like"){
            $('#info_like_'+this.state.dataid).children('h6').children('i').attr("class", "far fa-heart")
        }
        else if (this.state.result == "new like"){
            $('#info_like_'+this.state.id).children('h6').children('i').attr("class", "fas fa-heart")
        }
    }
    success_ret(){
        $('#ret_ratio_'+this.state.id).text(this.state.assss+'('+this.state.ratio+')');
        $('#ret_retja_'+this.state.id).text(this.state.retja);
        $('#ret_reten_'+this.state.id).text(this.state.reten);
    }
    success(){
        const mode = this.state.mode;
        if (mode=="posted") {
            this.success_posted();
        } else if(mode=="liked") {
            this.success_liked();
        } else if(mode=="ret") {
            this.success_ret();
        }
    }
    */
}
