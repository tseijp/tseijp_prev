import React from 'react';
import Radium from 'radium';
import {MDBRow} from 'mdbreact';
//components
import Layout from 'components/Layout'
//containers
import NoteHead from 'containers/NoteHead';
import NoteCard from 'containers/NoteCard';
import NoteTail from 'containers/NoteTail';
import NoteContext from 'contexts/NoteContext';
//dev
import Auxil from 'hoc/Auxil'
import NoteExample from 'dev/NoteExample';
// Import style files into the src/index.js before the App.js file:
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";


class App extends React.Component {
    constructor () {
        super()
        this.addCard = this.addCard.bind(this);
        this.state = {
            noteContext:{isDark:false, isHome:false, },
            noteCards : NoteExample.map(note=>({
                id:note.id, user:'tseijp', like:'20', time:'now',
                jaText:note.ja_text, enText:note.en_text,
                reply:note.reply?note.reply.map(reply=>({
                    user:'tseijp', like:'0', time:'now',
                    jaText:reply.ja_text, enText:reply.en_text,
                })):[]
            })),
            lang :'ja', author:'tseijp'
        };
    }
    addCard () {
        this.setState({noteCards:[
            ...this.state.noteCards,
            {user:'',time:"now",like:"0",jaText:"",enText:""},]})
    }
    render(){
        const s = this.state;
        return(
            <NoteContext.Provider value={ this.state.noteContext }>
            <Radium.StyleRoot>
            <Layout
                toJa={()=>this.setState({lang:'ja'})}
                toEn={()=>this.setState({lang:'en'})}>
                <NoteHead addCard={this.addCard}/>
                <MDBRow>
                    {this.state.noteCards.map(
                        (note,j) => { return (
                            <Auxil>
                                <NoteCard key={j} {...note}
                                    lang={s.lang} aithor={s.author}/>
                                {note.reply&&note.reply.map((reply,i)=>
                                    <NoteCard key={i} {...reply}
                                        lang={s.lang} author={s.author}/>
                                )}
                            </Auxil>
                        )}
                    )}
                    <NoteTail addCard={this.addCard}/>
                </MDBRow>
            </Layout>
            </Radium.StyleRoot>
            </NoteContext.Provider>
        );
    }
}

export default Radium(App);
