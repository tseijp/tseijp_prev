import React, {FC, useState, useCallback, useMemo} from 'react'
import { Helmet } from 'react-helmet-async';
import { MDBInput, MDBBtn } from 'mdbreact'
import { Mdmd } from '@tsei/mdmd'
import { useGrid } from 'use-grid'
import { fetcher, signin } from './utils'
import { Card, Grow, Head, Icon } from '../src/components'
import { useNotes, usePages, useUser } from '../src/hooks'
import { Modal, Notes, Pills, Sides, Trans } from '../src/containers'

export const Note :FC = () => {
    // ******************** FOR PAGES ******************** //
    const [pages, setPages] = usePages<{id:string,c:number,home:boolean}>({
        id: window.location.pathname.split('/')[2]||null, c:-1,
        ...(window.location.hostname==="localhost"?{portname:["3000","8000"]}:{}),
        home:({id}:any)=>!id, search:({c})=>["",c>0?`?c=${c}`:"",""],
        pathname:({id}:any) =>[`/note/${id?id+'/':''}`,`/api/note/${id?id+'/':''}`,''],
    })
    // ******************** FOR FETCH ******************** //
    const [notes,setNotes]= useNotes((pages.url as any)[1].href, fetcher)
    const [sign, setSign] = useState(false)
    const [user, setUser] = useUser({onSign:()=>setSign(false)}) //TODO : merge signin
    // ******************** FOR DESIGN ******************** //
    const [lang, setLang] = useState<string> (window.navigator.language||'ja')// TODO:user.language
    const [dark, setDark] = useGrid <boolean>({md:true, lg:false})            // TODO:user.dark or not
    const [size, setSize] = useGrid <number> ({md:1   , lg:1.5  })
    // ******************** FOR RENDER ******************** //
    const onClick = useCallback(()=>setPages({id:null,c:-1}), [setPages])
    const styles = useMemo<React.CSSProperties[]>(()=>[ // its IconStyle
      { position:"relative",transform:"translate(-50%)",left:"50%",marginTop:size*50 },
      { position:"relative",background:dark?"#000":"#f1f1f1",minHeight:"100%" },
      { position:"absolute",transform:"translate(30%,-30%)" },
    ], [size])
    React.useEffect(()=>{
        setNotes((pages.url as any)[1]);
        window.history.pushState('','', (pages.pathname as any)[0]||'')
    }, [pages, setNotes])
    console.log(pages)
    return (
        <div style={styles[1]}>
            <Helmet>
                <title>{notes?"note":"Loading..."}</title>
                <meta charSet="utf-8" />
                <meta name="Hatena::Bookmark" content="nocomment" />
                <link rel="canonical" href="//tsei.jp/" />
            </Helmet>
            <Head {...{dark,size,onClick}} style={{padding:`${100*size}px 0 0 ${100*size}px`}}>Note</Head>
            { notes && notes instanceof Array ? <Notes size={pages.home?1:size}
                left={pages.home?undefined:(<Icon fa="comment"{...{size,onClick,style:styles[0]}}/>)}
               right={pages.home?undefined:(<Icon fa="home"   {...{size,onClick,style:styles[0]}}/>)}>
                {notes.map(({id,ja_text,en_text},key) =>
                    <div key={`${id}${pages.home?'':key}`}>
                        <Card {...{dark,size:pages.home?1:size}}
                            onClick={pages.home?()=>setPages({id,c:-1}):null}
                            style={{...(pages.home?{height:500}:{}),fontSize:"1.2rem"}}>
                            <h3>{id}</h3>
                            <Mdmd color={dark?"dark":"elegant"}
                                source={lang==="ja"?ja_text:en_text}/>
                        </Card>
                    </div> )}
            </Notes> : <Grow />}
            { notes && <h3>{notes[notes.length-1].id}</h3>}
            { notes && pages.home && <Icon size={size} fa="plus" style={styles[0]}
                            onClick={()=>setPages({c:notes[notes.length-1].id})}/> }
            { pages && pages.url instanceof Array && pages.url.map(u=><h3>{u.href}</h3>) }
            {/******************** Modals ********************/}
            <Modal {...{dark,size,open:sign,onClose:()=>setSign(false)}}>
                <Card {...{dark,size}}>
                    <Icon fa="times" {...{size,style:styles[2]}} onOpen={()=>setSign(false)}/>
                    <Head {...{dark,size}}>SIGN {user.status}
                        <Icon fa="exchange-alt" {...{dark,size}}
                          size={size} onOpen={()=>setUser()}/>
                         </Head>
                    { !user?.authtoken && <>
                        <MDBInput {...user?.input?.username} icon="user"/>
                        <MDBInput {...user?.input?.password} icon="lock"/> {user.status==="UP"&&
                        <MDBInput {...user?.input?.email} icon="envelope"/>}
                    </> }
                    <MDBBtn color="elegant" style={{width:"100%",borderRadus:size*50}}
                        onClick={()=>setUser((cred:any)=>signin([
                            (pages.url as any)[3].href,user.status==="IN"?"auth/":"api/user/"
                        ],cred))}>{ user.authtoken?"Signout":"Get!" }
                    </MDBBtn>
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

// TODO : make in last of note
// !home && (note.children||[]).map((child:any,i:number) =>
//     <Card {...{key:i,dark,size,style:{fontSize:"1.2rem"}}}>
//         <Mdmd source={child[`${lang}_text`]}/>
//     </Card>)
