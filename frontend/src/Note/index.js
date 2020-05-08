import axios from 'axios';
import React from 'react';
//import Radium from 'radium';
import {MDBRow} from 'mdbreact';
import {withCookies} from 'react-cookie';
//containers
import Layout   from '../components/Layout'
import NoteHead from './NoteHead';
import NoteCard from './NoteCard';
import NoteTail from './NoteTail';

class Note extends React.Component {
    url = "http://127.0.0.1:8000/api/"
    ///*************** for React ***********************/
    constructor (props) {
        super()
        const authtoken = props.cookies.get('authtoken');
        const headers = { "Content-Type":"application/json",
                    ...(authtoken&&{Authorization:`Token ${authtoken}`})};
        const context = { isDark:false, isHome:true, tag:null, lang :'ja',
                          isAuth:(authtoken?true:false)};
        this.state = {
            authtoken, headers, context,
            noteCards  : [],
            noteMainId : null,
        }
        this.getCard   = this.getCard.bind(this);
        this.postCard  = this.postCard.bind(this);
    }
    componentDidMount () {
        if (this.state.authtoken) {
            this.getCard();
        } else {
            window.location.href = '/user'
        }
    }
    ///*************** for state ***********************/
    setCard(cards, mode='init'){ //get => init=true // add or edit => init=false
        const noteCards = (cards instanceof Array)?[...cards]:[cards]
        const pre_cards = [...this.state.noteCards];
        const new_cards = noteCards.filter(n=>pre_cards.filter(p=>n.id===p.id).length===0)
        //this.setState({noteCards:[]}) // reset noteCards keys in state
        this.setState({ noteCards : (mode==='init')?noteCards :
            [...(mode==='head'?new_cards:[]),
             ...pre_cards.map(card=>noteCards.find(c=>c.id===card.id)||card ),
             ...(mode==='tail'?new_cards:[]),]
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
        const headers = this.state.headers;
        axios.get(url,{headers}).then(res=>{
            if(res.status===200){
                const context = {...this.state.context, isHome:id?false:true}
                this.setCard(res.data);
                this.setState({noteMainId:id, context})
            }//console.log('get', res);
        }).catch(err=>console.log(err))
    }
    postCard(id=null, body=null){
        const url = `${this.url}note/${id?id+'/ajax/':''}`
        const data = body || {"delete_note":true}
        const headers = this.state.headers;
        axios.post(url,data,{headers}).then(res=>{
            if(res.status===201){//add(null,{note_object:null}) or edit (321,{enText:'hello'})
                const isAdd = Object.keys(data).map(v=>v==="note_object").every(v=>v===true)
                const isHome = this.state.context.isHome;
                if(body===null){ this.deleteCard(id) ;};
                if(body!==null && isAdd){ this.setCard(res.data, isHome?'head':'tail');};
            } //console.log('post',res);
        }).catch(err=>console.log(err))
    }
    ///*************** for Render ***********************/
    render(){
        const s = this.state;
        return(
            <Layout {...s.context}
                toJa={()=>this.setState({context:{...this.state.context, lang:'ja'}})}
                toEn={()=>this.setState({context:{...this.state.context, lang:'en'}})}>
                <NoteHead
                    {...s.context}
                    noteMainId={s.noteMainId}
                    getCard={this.getCard}
                    postCard={this.postCard}/>
                <MDBRow>
                {this.state.noteCards.map( (note,j) => { return (
                    <NoteCard {...note} {...s.context}
                        key={`card${note.id}`}
                        getCard={this.getCard}
                        postCard={this.postCard}
                        deleteCard={this.deleteCard}/>
                )} )}
                </MDBRow>
                <NoteTail
                    {...s.context}
                    noteMainId={s.noteMainId}
                    getCard={this.getCard}
                    postCard={this.postCard} />
            </Layout>
        );
    }
}

export default withCookies(Note);
