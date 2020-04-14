import React from 'react';
import Radium from 'radium';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
class Hover extends React.Component {
    render() {
        return (
            <div>Hover
                <AceEditor
                    mode="Python"
                    theme="github"
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={ { $blockScrolling:true } }
                    onChange={()=>console.log('hi')} />
            </div>
        )
    }
}

export default Radium(Hover);
