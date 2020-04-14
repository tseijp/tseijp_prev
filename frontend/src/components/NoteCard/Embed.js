import React from "react";
import Radium from "radium";
import ReactMarkdown from 'react-markdown';

import CodeBlock from "./CodeBlock";
class Embed extends React.Component {
    render() {
        const p = this.props;
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const styles = {
            homeembed:{
                [media({max:576})]        :{height:"450px",borderRadius:"16px",transition:"0.5s",},
                [media({min:576,max:768})]:{height:"450px",borderRadius:"20px",transition:"0.5s",},
                [media({min:768})]        :{height:"450px",borderRadius:"25px",transition:"0.5s",},},
        }
        const exam = "# hi! \n hello world\n```\nimport numpy as np\nimport pandas as pd\n```"
        return (
            <div style={ {...styles[p.isHome?'homeembed':'postedembed']} }>
                <ReactMarkdown source={exam} renderers={{ code:CodeBlock }} />
            </div>
        )
    }
}
export default Radium(Embed);
