import React from 'react';
import Radium from 'radium';
import {MDBCol} from 'mdbreact';
class Icon extends React.Component {
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
            Col:{margin:"auto auto", textAlign:"center",transition: "1.75s",},
            icon:{textAlign:"center", margin:"auto auto",transition: "1.75s",
                [media({max:576})]        :{lineHeight:"16px",fontSize:"16px",},
                [media({min:576,max:768})]:{lineHeight:"18px",fontSize:"18px",},
                [media({min:768})]        :{lineHeight:"25px",fontSize:"25px",},
                ':hover':{color:`rgba(0,0,0,${this.state.active?.65:0.5})`,},
            }
        }
        const p = this.props;
        const s = this.state;
        return(
                <MDBCol style={styles.Col} onClick={()=>this.click()} >
                    <i className={`${s.fa} fa-${p.fas?p.fas:p.far}`}
                        style={styles.icon} />
                    {p.children}
                </MDBCol>
        )
    }
}

export default Radium(Icon);
