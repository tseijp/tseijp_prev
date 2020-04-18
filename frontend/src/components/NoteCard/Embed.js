import React from "react";
import Radium from "radium";
import ReactMarkdown from 'react-markdown';

import CodeBlock from "./CodeBlock";
class Embed extends React.Component {
    render() {
        const p = this.props;
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const styles = {
            homeembed:{transition:"0.5s",
                [media({max:576})]        :{height:"450px",borderRadius:"16px",},
                [media({min:576,max:768})]:{height:"450px",borderRadius:"20px",transition:"0.5s",},
                [media({min:768})]        :{height:"450px",borderRadius:"25px",transition:"0.5s",},},
            postedembed:{transition:"0.5s",
                [media({max:576})]        :{height:"700px",borderRadius:"16px",transition:"0.5s",},
                [media({min:576,max:768})]:{height:"700px",borderRadius:"20px",transition:"0.5s",},
                [media({min:768})]        :{height:"700px",borderRadius:"25px",transition:"0.5s",},},
            /*
            cardbody:{
                [media({max:576})]        :{padding:"0rem 16px 16px", height:"0",},
                [media({min:576,max:768})]:{padding:"0rem 20px 20px", height:"0",},
                [media({min:768})]        :{padding:"0rem 25px 25px", height:"0",},},
            cardhead:{
                [media({max:576})]        :{padding:"10px 0rem 0rem",margin:"0 0px",fontSize:"16px",},
                [media({min:576,max:768})]:{padding:"10px 0rem 0rem",margin:"0 0px",fontSize:"20px",},
                [media({min:768})]        :{padding:"10px 0rem 0rem",margin:"0 0px",fontSize:"25px",},},
            cardtext:{
                [media({max:576})]        :{textAlign:"justify",lineHeight:"16px",fontSize:"16px",},
                [media({min:576,max:768})]:{textAlign:"justify",lineHeight:"18px",fontSize:"18px",},
                [media({min:768})]        :{textAlign:"justify",lineHeight:"20px",fontSize:"20px",},},
            */
        }
        return (
            <div style={ {...styles[p.isHome?'homeembed':'postedembed']} }>
                <ReactMarkdown source={p.text} renderers={{ code:CodeBlock }} />
            </div>
        )
    }
}
export default Radium(Embed);
