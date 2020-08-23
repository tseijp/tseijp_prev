import React from 'react';
import Radium from 'radium'
import {MDBCollapse} from 'mdbreact'
//import SideItem from './SideItem';
class SideItems extends React.Component {
    render () {
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const styles = {
            Items:{right:"10px",position:"fixed",
                [media({        max:576})]:{margin:"25px 10px 10px 25px",},
                [media({min:576,max:768})]:{margin:"25px 10px 10px 25px",},
                [media({min:768        })]:{margin:"25px 10px 10px 25px",},},
        };
        const p = this.props;
        return (
            <div style={styles.Items}>
                <MDBCollapse id="basicCollapse" isOpen={p.collapseID}>
                    {p.children}
                </MDBCollapse>
            </div>
        )
    }
}
export default Radium(SideItems);
