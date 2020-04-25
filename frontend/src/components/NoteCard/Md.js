import React from "react";
import Radium from "radium";
import ReactMarkdown from 'react-markdown';
import CodeBlock from "./CodeBlock";

class Md extends React.Component {
    render() {
        const p = this.props;
        return (
                <ReactMarkdown source={p.text} renderers={{ code:CodeBlock }} />
        )
        /*
        homeembed:{transition:"0.5s", overflow:"hidden", minHeight:"450px",
            [media({max:576})]        :{height:"450px",},//borderRadius:"16px",},
            [media({min:576,max:768})]:{height:"450px",},//borderRadius:"20px",},
            [media({min:768})]        :{height:"450px",},},//borderRadius:"25px",},},
        postedembed:{transition:"0.5s", overflow:"hidden",
            [media({max:576})]        :{height:"700px",},//borderRadius:"16px",},
            [media({min:576,max:768})]:{height:"700px",},//borderRadius:"20px",},
            [media({min:768})]        :{height:"700px",},},//borderRadius:"25px",},},
            */
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
}
export default Radium(Md);
