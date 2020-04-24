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
import Embed from 'components/NoteCard/Embed';
//import NoteContext from 'contexts/NoteContext.js';
import {MDBCol, MDBRow, MDBCardBody, MDBInput} from 'mdbreact';

class NoteCard extends React.Component {
    constructor (props) {
        super();
        this.state = {...props}
    }
    comment () {}
    heart () {}
    eye () {}
    edit () {}
    editText (text) {
        const pre = this.state[`${this.props.lang}_text`]
        if (pre!==text)
            this.setState({[`${this.props.lang}_text`]:text});
    }
    render () {
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const shadow=a=>`${a[0]}px ${a[1]}px ${a[2]}px rgba(0,0,0,${a[3]})`
        const styles = {
            col:{transition: "0.75s", },
            card:{position:"relative", cursor: "pointer", transition: "0.75s", overflow:"hidden",},/*allcard*/
            homecard:{                      height: "500px",boxShadow:shadow([0,1,50,.2]), overflow:"hidden",
                                  ':hover':{height: "750px",boxShadow:shadow([0,5,10,.4]),},
                [media({max:576})]        :{width :   "95%",borderRadius:"16px", margin:"16px auto",},
                [media({min:576,max:768})]:{width : "500px",borderRadius:"20px", margin:"20px auto",},
                [media({min:768})]        :{width : "500px",borderRadius:"25px", margin:"25px auto",},},
            postedcard:{                    height: "750px",boxShadow:shadow([0,1,50,.2]),
                                  ':hover':{height:"1000px",boxShadow:shadow([0,5,10,.4]),},
                [media({max:576})]        :{width :  "100%",borderRadius:"20px", margin:"20px auto",},
                [media({min:576,max:768})]:{width : "500px",borderRadius:"20px", margin:"20px auto",},
                [media({min:768})]        :{width : "750px",borderRadius:"25px", margin:"25px auto",},},
        }
        const s = this.state;
        const p = this.props;
        const isDisplay = true//!p.isHome && p.isAuth;
        return (
            <MDBCol style={styles.col} xl={p.isHome?"6":"12"}>
                <div style={ {...styles.card, ...styles[p.isHome?'homecard':'postedcard']} }>
                    <MDBCardBody>
                        <Embed isHome={p.isHome} text={s[`${p.lang}_text`]}
                            click={()=>p.getCard(s.id)}
                            mouseEnter={()=>this.mouseEnter()}
                            mouseLeave={()=>this.mouseLeave()}/>
                        <MDBRow>
                            <Icon far="comment" click={this.comment}></Icon>
                            <Icon far="heart"   click={this.heart}></Icon>
                            <Icon far="eye"     click={this.eye}>{s.id}</Icon>
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
