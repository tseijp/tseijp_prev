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
import Icon  from './Icon';
import Embed from './Embed';
import Hover from '../NoteHover/NoteHover';
import NoteContext from 'contexts/NoteContext.js';
import {MDBCol, MDBRow, MDBCardBody} from 'mdbreact';

class NoteCard extends React.Component {
    render() {
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const shadow=a=>`${a[0]}px ${a[1]}px ${a[2]}px rgba(0,0,0,${a[3]})`
        const styles = {
            col:{textAlign:"center"},
            card:{position:"relative", cursor: "pointer", transition: "0.75s", overflow:"hidden",},/*allcard*/
            homecard:{                      height: "500px",boxShadow:shadow([0,1,50,.2]),
                [media({max:576})]        :{width :   "95%",borderRadius:"16px", margin:"16px auto",//display:"none",
                                  ':hover':{height: "750px",boxShadow:shadow([0,5,10,.4]),} ,},
                [media({min:576,max:768})]:{width : "500px",borderRadius:"20px", margin:"20px auto",//display:"none",
                                  ':hover':{height: "750px",boxShadow:shadow([0,5,10,.4])}  ,},
                [media({min:768})]        :{width : "500px",borderRadius:"25px", margin:"25px auto" ,
                                  ':hover':{height: "750px",boxShadow:shadow([0,5,10,.4]),/*dev*/},},},/*homecard*/
            /*
            postedcard:{                    height: "750px",boxShadow:shadow([0,1,50,.2]),
                [media({max:576})]        :{width : "500px",borderRadius:"20px", margin:"20px auto",display:"none",
                                  ':hover':{height: "750px",boxShadow:shadow([0,5,10,.4]),} ,},
                [media({min:576,max:768})]:{width : "500px",borderRadius:"20px", margin:"20px auto",display:"none",
                                  ':hover':{height:"1000px",boxShadow:shadow([0,5,10,.4])}  ,},
                [media({min:768})]        :{width : "750px",borderRadius:"25px", margin:"25px auto" ,
                                  ':hover':{height:"1000px",boxShadow:shadow([0,5,10,.4]),},},},
            postedembed:{
                [media({max:576})]        :{height:"700px",borderRadius:"16px",transition:"0.5s",},
                [media({min:576,max:768})]:{height:"950px",borderRadius:"20px",transition:"0.5s",},
                [media({min:768})]        :{height:"950px",borderRadius:"25px",transition:"0.5s",},},
            */
            /*
            cardbody:{
                [media({max:576})]        :{padding:"0rem 16px 16px", height:"0",},
                [media({min:576,max:768})]:{padding:"0rem 20px 20px", height:"0",},
                [media({min:768})]        :{padding:"0rem 25px 25px", height:"0",},},
            cardhead:{
                [media({max:576})]        :{padding:"10px 0rem 0rem",margin:"0 0px",fontSize:"16px",},
                [media({min:576,max:768})]:{padding:"10px 0rem 0rem",margin:"0 0px",fontSize:"20px",},
                [media({min:768})]        :{padding:"10px 0rem 0rem",margin:"0 0px",fontSize:"25px",},},
            cardtext:{
                [media({max:576})]        :{textAlign:"justify",lineHeight:"16px",fontSize:"16px",},
                [media({min:576,max:768})]:{textAlign:"justify",lineHeight:"18px",fontSize:"18px",},
                [media({min:768})]        :{textAlign:"justify",lineHeight:"20px",fontSize:"20px",},},
            */
        }
        const s = this.state;
        const p = this.props;
        return (
            <NoteContext.Consumer>
            {(c) => (
            <MDBCol lg="12">
                <Radium.StyleRoot>
                <div style={ {...styles.card, ...styles[c.isHome?'homecard':'postedcard']} }>
                    <MDBCardBody >
                        <Embed isHome={c.isHome} />
                        <MDBRow>
                            <MDBCol style={styles.col}><Icon icon="fa-eye"  click={this.eye} /></MDBCol>
                            <MDBCol style={styles.col}><Icon icon="fa-edit" click={this.edit}/></MDBCol>
                            <MDBCol style={styles.col}><Icon icon="fa-edit" click={this.edit}/></MDBCol>
                        </MDBRow>
                        <hr />{/*--------------------------------*/}
                        <Hover note={p.noe} edit={this.edit}/>
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
