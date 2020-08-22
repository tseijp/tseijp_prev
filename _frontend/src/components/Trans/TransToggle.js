import React from 'react';
import Radium from 'radium';
class TransToggle extends React.Component{
    render () {
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ');
        const styles = {
            Toggle:{right:"25px",top:"25px",position:"absolute",
                    color:"#2E2E2E", cursor:"pointer",transition:"0.75s",},
            Icon  : {
                    [media({        max:576})]:{fontSize:"50px"},
                    [media({min:576,max:768})]:{fontSize:"50px"},
                    [media({min:768        })]:{fontSize:"75px"},},
        }
        return (
            <div className="fixed-top">
                <div style={styles.Toggle} onClick={this.props.click}>
                    <i style={styles.Icon} className="fas fa-align-right"></i>
                </div>
            </div>
        )
    }
}
export default Radium(TransToggle);
