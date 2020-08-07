import React, {FC, Fragment, useState, useMemo} from 'react'
import { Helmet } from 'react-helmet-async';
import { Card, Foot, Head, Icon } from '../../src/components'
import { Modal, Notes, Pills, Sides, Trans } from '../../src/containers'
import { useUser, useNotes } from '../../src/hooks'
import { useGrid } from 'use-grid'
import { MDBInput, MDBBtn } from 'mdbreact'
//import { Mdmd } from '@tsei/mdmd'
import {signin} from '../utils'

export const Note :FC = () => {
    // ******************** FOR MANAGE ******************** //
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:true})
    const [size, setSize] = useGrid<number> ({md:1    , lg:1.5 })
    // ******************** FOR SIGNIN ******************** //
    const [sign, setSign] = useState<boolean>(true)
    const [user, setUser] = useUser({onSign:()=>setSign(false)})
    const url = useMemo(()=>`${"http://localhost:8000"}/${user.status==="IN"?"auth/":"api/user/"}`,[user])
    // ******************** FOR FETCH ******************** //
    const [notes, setNotes] = useNotes([{ ja_text:'hello', children:[{ja_text:'im child'}] }])
    // const ref = useVisible(()=>{return ()=>null}, []) //TODO
    // ******************** FOR RENDER ******************** //
    const styles = useMemo<React.CSSProperties[]>(()=>[ // its IconStyle
      { position:"absolute",transform:"translate(30%,-30%)"},
      { position:"relative",transform:"translate(-50%)",left:"50%"},
    ], [])
    return (
    <div style={{background:dark?"#000":"#f1f1f1",position:"relative",minHeight:"100vw",padding:size*100}}>
        <Helmet>
            <title>note</title>
            <meta charSet="utf-8" />
            <meta name="Hatena::Bookmark" content="nocomment" />
            <link rel="canonical" href="//tsei.jp/" />
        </Helmet>
        <Head {...{dark,size}}>Note</Head>
        <Foot {...{dark,size}}>ⓒtsei</Foot>
        <Notes {...{size}}
            right={(<Icon fa="plus"   size={size} style={styles[1]} onOpen={()=>null}/>)}
            left ={(<Icon fa="comment"size={size} style={styles[1]} onOpen={()=>null}/>)}>
        {(notes||[]).map((note,key)=><Fragment key={key}>
            <Card {...{key,dark,size}}>{note.ja_text}</Card>
            {(note.children||[]).map((child,i) =>
                <Card {...{key:i,dark,size}}>{child.ja_text}</Card>)}
        </Fragment> )}
        </Notes>
        <Icon size={size*2} fa="plus" style={styles[1]} onOpen={setNotes}/>
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
                <MDBBtn onClick={()=>setUser((cred:any)=>signin(url,cred))} color="elegant"
                    style={{width:"100%",borderRadus:size*50}}>
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
