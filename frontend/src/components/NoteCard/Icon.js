import React from 'react';
import Radium from 'radium';
import {MDBCol} from 'mdbreact';
class Icons extends React.Component {
    state = { active:false, fa:this.props.fas?'fas':'far' }
    click () {
        this.props.click();
        this.setState({
            active:!this.state.active,
            fa:this.state.fa==='fas'?'far':'fas'})
    }
    render(){
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const styles = {
            icon:{textAlign:"center", margin:"auto auto",transition: "0.75s",
                [media({max:576})]        :{lineHeight:"16px",fontSize:"16px",},
                [media({min:576,max:768})]:{lineHeight:"18px",fontSize:"18px",},
                [media({min:768})]        :{lineHeight:"25px",fontSize:"25px",},
                ':hover':{color:`rgba(0,0,0,${this.state.active?.65:0.5})`,},
            }
        }
        const p = this.props;
        const s = this.state;
        return(
            <Radium.StyleRoot style={styles.icon}>
                <MDBCol>
                <i className={`${s.fa} fa-${p.fas?p.fas:p.far}`}
                    style={styles.icon} onClick={()=>this.click()} />
                {p.children}
                </MDBCol>
            </Radium.StyleRoot>
        )
    }
}

export default Radium(Icons);
