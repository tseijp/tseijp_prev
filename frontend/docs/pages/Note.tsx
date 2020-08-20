import React, {FC, Fragment, useState, useMemo} from 'react'
import { Helmet } from 'react-helmet-async';
import { useGrid } from 'use-grid'
import { Mdmd } from '@tsei/mdmd'
import { MDBInput, MDBBtn } from 'mdbreact'
import { Modal, Notes, Pills, Sides, Trans } from '../../src/containers'
import { Card, Foot, Head, Icon } from '../../src/components'
import { useUser, useNotes } from '../../src/hooks'
import { fetcher , signin } from '../utils'

export const Note :FC = () => {
    // ******************** FOR MANAGE ******************** //
    const [lang, setLang] = useState<string>(window.navigator.language||'ja')
    const [dark, setDark] = useGrid <boolean>({md:false, lg:true})
    const [size, setSize] = useGrid <number> ({md:1    , lg:1.5 })
    // ******************** FOR SIGNIN ******************** //
    const [sign, setSign] = useState<boolean>(false)
    const [user, setUser] = useUser({onSign:()=>setSign(false)})
    // ******************** FOR FETCH ******************** //
    const host = window.location.hostname==="localhost"?"http://localhost:8000":"https://tsei.jp"
    const home = window.location.pathname.split('/').filter(v=>v).length===1
    const [notes, setNotes] = useNotes([host,`api`,window.location.pathname, "/"],fetcher)
    // ******************** FOR RENDER ******************** //
    const styles = useMemo<React.CSSProperties[]>(()=>[ // its IconStyle
      { position:"absolute",transform:"translate(30%,-30%)"},
      { position:"relative",transform:"translate(-50%)",left:"50%"},
    ], [])
    return (
        <div style={{background:dark?"#000":"#f1f1f1",position:"relative",minHeight:"100vw",padding:size*100}}>
            <Helmet>
                <title>{notes?"note":"Loading..."}</title>
                <meta charSet="utf-8" />
                <meta name="Hatena::Bookmark" content="nocomment" />
                <link rel="canonical" href="//tsei.jp/" />
            </Helmet>
            <Head {...{dark,size}} onClick={()=>{
                setNotes([host,"api","note"])
                window.history.pushState('','',`/note/`)
            }}>Note</Head>
            { notes && notes instanceof Array
              ? <Notes size={false?size:1}
                    right={(<Icon fa="plus"   size={size} style={styles[1]} onOpen={()=>null}/>)}
                    left ={(<Icon fa="comment"size={size} style={styles[1]} onOpen={()=>null}/>)}>
                {notes.map(({id,ja_text,en_text},key) => <Fragment key={key}>
                    <Card {...{key,dark,size:false?size:1}}
                        onClick={home?()=>{
                            setNotes((p:any)=>[p,id,"/"])
                            window.history.pushState('','',`/note/${id}/`)
                        }:null}
                        style={{...(home?{height:500}:{}),fontSize:"1.2rem"}}>
                        <Mdmd source={lang==="ja"?ja_text:en_text}
                            color={dark?"dark":"elegant"}/>
                    </Card>
                    {/*!home && (note.children||[]).map((child:any,i:number) =>
                    <Card {...{key:i,dark,size,style:{fontSize:"1.2rem"}}}>
                        <Mdmd source={child[`${lang}_text`]}/>
                    </Card>)*/}
                </Fragment> )}
                </Notes>
              : <h1>Loading</h1>}
            {/* TODO <Icon size={size*2} fa="plus" style={styles[1]} onOpen={setNotes}/> */}
            {/******************** Modals ********************/}
            <Modal {...{dark,size,open:sign,onClose:()=>setSign(false)}}>
                <Card {...{dark,size}}>
                    <Icon fa="times" size={size} style={styles[0]} onOpen={()=>setSign(false)}/>
                    <Head {...{dark,size}}>SIGN {user.status}
                        <Icon fa="exchange-alt" color={dark?"#818181":"#fff"}
                          size={size} onOpen={()=>setUser()}/></Head>
                    {!user?.authtoken && <>
                    <MDBInput {...user?.input?.username} icon="user"/>
                    <MDBInput {...user?.input?.password} icon="lock"/> {user.status==="UP"&&
                    <MDBInput {...user?.input?.email} icon="envelope"/>}</>}
                    <MDBBtn color="elegant" style={{width:"100%",borderRadus:size*50}}
                        onClick={()=>setUser((cred:any)=>signin([
                            host,user.status==="IN"?"auth/":"api/user/"
                        ],cred))}>
                        {user.authtoken?"Signout":"Get!"}</MDBBtn>
                </Card>
            </Modal>
            {/******************** FANTASTIC UI ********************/}
            <Sides {...{size}}>
                <p onClick={()=>window.location.href="/"    }>Home</p>
                <p onClick={()=>window.location.href="/hook"}>Hook</p>
                <p onClick={()=>window.location.href="/note"}>Note</p>
            </Sides>
            <Trans {...{size}}>
                <div onClick={()=>setLang(p=>p!=='ja'?'ja':'en')}>{lang.toUpperCase()}</div>
                <div onClick={()=>setDark((p:any)=>({md:p.lg,lg:p.md}))}>{dark?'🌛':'🌞'}</div>
                <div onClick={()=>setSize((p:any)=>({md:p.lg,lg:p.md}))}>{size<75?'👶':'👨'}</div>
            </Trans>
            <Pills {...{size}}>
                <Icon fa="ellipsis-h"        color={dark?"#818181":"#fff"} size={size} onOpen={()=>null}>
                    <Icon fa="share-square"  color={dark?"#818181":"#fff"} size={size} onOpen={()=>null}/>
                    <Icon fa="sign-in-alt"   color={dark?"#818181":"#fff"} size={size} onOpen={()=>setSign(true)}/>
                    <Icon fa="location-arrow"color={dark?"#818181":"#fff"} size={size} onOpen={()=>null}/>
                </Icon>
            </Pills>
        </div>
    )
}
