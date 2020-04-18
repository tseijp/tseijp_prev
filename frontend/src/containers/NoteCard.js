import React from 'react';
import Radium from 'radium';

/*
card and (homecard or postedcard)
_____________
|cardhead    |
|cardbody    |
|------------|
|hover       |
|____________|
*/
//import Body from './NoteCard/Body.js';
//import Canvas from './NoteCard/Canvas.js';
import Icon  from 'components/NoteCard/Icon';
import Embed from 'components/NoteCard/Embed';
//import Hover from 'components//NoteHover/NoteHover';
import NoteContext from 'contexts/NoteContext.js';
import {MDBCol, MDBRow, MDBCardBody, MDBInput} from 'mdbreact';

class NoteCard extends React.Component {
    state = {jaText:this.props.jaText, enText:this.props.enText,};
    comment () {}
    heart () {}
    eye () {}
    edit () {}
    editText (text) {
        const pre = this.state[`${this.props.lang}Text`]
        if (pre!==text)
            this.setState({[`${this.props.lang}Text`]:text});
    }
    render () {
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const shadow=a=>`${a[0]}px ${a[1]}px ${a[2]}px rgba(0,0,0,${a[3]})`
        const styles = {
            col:{textAlign:"center"},
            card:{position:"relative", cursor: "pointer", transition: "0.75s", overflow:"hidden",},/*allcard*/
            homecard:{                      height: "500px",boxShadow:shadow([0,1,50,.2]),
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
        return (
            <NoteContext.Consumer>
            {(c) => (
                <MDBCol xl={c.isHome?"6":"12"}>
                    <Radium.StyleRoot>
                    <div style={ {...styles.card, ...styles[c.isHome?'homecard':'postedcard']} }>
                        <MDBCardBody >
                            <Embed isHome={c.isHome} text={s[`${p.lang}Text`]}/>
                            <MDBRow>
                                <Icon far="comment" click={this.comment}></Icon>
                                <Icon far="heart"   click={this.heart}></Icon>
                                <Icon far="eye"     click={this.eye}></Icon>
                                <Icon far="edit"    click={this.edit}></Icon>
                            </MDBRow>
                            <hr />{/*--------------------------------*/}
                            <MDBInput type="textarea" label="test" rows="5"
                                value={s[`${p.lang}Text`]}
                                onChange={(e)=>this.editText(e.target.value)} />
                        </MDBCardBody>
                    </div>
                    </Radium.StyleRoot>
                </MDBCol>
            )}
            </NoteContext.Consumer>
        )
    }
}
export default Radium(NoteCard);
