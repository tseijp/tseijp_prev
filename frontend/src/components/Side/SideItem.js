import React from 'react';
import Radium from 'radium';
class SideItem extends React.Component {
    render () {
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const styles = {
            Item : {padding:"10px 10px 10px 32px",textDecoration:"none",
                    color:"#818181",display:"block", transition:"0.75s",
                    [media({        max:576})]:{fontSize:"20px"},
                    [media({min:576,max:768})]:{fontSize:"25px"},
                    [media({min:768        })]:{fontSize:"50px"},
                    ':hover':{color:"#f1f1f1"}},
        }
        return (
            <div  style={styles.Item}>
                {this.props.children}
            </div>
        )
    }
}
export default Radium(SideItem);
