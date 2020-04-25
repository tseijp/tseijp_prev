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
import Icon  from 'components/NoteCard/Icon';
import Md from 'components/NoteCard/Md';
//import NoteContext from 'contexts/NoteContext.js';
import {MDBCol, MDBRow, MDBCardBody, MDBInput} from 'mdbreact';

class NoteCard extends React.Component {
    constructor (props) {
        super();
        const equalObj=(a,b)=>{
            const A = Object.keys(a).map(k=>[k,a[k]]).sort();
            const B = Object.keys(b).map(k=>[k,b[k]]).sort();
            return !A.map((v,j)=>!v.map((w,i)=>w===B[j][i]).includes(false)).includes(false);
        }
        const isNoteAuth=true//(props.request_user)?equalObj(props.posted_user, props.request_user):false
        this.state = {...props, isNoteAuth};
        this.embedRef = React.createRef();
    }
    clickComment () {}
    clickHeart () {}
    editText (text) {
        const pre = this.state[`${this.props.lang}_text`]
        if (pre!==text)
            this.setState({[`${this.props.lang}_text`]:text});
    }
    render () {
        //console.log(this.embedRef);
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ');
        const shadow=a=>`${a[0]}px ${a[1]}px ${a[2]}px rgba(0,0,0,${a[3]})`;
        const s = this.state;
        const p = this.props;
        const minHeight = this.embedRef.current?this.embedRef.current.clientHeight:0;
        const maxHeight =(this.props.isHome?750:1000)-300;
        const embedHeight = [minHeight,maxHeight].reduce((a,b)=>a>b?a:b)
        const hoverHeight = this.props.isHome?0:300
        const styles = {
            col:{transition: "0.75s", },
            card:{position:"relative", cursor: "pointer", transition: "0.75s", overflow:"hidden",
                        boxShadow:shadow([0,1,50,.2]), height:`${embedHeight}px`,
              ':hover':{boxShadow:shadow([0,5,10,.4]), height:`${embedHeight+hoverHeight}px`,},},
            homecard:{maxHeight:"1000px",
                [media({max:576})]        :{width :   "95%",borderRadius:"16px", margin:"16px auto",},
                [media({min:576,max:768})]:{width : "500px",borderRadius:"20px", margin:"20px auto",},
                [media({min:768})]        :{width : "500px",borderRadius:"25px", margin:"25px auto",},},
            postedcard:{
                [media({max:576})]        :{width :  "100%",borderRadius:"20px", margin:"20px auto",},
                [media({min:576,max:768})]:{width : "500px",borderRadius:"20px", margin:"20px auto",},
                [media({min:768})]        :{width : "750px",borderRadius:"25px", margin:"25px auto",},},
            homeembed  :{transition:"0.5s", overflow:"hidden", minHeight:"400px",},
            postedembed:{transition:"0.5s", overflow:"hidden", minHeight:"650px",},
        }
        const isDisplay = true;//!p.isHome && p.isAuth;
        return (
            <MDBCol style={styles.col} xl={p.isHome?"6":"12"}>
                <div style={ {...styles.card, ...styles[p.isHome?'homecard':'postedcard']} }>
                    <MDBCardBody>
                        <div ref={this.embedRef}
                            style={ {...styles[p.isHome?'homeembed':'postedembed']} }
                            onClick={p.isHome?()=>p.getCard(s.id):null}>
                            <Md text={s[`${p.lang}_text`]}/>
                        </div>
                        <MDBRow>
                            <Icon far="comment" click={this.clickComment}></Icon>
                            <Icon far="heart"   click={this.clickHeart}></Icon>
                            <Icon far="eye"     >{s.id}</Icon>
                            {isDisplay&& <Icon fas="trash"click={()=>p.postCard(p.id)}></Icon>}
                            {isDisplay&& <Icon fas="angle-down"></Icon>}
                        </MDBRow>
                        <hr />{/*--------------------------------*/}
                        <MDBInput type="textarea" label="test" rows="5"
                            value={s[`${p.lang}_text`]? s[`${p.lang}_text`]:''}
                            onChange={(e)=>this.editText(e.target.value)} />
                    </MDBCardBody>
                </div>
            </MDBCol>
        )
    }
}
export default Radium(NoteCard);
