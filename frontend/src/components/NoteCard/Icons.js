import React from 'react';
import Radium from 'radium';
import {MDBRow,MDBCol} from 'mdbreact'
import Icon from './Icon'
class Icons extends React.Component {
    reply(){}
    like(){}
    eye(){}
    edit(){}
    share(){}
    render(){
        const styles = {col:{textAlign:"center"}}
        return(
            <MDBRow>
                <MDBCol style={styles.col}><Icon icon="fa-eye"  click={this.eye} >1</Icon></MDBCol>
                <MDBCol style={styles.col}><Icon icon="fa-edit" click={this.edit}>1</Icon></MDBCol>
                <MDBCol style={styles.col}><Icon icon="fa-edit" click={this.edit}>1</Icon></MDBCol>
            </MDBRow>
        )
    }
}

export default Radium(Icons);
