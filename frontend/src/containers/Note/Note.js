import React from 'react';
//import Radium from 'radium';
import {MDBRow} from 'mdbreact';
import {withCookies} from 'react-cookie';
//containers
import Layout   from 'containers/Layout'
import NoteHead from 'containers/Note/NoteHead';
import NoteCard from 'containers/Note/NoteCard';
import NoteTail from 'containers/Note/NoteTail';



class App extends React.Component {
    url = "http://127.0.0.1:8000/api/"
    ///*************** for React ***********************/
    constructor (props) {
        super()
        this.state = {
            authtoken  : props.cookies.get('authtoken'),
            noteCards  : [],
            noteMainId : null,
            context : { isDark:false, isHome:true, isAuth:true,
                        tag:null, lang :'ja', author:'tseijp' },
            header  : { "Content-Type":"application/json", },
        }
        this.getCard   = this.getCard.bind(this);
        this.postCard  = this.postCard.bind(this);
        this.deleteCard=this.deleteCard.bind(this);
    }
    componentDidMount () {
        console.log(this.state.authtoken);
        if (this.state.authtoken) {
            this.setState({
                header: {...this.state.header,
                            Authorization:`Token ${this.state.authtoken}`}
            })
            this.getCard();
        } else {
            window.location.href = '/login'
        }
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
        const main = this.state.noteCards.filter(n=>n.note_object===null)
        this.setState({
            noteMainId:(isHome && main)?null:main[0].id})
        //console.log(this.state.noteMainId);
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
        const body = data || {'ja_text':''}
        console.log(body);
        const url = `${this.url}note/${id?id+'/ajax/':''}`
        fetch(url, {method:"POST", headers:this.state.header, body:JSON.stringify(body)})
        .then(r=>r.json()).then(r=>{this.setCard(r, false)})
        .catch(err=>console.log(err));
        //this.setState({context:{...this.state.context, isHome:false}});
    }
    deleteCard(id){
        this.postCard({'delete_note':true}, id)
        const isToHome = this.state.noteMainId || this.state.noteMainId===id
        this.getCard(isToHome?null:id)
    }
    ///*************** for Render ***********************/
    render(){
        const s = this.state;
        return(
            <Layout
                toJa={()=>this.setState({lang:'ja'})}
                toEn={()=>this.setState({lang:'en'})}>
                <NoteHead noteMainId={s.noteMainId}
                    getCard={this.getCard}
                    postCard={this.postCard}/>
                <MDBRow>
                {this.state.noteCards.map( (note,j) => { return (
                    <NoteCard key={j} {...note} {...s.context}
                        getCard={this.getCard}
                        postCard={this.postCard}
                        deleteCard={this.deleteCard}/>
                )} )}
                </MDBRow>
                <NoteTail noteMainId={s.noteMainId}
                    getCard={this.getCard}
                    postCard={this.postCard} />
            </Layout>
        );
    }
}

export default withCookies(App);
