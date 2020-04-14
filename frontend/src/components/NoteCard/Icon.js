import React from 'react';
import Radium from 'radium';
class Icons extends React.Component {
    render(){
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const styles = {
            icon:{textAlign:"center", margin:"0 auto",transition: "0.75s",
                [media({max:576})]        :{lineHeight:"16px",fontSize:"16px",},
                [media({min:576,max:768})]:{lineHeight:"18px",fontSize:"18px",},
                [media({min:768})]        :{lineHeight:"25px",fontSize:"25px",},
                ':hover':{color:"rgba(0,0,0,0.25)",},
            }
        }
        const p = this.props;
        return(
            <Radium.StyleRoot>
                    <i style={styles.icon} className={"fas "+p.icon} onClick={p.click} />
                    {p.children}
            </Radium.StyleRoot>
        )
    }
}

export default Radium(Icons);
