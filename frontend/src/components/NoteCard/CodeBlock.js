import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/styles/prism";
import { atomOneDarkReasonable as style } from 'react-syntax-highlighter/dist/esm/styles/hljs';

class CodeBlock extends React.PureComponent {
    static defaultProps = {
        language: "python"
    };

    render() {
        const { language, value } = this.props;
        return (
            <SyntaxHighlighter language={language} style={style}>
                {value}
            </SyntaxHighlighter>
        );
    }
}

export default CodeBlock;
