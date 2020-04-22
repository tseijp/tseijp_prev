import React from 'react';
import Radium from 'radium';
import {MDBRow} from 'mdbreact';
//containers
import Layout from 'containers/Layout'
import NoteHead from 'containers/NoteHead';
import NoteCard from 'containers/NoteCard';
import NoteTail from 'containers/NoteTail';

// Import style files into the src/index.js before the App.js file:
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";


class App extends React.Component {
    url = "http://127.0.0.1:8000/api/"
    ///*************** for React ***********************/
    state = {
        header:{"Content-Type":"application/json",
        Authorization:"Token 0e588d0104bb5a19efd03e02cc408fdac08c2ae1"},
        context : {
            isDark:false, isHome:true, isAuth:true,
            tag:null, lang :'ja', author:'tseijp' },
        noteCards : [],
        noteMainId : null,
    };
    constructor () {
        super()
        this.getCard = this.getCard.bind(this);
        this.postCard= this.postCard.bind(this);
    }
    componentDidMount () {
        this.getCard();
    }
    ///*************** for state ***********************/
    setCard(cards, init=true){
        const isHome = this.state.context.isHome;
        const new_cards = (cards instanceof Array)?[...cards]:[cards]
        const pre_cards = [...this.state.noteCards];
        this.setState({noteCards:[]}) // reset state in NoteCard
        this.setState({
            noteCards : (init)?new_cards:pre_cards.map
                (card => new_cards.find(c=>c.id===card.id) || card )
        })
        const main = this.state.noteCards.find(n=>n.note_object===null)
        this.setState({
            noteMainId:(isHome && main)?null:main.id})
        console.log(this.state.noteMainId);
    }
    ///*************** for API ***********************/
    getCard (id=null) {
        const url = `${this.url}note/${id?id+'/':''}`
        fetch(url, {method:"GET", headers:this.state.header})
        .then(r=>r.json()).then(r=>this.setCard(r))
        .catch(err=>console.log(err));
        this.setState({context:{...this.state.context,isHome:id?false:true}});
    }
    postCard(data=null, id=null){
        const isHome = this.state.context.isHome;
        const body = data || {'ja_text':''}
        const url = `${this.url}note/${id?id+'/ajax/':''}`
        console.log(url);
        fetch(url, {method:"POST", headers:this.state.header, body:JSON.stringify(body)})
        .then(r=>r.json()).then(r=>{
            console.log(r);
            if(r.length && r instanceof Array){this.getCard()}
            else {this.setCard(r, isHome?true:false)}
        })
        .catch(err=>console.log(err));
        this.setState({context:{...this.state.context, isHome:false}});
    }
    ///*************** for Render ***********************/
    render(){
        const s = this.state;
        return(
            <Radium.StyleRoot>
            <Layout
                toJa={()=>this.setState({lang:'ja'})}
                toEn={()=>this.setState({lang:'en'})}>
                <NoteHead noteMainId={s.noteMainId}
                    getCard={this.getCard}
                    postCard={this.postCard}/>
                <MDBRow>
                {this.state.noteCards.map( (note,j) => { return (
                    <NoteCard key={j} {...note} {...s.context}
                        getCard={this.getCard} postCard={this.postCard}/>
                )} )}
                </MDBRow>
                <NoteTail noteMainId={s.noteMainId}
                    getCard={this.getCard}
                    postCard={this.postCard} />
            </Layout>
            </Radium.StyleRoot>
        );
    }
}

export default Radium(App);
