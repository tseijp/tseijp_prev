import React from "react";
import Radium from "radium";
import MathJax from 'react-mathjax';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';

import MdCode from "./MdCode";

class Md extends React.Component {
    constructor (props) {
        super();
        this.state = {
            plugins : [RemarkMathPlugin],
            renderers:{
                paragraph :props=><div {...props}/>,
                code      :props=><MdCode language="python" value={props.value}/>,
                inlineCode:props=><MdCode language="python" value={props.value} inline/>,
                math      :props=><MathJax.Node formula={props.value}/>,
                inlineMath:props=><MathJax.Node formula={props.value} inline/>,
                ...props.renderers,
            },
        };
    }
    render() {
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ');
        const style = {padding:"0 25px 0 25px", lineHeight:1.5,
            [media({max:576})]        :{textAlign:"justify",fontSize:"16px",},
            [media({min:576,max:768})]:{textAlign:"justify",fontSize:"18px",},
            [media({min:768})]        :{textAlign:"justify",fontSize:"20px",},};
        const p = this.props;
        return (
            <div style={style} >
                <MathJax.Provider input="tex">
                    <ReactMarkdown source={p.text} {...this.state}/>
                </MathJax.Provider>
            </div>
        )
    }
}
export default Radium(Md);
