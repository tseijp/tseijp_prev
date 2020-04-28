import React from "react";
import {MDBTooltip} from 'mdbreact'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
//import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { atomOneLight as style } from 'react-syntax-highlighter/dist/esm/styles/hljs';
//import { coy as style } from 'react-syntax-highlighter/dist/esm/styles/prism';
//SyntaxHighlighter.registerLanguage('javascript', js);

class MdCode extends React.PureComponent {
    constructor () {
        super();
        this.state = {isHover:false, isCopied:false}
    }
    click () {
        this.setState({isCopied:true})
    }
    render() {
        const p = this.props;
        const s = this.state;
        const styles = {
            tip  :{display:p.inline?"inline-block":"fixed",},
            clip :{display:p.inline?"inline-block":"fixed",verticalAlign:"top",height:1},
            light:{display:p.inline?"inline-block":"fixed",margin:"5px 5px",padding:"5px 5px"},
        }
        return (
            <MDBTooltip domElement tag="span" placement="bottom"
                style={styles.tip}>
                <span>{/*for position of tooltip*/}
                    {p.value &&
                    <CopyToClipboard text={p.value} style={styles.clip}
                        onCopy={()=>this.setState({isCopied: true})}>
                        <span>{/*for recognition by clicpboard*/}
                            <SyntaxHighlighter language={p.language}
                                showLineNumbers={!p.inline}
                                style={ {...style, ...styles.light} }>
                                {p.value}
                            </SyntaxHighlighter>
                        </span>
                    </CopyToClipboard>}
                </span>
                <span>{s.isCopied?"Copied !":"Click and Copy"}</span>
            </MDBTooltip>
        );
    }
}

export default MdCode;
