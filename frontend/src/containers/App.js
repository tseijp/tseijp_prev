import React from 'react';
import Radium from 'radium';
import {MDBRow} from 'mdbreact';
//components
import Layout from 'components/Layout'
import NoteCard from 'components/NoteCard/NoteCard';
import Tool from 'containers/Tool';
import NoteContext from 'contexts/NoteContext';
//dev
import NoteExample from 'dev/NoteExample';
// Import style files into the src/index.js before the App.js file:
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";


class App extends React.Component {
    constructor() {
        super()
        this.state = {
            noteContext:{isDark:false, isHome:true, isAuth:false, tag:'',}
        };
    }
    render(){
        return(
            <NoteContext.Provider value={ {isDark:false, isHome:true, isAuth:false, tag:'',} }>
            <Radium.StyleRoot>
            <Layout>
                <Tool />
                <MDBRow>
                {/* ここだけを for note in object_list に変える */}
                {NoteExample.map((note,i)=>
                    <NoteCard key={i} noteId={note.id}
                        user={ note.posted_user } time={ note.posted_time }
                        like={ note.liked_number } reply={ note.reply_number }
                        content={ {
                            posted_tag:note.posted_img,
                            posted_img:note.posted_img,
                            ja_head : note.ja_head,
                            ja_text : note.ja_text,
                            en_head : note.en_head,
                            en_text : note.en_text,
                        } }/>
                )}
                </MDBRow>
            </Layout>
            </Radium.StyleRoot>
            </NoteContext.Provider>
        );
    }
}

export default Radium(App);
