import React from 'react';
import Radium from 'radium';
import {MDBInput} from 'mdbreact'
//import AceEditor from 'react-ace';
//import "ace-builds/src-noconflict/mode-java";
//import "ace-builds/src-noconflict/theme-github";
class Hover extends React.Component {
    constructor(){
        super();
        this.inputElementRef = React.createRef();
    }
    render() {
        /*
        return (
            <div>
                <AceEditor
                    mode="Python"
                    theme="github"
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={ { $blockScrolling:true } }
                    onChange={()=>console.log('hi')} />
            </div>
        )
        */
        const p = this.props
        return(
            <div>
                <MDBInput type="textarea" label="textarea" rows="5"
                    value="test" onChange={p.change}
                    ref={this.inputElementRef}/>
            </div>
        )
    }
}

export default Radium(Hover);
