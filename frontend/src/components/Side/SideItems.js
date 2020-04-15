import React from 'react';
import Radium from 'radium'
class SideItems extends React.Component {
    render () {
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const styles = {
            Items:{position:"absolute",
                [media({        max:576})]:{margin:"50px 10px 10px 25px",},
                [media({min:576,max:768})]:{margin:"50px 10px 10px 25px",},
                [media({min:768        })]:{margin:"75px 10px 10px 25px",},},
        };
        return (
            <div style={styles.Items}>
                {this.props.children}
            </div>
        )
    }
}
export default Radium(SideItems);
