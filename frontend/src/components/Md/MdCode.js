import React from "react";
import {MDBTooltip} from 'mdbreact'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yLight as style } from 'react-syntax-highlighter/dist/esm/styles/hljs';

class MdCode extends React.PureComponent {
    state = {isHover:false, isCopied:false}
    click () {
        this.setState({isCopied:true})
    }
    render() {
        const p = this.props;
        const s = this.state;
        const styles = {
            tip  :{display:p.inline?"inline-block":"block",margin:"2px 2px"},
            clip :{display:p.inline?"inline-block":"block",height:1,verticalAlign:"top"},
            light:{display:p.inline?"inline-block":"block"},
        }
        return (
            <MDBTooltip domElement tag="span" placement="bottom"
                style={styles.tip}>
                <span>{/*for position of tooltip*/}
                    <CopyToClipboard text={p.value} style={styles.clip}
                        onCopy={()=>this.setState({isCopied: true})}>
                        <span>{/*for recognition by clicpboard*/}
                            <SyntaxHighlighter language={p.language}
                                showLineNumbers={!p.inline}
                                style={ {...style, ...styles.light} }>
                                {p.value}
                            </SyntaxHighlighter>
                        </span>
                    </CopyToClipboard>
                </span>
                <span>{s.isCopied?"Copied !":"Click and Copy"}</span>
            </MDBTooltip>
        );
    }
}

export default MdCode;
