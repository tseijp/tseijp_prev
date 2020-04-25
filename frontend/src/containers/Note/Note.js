import axios from 'axios';
import React from 'react';
//import Radium from 'radium';
import {MDBRow} from 'mdbreact';
import {withCookies} from 'react-cookie';
//containers
import Layout   from 'containers/Layout'
import NoteHead from 'containers/Note/NoteHead';
import NoteCard from 'containers/Note/NoteCard';
import NoteTail from 'containers/Note/NoteTail';

class Note extends React.Component {
    url = "http://127.0.0.1:8000/api/"
    ///*************** for React ***********************/
    constructor (props) {
        super()
        this.state = {
            authtoken  : props.cookies.get('authtoken'),
            noteCards  : [],
            noteMainId : null,
            context : { isDark:false, isHome:true, isAuth:false,
                        tag:null, lang :'ja', author:'tseijp' },
            header  : { "Content-Type":"application/json", },
        }
        this.getCard   = this.getCard.bind(this);
        this.postCard  = this.postCard.bind(this);
    }
    componentDidMount () {
        if (this.state.authtoken) {
            this.setState({
                context:{...this.state.context, isAuth:true},
                header: {...this.state.header , Authorization:`Token ${this.state.authtoken}`}
            })
            this.getCard();
        } else {
            console.log(this.state.authtoken)
            window.location.href = '/user'
        }
    }
    ///*************** for state ***********************/
    setCard(cards, init=true){ //get => init=true // add or edit => init=false
        const noteCards = (cards instanceof Array)?[...cards]:[cards]
        const pre_cards = [...this.state.noteCards];
        const new_cards = noteCards.filter(n=>pre_cards.filter(p=>n.id===p.id).length===0)
        this.setState({noteCards:[]}) // reset noteCards keys in state
        this.setState({ noteCards : (init)?noteCards :
            [...(this.state.context.isHome?new_cards:[]),
             ...pre_cards.map(card=>noteCards.find(c=>c.id===card.id)||card ),
             ...(!this.state.context.isHome?new_cards:[]),]
        })
    }
    deleteCard(id){
        const isHome = [null,id].filter(v=>v===this.state.noteMainId).length?true:false
        const context = {...this.state.context, isHome}
        if (isHome){ this.getCard(); this.setState({context}); return; }
        this.setState({noteCards:this.state.noteCards.filter(n=>n.id!==id)});
    }
    ///*************** for API ***********************/
    getCard (id=null) {
        const url = `${this.url}note/${ id?id+'/':'' }`
        const headers = this.state.header;
        axios.get(url,{headers}).then(res=>{
            if(res.status===200){
                const context = {...this.state.context, isHome:id?false:true}
                this.setCard(res.data);
                this.setState({noteMainId:id, context})
            } console.log(res);
        }).catch(err=>console.log(err))
    }
    postCard(id=null, body=null){
        const url = `${this.url}note/${id?id+'/ajax/':''}`
        const data = body || {"delete_note":true}
        const headers = this.state.header;
        axios.post(url,data,{headers}).then(res=>{
            if(res.status===200){
                if(body===null){ this.deleteCard(id) ;};
                if(body!==null){ this.setCard(res.data, false) ;};
            }//add(null,{note_object:null}) or edit (321,{enText:'hello'})
            //console.log(res);
        }).catch(err=>console.log(err))
    }
    ///*************** for Render ***********************/
    render(){
        const s = this.state;
        return(
            <Layout {...s.context}
                toJa={()=>this.setState({lang:'ja'})}
                toEn={()=>this.setState({lang:'en'})}>
                <NoteHead
                    noteMainId={s.noteMainId}
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
                <NoteTail
                    noteMainId={s.noteMainId}
                    getCard={this.getCard}
                    postCard={this.postCard} />
            </Layout>
        );
    }
}

export default withCookies(Note);
