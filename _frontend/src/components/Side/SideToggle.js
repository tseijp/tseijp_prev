import React from 'react';
import Radium from 'radium';
class SideToggle extends React.Component {
    render () {
        const p = this.props;
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        //const shadow=a=>`${a[0]}px ${a[1]}px ${a[2]}px rgba(0,0,0,${a[3]})`
        const styles = {
            Toggle:{left:p.isOpen?"200px":"25px",top:"25px",position:"absolute",
                    color:p.isOpen?"#2E2E2E":"#212121", cursor:"pointer",transition:"0.75s",},
            Icon : {
                    [media({        max:576})]:{fontSize:"50px"},
                    [media({min:576,max:768})]:{fontSize:"50px"},
                    [media({min:768        })]:{fontSize:"75px"},},
        }
        return (
            <div className="fixed-top">
                <div style={styles.Toggle} onClick={p.openSide}>
                    <i className={"fas fa-"+(p.isOpen?"angle-left":"align-justify")} style={styles.Icon} />
                </div>
            </div>
        )
    }
}
export default Radium(SideToggle);
