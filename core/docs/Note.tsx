import React, {FC, useState, useCallback, useMemo} from 'react'
import { Helmet } from 'react-helmet-async';
import { MDBInput, MDBBtn } from 'mdbreact'
import { Mdmd } from '@tsei/mdmd'
import { useGrid } from 'use-grid'
import { fetcher , signin } from './utils'
import { useUser, useNotes } from '../src/hooks'
import { Card, Grow, Head, Icon } from '../src/components'
import { Modal, Notes, Pills, Sides, Trans } from '../src/containers'

export const Note :FC = () => {
    // ******************** FOR SIGNIN ******************** //
    const [sign, setSign] = useState<boolean>(false)
    const [user, setUser] = useUser({onSign:()=>setSign(false)})
    // ******************** FOR FETCH ******************** //
    // const [pages, setPages] = usePages([]) // TODO : This Handle host and home
    const host = window.location.hostname==="tsei.jp"?"https://tsei.jp":"http://localhost:8000"
    const home = window.location.pathname.split('/').filter(v=>v).length===1
    const [notes, setNotes] = useNotes([host,`api`,window.location.pathname, "/"],fetcher)
    // ******************** FOR DESIGN ******************** //
    const [lang, setLang] = useState<string>(window.navigator.language||'ja') // TODO:pages.language
    const [dark, setDark] = useGrid <boolean>({md:true, lg:false})            // TODO:pages.dark or not
    const [size, setSize] = useGrid <number> ({md:1   , lg:1.5  })
    // ******************** FOR RENDER ******************** //
    const styles = useMemo<React.CSSProperties[]>(()=>[ // its IconStyle
      { position:"absolute",transform:"translate(30%,-30%)" },
      { position:"relative",transform:"translate(-50%)",left:"50%",marginTop:size*50},
    ], [size])
    const onClick = useCallback(()=>{
        setNotes([host,"api/note/"])
        window.history.pushState('','',`/note/`)
    }, [host, setNotes])
    console.log(`Render Note Page`)
    return (
        <div style={{position:"relative",background:dark?"#000":"#f1f1f1",minHeight:"100%"}}>
            <Helmet>
                <title>{notes?"note":"Loading..."}</title>
                <meta charSet="utf-8" />
                <meta name="Hatena::Bookmark" content="nocomment" />
                <link rel="canonical" href="//tsei.jp/" />
            </Helmet>
            <Head {...{dark,size,onClick}} style={{padding:`${100*size}px 0 0 ${100*size}px`}}>Note</Head>
            { notes && notes instanceof Array
              ? <Notes size={home?1:size} right={home?undefined:(
                    <Icon fa="home" {...{size,onClick,style:styles[1]}}/>
                )} left={home?undefined:(
                    <Icon fa="comment" {...{size,onClick,style:styles[1]}}/>
                )}>
                {notes.map(({id,ja_text,en_text},key) =>
                    <div key={`${id}${home?'':key}`}>
                        <Card {...{dark,size:home?1:size}}
                            onClick={home?()=>{
                                setNotes([host,`api/note/${id}/`])
                                window.history.pushState('','',`/note/${id}/`)
                            }:null}
                            style={{...(home?{height:500}:{}),fontSize:"1.2rem"}}>
                            <div>{id}-{home?'':key}</div>
                            <Mdmd source={lang==="ja"?ja_text:en_text}
                                color={dark?"dark":"elegant"}/>
                        </Card>
                        {/*!home && (note.children||[]).map((child:any,i:number) =>
                        <Card {...{key:i,dark,size,style:{fontSize:"1.2rem"}}}>
                            <Mdmd source={child[`${lang}_text`]}/>
                        </Card>)*/}
                    </div> )}
                </Notes>
              : <Grow />}
            { notes && <Icon size={size} fa="plus" style={styles[1]}/> }
            {/******************** Modals ********************/}
            <Modal {...{dark,size,open:sign,onClose:()=>setSign(false)}}>
                <Card {...{dark,size}}>
                    <Icon fa="times" {...{size,style:styles[0]}} onOpen={()=>setSign(false)}/>
                    <Head {...{dark,size}}>SIGN {user.status}
                        <Icon fa="exchange-alt" {...{dark,size}}
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
                <Icon fa="ellipsis-h"        {...{dark,size}} onOpen={()=>null}>
                    <Icon fa="share-square"  {...{dark,size}} onOpen={()=>null}/>
                    <Icon fa="sign-in-alt"   {...{dark,size}} onOpen={()=>setSign(true)}/>
                    <Icon fa="location-arrow"{...{dark,size}} onOpen={()=>null}/>
                </Icon>
            </Pills>
        </div>
    )
}
