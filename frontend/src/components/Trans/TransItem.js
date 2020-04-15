import React from 'react';
import Radium from 'radium';
class TransItem extends React.Component {
    render () {
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const styles = {
            Item : {padding:"10px 10px 10px 32px",textDecoration:"none",
                    color:"#212121",display:"block", transition:"0.75s",
                    [media({        max:576})]:{fontSize:"50px"},
                    [media({min:576,max:768})]:{fontSize:"50px"},
                    [media({min:768        })]:{fontSize:"75px"},
                    ':hover':{color:"#f1f1f1"}},
        }
        return (
            <div style={styles.Item} onClick={this.props.click}>
                {this.props.children}
            </div>
        )
    }
}
export default Radium(TransItem);
