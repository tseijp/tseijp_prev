import React from 'react';
import Radium from 'radium';
import Mdmd from '@tsei/mdmd';
/*
card and (homecard or postedcard)
_____________
|cardbody    |
|  cardembed |
|------------|
|  cardhover |
|____________|
*/
//import Canvas from './NoteCard/Canvas.js';
import Icon  from '../components/Icon';
import {MDBCol, MDBRow, MDBInput} from 'mdbreact';

class NoteCard extends React.Component {
    constructor (props) {
        super();
        const isComment  = false;
        const isNoteAuth = (props.request_user)? ['id','username'].every(v=>
            props.request_user[v]===props.posted_user[v]):false
        //console.log(`[auth in constructor]:${isNoteAuth}`, props.request_user, props.posted_user);
        this.state = {...props, isComment, isNoteAuth, isChanged:false, nowHeight:0};
        this.embedRef = React.createRef();
        this.clickTrash = this.clickTrash.bind(this);
    }
    componentDidMount(){
        setTimeout(() => {
            const nowHeight=this.embedRef.current?this.embedRef.current.clientHeight:0;
            if (nowHeight!==0 && nowHeight!==this.state.nowHeight);
                this.setState({nowHeight});
        }, 1)
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
    clickEdit () {}
    clickTrash(){this.props.postCard(this.props.id)}
    clickComment () {}
    clickHeart () {}
    clickEye(){}
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
        const isEditable = (!p.isHome && s.isNoteAuth);
        const nowHeight = (s.nowHeight) ? s.nowHeight+50:0
        const minHeight = (this.props.isHome?440:680);
        const cardHeight = (this.props.isHome||minHeight>nowHeight)?minHeight:nowHeight
        const hoverHeight = (isEditable)?300:0
        //console.log(`[height in render]\tid:${s.id} isHome:${p.isHome},\t now:${nowHeight} ${(nowHeight>minHeight?">":"<")} min:${minHeight}`)
        const styles = {
            card:{
                cursor:"pointer", transition: "0.75s", overflow:"hidden",//position:"relative", padding:"25px 0",
            ...(p.isHome?{
                [media({max:576})]        :{width :   "95%",borderRadius:"16px", margin:"16px auto"},
                [media({min:576,max:768})]:{width : "500px",borderRadius:"20px", margin:"20px auto"},
                [media({min:768})]        :{width : "500px",borderRadius:"25px", margin:"25px auto"},}
            :!s.isComment?{
                [media({max:576})]        :{width :  "100%",borderRadius:"20px", margin:"20px auto",},
                [media({min:576,max:768})]:{width : "500px",borderRadius:"20px", margin:"20px auto",},
                [media({min:768})]        :{width : "750px",borderRadius:"25px", margin:"25px auto",},}
            :{display:"none"}),
                        height:`${cardHeight}px`              ,boxShadow:shadow([0,1,50,.2]),
              ':hover':{height:`${cardHeight + hoverHeight}px`,boxShadow:shadow([0,5,10,.4]), },},//card
            mdmd : { minHeight:`${p.isHome?400:650}px`,
                textAlign:"justify",transition:"0.5s", overflow:"hidden",
                [media({max:576})]        :{fontSize:"16px",},
                [media({min:576,max:768})]:{fontSize:"18px",},
                [media({min:768})]        :{fontSize:"20px",},},
        };
        const mdmdStyles = {
            imageStyle    :{position:"absolute"},
            styleRoot     :{padding:"25px 0 25px 0"},
            styleListItem :{padding:"0 50px"},
            styleParagraph:{padding:"0 25px 0 25px"}
        };
        return (
            <MDBCol style={ {transition:"0.75s"} } xl={p.isHome?"6":"12"}>
                <div style={ styles.card }>
                    <div ref={this.embedRef}
                        style={ styles.mdmd }
                        onClick={p.isHome?()=>p.getCard(s.id):null}>
                        <Mdmd
                            {...mdmdStyles}
                            source={s[`${p.lang}_text`]}
                            color="elegant-color"/>
                    </div>
                    <MDBRow>
                        {isEditable&& <Icon fas="edit" click={this.clickEdit}></Icon>}
                        <Icon far="comment" click={this.clickComment}></Icon>
                        <Icon far="eye"     click={this.clickEye}>{s.id}</Icon>
                        <Icon far="heart"   click={this.clickHeart}  ></Icon>
                        {isEditable&& <Icon fas="trash"click={this.clickTrash}></Icon>}
                    </MDBRow>
                    <hr />{/*--------------------------------*/}
                    {isEditable&&
                    <MDBInput type="textarea" label="test" rows="9" style={{padding:"25px"}}
                        value={s[`${p.lang}_text`]? s[`${p.lang}_text`]:''}
                        onChange={(e)=>this.editText(e.target.value)} />    }
                </div>
            </MDBCol>
        )
    }
}
export default Radium(NoteCard);
