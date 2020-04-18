import React from 'react';
import Radium from 'radium';
import { MDBBtn } from "mdbreact";

class NoteTail extends React.Component{
    render(){
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const styles = {
            tail  :{display:"inline",padding:"25px 25px 10px 10px",transition:"0.75s",margin:"auto auto",
                    [media({        max:576})]:{fontSize:"50px",},
                    [media({min:576,max:768})]:{fontSize:"50px",},
                    [media({min:768        })]:{fontSize:"75px",},},
            button:{padding:"5px 30px 5px 30px",borderRadius:"250px",textAlign:"center",fontSize:"50px",},
        }
        const p = this.props;
        return (
            <div style={styles.tail} click={p.addCard}>
                <MDBBtn style={styles.button} size="sm" color="dark" onClick={p.addCard}>+</MDBBtn>
            </div>
        )
    }
}

export default Radium(NoteTail);
