import React from 'react';
import Radium from 'radium';
import { MDBBtn, MDBIcon, MDBRow, MDBCol } from "mdbreact";

class NoteHead extends React.Component{
    click() {
        const body = {'note_object':this.props.topNoteId}
        this.props.postCard(null, body)
    }
    render(){
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const styles = {
            head  :{display:"inline",padding:"25px 25px 10px 10px",transition:"0.75s",
                    [media({        max:576})]:{fontSize:"50px",},
                    [media({min:576,max:768})]:{fontSize:"50px",},
                    [media({min:768        })]:{fontSize:"75px",},},
            button:{padding:"25px 25px 10px 10px"},
        }
        const p = this.props;
        return (
            <MDBRow>
                <MDBCol sm="5" onClick={()=>p.getCard()}>
                    <h1 style={styles.head}>note</h1>
                </MDBCol>
                <MDBCol sm="7" style={styles.button}>
                    <MDBBtn size="sm" color="dark" onClick={()=>p.getCard()}><MDBIcon icon="home" /></MDBBtn>
                    {(p.isAuth&&p.isHome) &&
                    <MDBBtn size="sm" color="dark"
                        onClick={()=>this.click()}>
                        new create</MDBBtn> }
                </MDBCol>
            </MDBRow>
        )
    }
}

export default Radium(NoteHead);
