import React from 'react';
import Radium from 'radium';
import {MDBRow} from 'mdbreact';
//containers
import Layout from 'containers/Layout'
import NoteHead from 'containers/NoteHead';
import NoteCard from 'containers/NoteCard';
import NoteTail from 'containers/NoteTail';
//dev
import Auxil from 'hoc/Auxil'
//import NoteExample from 'dev/NoteExample';
// Import style files into the src/index.js before the App.js file:
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";


class App extends React.Component {
    url = "http://127.0.0.1:8000/api/"
    state = {
        header:{"Content-Type":"application/json",},
        context : {
            isDark:false, isHome:false, isAuth:false,
            tag:null, lang :'ja', author:'tseijp' },
        noteCards : []
    };
    constructor () {
        super()
        this.addCard = this.addCard.bind(this);
        this.getCard = this.getCard.bind(this);
        this.postCard= this.postCard.bind(this);
    }
    componentDidMount () {
        this.getCard();
    }
    addCard () {
        this.setState({noteCards:[
            ...this.state.noteCards,
            {user:'',time:"now",like:"0",jaText:"",enText:""},]})
    }
    getCard (id=null) {
        const url = `${this.url}note/${id?id+'/':''}`
        fetch(url, {method:"GET", headers:this.state.header}).then(r=>r.json()).then(res=>{
            this.setState({
                isHome:(id?false:true),
                noteCards :(id?[res]:res).map(note=>(//-------------------------------
                    {   id:note.id, user:'tseijp',
                        like:'20', time:'now',
                        jaText:note.ja_text,
                        enText:note.en_text,
                        reply:(!this.state.isHome && note.reply)?note.reply.map(reply=>(
                          { id:reply.id, user:'tseijp',
                            like:'0', time:'now',
                            jaText:reply.ja_text,
                            enText:reply.en_text,      }
                        )):[]                                              }
                )),//---------------------------------------------------------------
        })}).catch(err=>console.log(err))
    }
    postCard(){}
    render(){
        const s = this.state;
        return(
            <Radium.StyleRoot>
            <Layout
                toJa={()=>this.setState({lang:'ja'})}
                toEn={()=>this.setState({lang:'en'})}>
                <NoteHead addCard={this.addCard}/>
                <MDBRow>
                {this.state.noteCards.map( (note,j) => { return (
                    <Auxil key={j}>
                        <NoteCard key={j} {...note} {...s.context} author={s.author}
                            getCard={this.getCard} postCard={this.postCard}/>
                        {note.reply&&note.reply.map((reply,i)=>
                            <NoteCard key={i} {...reply} lang={s.lang} author={s.author}
                                getCard={this.getCard} postCard={this.postCard}/>
                        )}
                    </Auxil>
                )} )}
                </MDBRow>
                <NoteTail addCard={this.addCard}/>
            </Layout>
            </Radium.StyleRoot>
        );
    }
}

export default Radium(App);
