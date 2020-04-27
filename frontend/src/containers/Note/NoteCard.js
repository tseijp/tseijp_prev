import React from 'react';
import Radium from 'radium';

/*
card and (homecard or postedcard)
_____________
|cardbody    |
|  cardembed |
|------------|
|  cardhover |
|____________|
*/
//import Body from './NoteCard/Body.js';
//import Canvas from './NoteCard/Canvas.js';
import Md from 'components/Md/Md';
import Icon  from 'components/NoteCard/Icon';
//import NoteContext from 'contexts/NoteContext.js';
import {MDBCol, MDBRow, MDBInput} from 'mdbreact';

class NoteCard extends React.Component {
    constructor (props) {
        super();
        const isComment  = false;
        const isNoteAuth = (props.request_user)? ['id','username'].every(v=>
            props.request_user[v]===props.posted_user[v]):false
        //console.log(isNoteAuth, props.request_user, props.posted_user);
        this.state = {...props, isComment, isNoteAuth, isChanged:false};
        this.embedRef = React.createRef();
    }
    componentDidMount(){
        this.timerID = setInterval(() => {
            if(this.state.isChanged){
                const key = `${this.props.lang}_text`
                const body = {[key]:this.state[key]}
                this.props.postCard(this.props.id, body)
                this.setState({isChanged:false})
            }
        }, 5000);
    }
    componentWillUnmount(){
        clearInterval(this.timerID);
    }
    clickComment () {}
    clickHeart () {}
    editText (text) {
        const pre = this.state[`${this.props.lang}_text`]
        const body = {[`${this.props.lang}_text`] : text}
        if (pre!==text){ this.setState({...body, isChanged:true}); }
    }
    render () {
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ');
        const shadow=a=>`${a[0]}px ${a[1]}px ${a[2]}px rgba(0,0,0,${a[3]})`;
        const s = this.state;
        const p = this.props;
        const isDisplay = (!p.isHome && s.isNoteAuth);
        const nowHeight = (this.embedRef.current) ? this.embedRef.current.clientHeight+50:0
        const minHeight = (this.props.isHome?450:700);
        const cardHeight = [minHeight, nowHeight].reduce((a,b)=>a>b?a:b)
        const hoverHeight = (isDisplay)?300:0
        //console.log(`1\tid:${s.id} isHome:${s.isHome},\t now:${nowHeight} ${(nowHeight>minHeight?">":"<")} min:${minHeight}`)
        const styles = {
            col:{transition: "0.75s", },
            card:{
                 position:"relative", cursor: "pointer", padding:"25px 0",
                 transition: "0.75s", overflow:"hidden",
                        boxShadow:shadow([0,1,50,.2]), height:`${cardHeight}px`,
              ':hover':{boxShadow:shadow([0,5,10,.4]), height:`${cardHeight + hoverHeight}px`,},
            ...(p.isHome?{
                [media({max:576})]        :{width :   "95%",borderRadius:"16px", margin:"16px auto"},
                [media({min:576,max:768})]:{width : "500px",borderRadius:"20px", margin:"20px auto"},
                [media({min:768})]        :{width : "500px",borderRadius:"25px", margin:"25px auto"},}
            :!s.isComment?{
                [media({max:576})]        :{width :  "100%",borderRadius:"20px", margin:"20px auto",},
                [media({min:576,max:768})]:{width : "500px",borderRadius:"20px", margin:"20px auto",},
                [media({min:768})]        :{width : "750px",borderRadius:"25px", margin:"25px auto",},}
            :{display:"none"}),},
            embedcard  :{transition:"0.5s", overflow:"hidden", minHeight:`${isDisplay?650:400}px`,},
        }
        return (
            <MDBCol style={styles.col} xl={p.isHome?"6":"12"}>
                <div style={ styles.card }>
                        <div ref={this.embedRef}
                            style={ styles.embedcard }
                            onClick={p.isHome?()=>p.getCard(s.id):null}>
                            <Md text={s[`${p.lang}_text`]}/>
                        </div>
                        <MDBRow>
                            {isDisplay&& <Icon fas="edit" click={()=>null}></Icon>}
                            <Icon far="comment" click={this.clickComment}></Icon>
                            <Icon far="eye" click={()=>null}>{s.id}</Icon>
                            <Icon far="heart"   click={this.clickHeart}  ></Icon>
                            {isDisplay&& <Icon fas="trash"click={()=>p.postCard(p.id)}></Icon>}
                        </MDBRow>
                        <hr />{/*--------------------------------*/}
                        {isDisplay&&
                        <MDBInput type="textarea" label="test" rows="9" style={{padding:"25px"}}
                            value={s[`${p.lang}_text`]? s[`${p.lang}_text`]:''}
                            onChange={(e)=>this.editText(e.target.value)} />    }
                </div>
            </MDBCol>
        )
    }
}
export default Radium(NoteCard);
