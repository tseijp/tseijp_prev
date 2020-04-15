import React from 'react';
import Radium from 'radium';
import {MDBRow} from 'mdbreact';
//components
import Layout from 'components/Layout'
//containers
import Tool from 'containers/Tool';
import NoteCard from 'containers/NoteCard';
import NoteContext from 'contexts/NoteContext';
//dev
import NoteExample from 'dev/NoteExample';
// Import style files into the src/index.js before the App.js file:
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";


class App extends React.Component {
    constructor () {
        super()
        this.state = {
            noteContext:{isDark:false, isHome:true, isAuth:false},
            noteCards : NoteExample.map(note=>({
                user:'tseijp',time:'now',like:'20',
                jaText:note.ja_text,enText:note.en_text,  })),
            lang :'ja',
        };
    }
    addNoteCard () {
        this.setState({noteCards:{...this.state.noteCards}})
    }
    render(){
        const s = this.state;
        return(
            <NoteContext.Provider value={ this.state.noteContext }>
            <Radium.StyleRoot>
            <Layout
                toJa={()=>this.setState({lang:'ja'})}
                toEn={()=>this.setState({lang:'en'})}>
                <Tool />
                <MDBRow>
                {/* ここだけを for note in object_list に変える */}
                {this.state.noteCards.map((note,i)=>
                    <NoteCard key={i}
                        user={note.user} time={note.time} like={note.like} lang={s.lang}
                        jaText={note.jaText} enText={note.enText}/>
                )}
                </MDBRow>
            </Layout>
            </Radium.StyleRoot>
            </NoteContext.Provider>
        );
    }
}

export default Radium(App);
