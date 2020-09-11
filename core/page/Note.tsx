import React, {FC, useState, useMemo} from 'react'
import { Helmet } from 'react-helmet-async';
import { MDBInput, MDBBtn } from 'mdbreact'
import { Mdmd } from '@tsei/mdmd'
import { useGrid } from 'use-grid'
import { Card, Grow, Head, Icon } from '../src/components'
import { useNote, usePage, useUser } from '../src/hooks'
import { Modal, Notes, Pills, Sides, Trans } from '../src/containers'
import { customPage, CustomPage, fetcher, signin } from './utils'

export const Note :FC = () => {
    // ******************** FOR FETCH ******************** //
    const [page, setPage] = usePage<CustomPage>(customPage)
    const [note, setNote] = useNote(page.urls[1], fetcher)
    const [user, setUser] = useUser(page.urls[2], signin, {onSign:()=>setPage({status:""})})
    // ******************** FOR DESIGN ******************** //
    const [lang, setLang] = useState<string> (window.navigator.language||'ja')// TODO:user.language
    const [dark, setDark] = useGrid <boolean>({md:true, lg:false})            // TODO:user.dark or not
    const [size, setSize] = useGrid <number> ({md:1   , lg:1.5  })
    // ******************** FOR RENDER ******************** //
    const onClick = useMemo(()=>()=>setPage({id:""}), [setPage])
    const onOpen  = useMemo(()=>()=>setPage(p=>({status:p.status==="UP"?"IN":"UP"})),[setPage])
    const onSign  = useMemo(()=>()=>setPage(p=>({status:p.status===  ""?"IN":""  })),[setPage])
    //const onView  = useMemo(()=>(e:any)=>e.isIntersecting&&setNote((p:any)=>p.next) ,[setNote])
    const styles  = useMemo<React.CSSProperties[]>(()=>[ // its IconStyle
      { position:"relative",transform:"translate(-50%)",left:"50%",marginTop:size*50 },
      { position:"relative",background:dark?"#000":"#f1f1f1",minHeight:"100%" },
    ], [size, dark])
    return (
        <div style={styles[1]}>
            <Helmet>
                <title>{note?"note":"Loading..."}</title>
                <meta charSet="utf-8" />
                <meta name="Hatena::Bookmark" content="nocomment" />
                <link rel="canonical" href="//tsei.jp/" />
            </Helmet>
            <Head {...{dark,size,onClick}} style={{padding:`${100*size}px 0 0 ${100*size}px`}}>Note</Head>
            { note && note.results instanceof Array ? <Notes size={page.isHome?1:size}
                left={page.isHome?undefined:(<Icon fa="comment"{...{size,onClick,style:styles[0]}}/>)}
               right={page.isHome?undefined:(<Icon fa="home"   {...{size,onClick,style:styles[0]}}/>)}>
                {note.results.map(({id,ja_text,en_text}) =>
                    <div key={id}>
                        <Card {...{dark,size:page.isHome?1:size,
                               ...(page.isHome?{style:{height:500}}:{})}}
                            onClick={page.isHome?()=>setPage({id}):null}>
                            <Mdmd color={dark?"dark":"elegant"} style={{fontSize:"1.2rem"}}
                                source={lang==="ja"?ja_text:en_text}/>
                        </Card>
                    </div> )}
            </Notes> : null}
            { page && page.urls instanceof Array && page.urls.map((u,i)=><h3 key={i}>{u.href}</h3>) }
            { note && note.previous && <h3>previous : {note.previous}</h3> }
            { note && note.next && <h3>next : {note.next}</h3> }
            {!note && page.isHome && <Grow {...{size}}/> }
            {(note && note.next)  && <Grow {...{size,onClick:()=>setNote((p:any)=>p.next)}}/> }
            {/******************** Modals ********************/}
            <Modal {...{dark,size,open:!!page.status,onClose:()=>setPage({status:""})}}>
                <Card {...{dark,size,style:{maxHeight:"100vh"}}}>
                    <Head {...{dark,size}}>SIGN {page.status}
                    <Icon fa="exchange-alt" {...{dark,size,onClick:onOpen}}/></Head>
                    { !user.isAuth && user.input.map((v,k)=>v.name==="email"&&page.status!=="UP"?null:
                    <MDBInput {...v} key={k}/> )}
                    <MDBBtn color="elegant" style={{width:"100%",borderRadus:size*50}}
                        onClick={()=>setUser(page.urls[2])}>
                        { user.isAuth?"Signout":"Get!" }</MDBBtn>
                </Card>
            </Modal>
            {/******************** FANTASTIC UI ********************/}
            <Sides {...{size}}>
                <p onClick={()=>window.location.href="/"    }>Home</p>
                <p onClick={()=>window.location.href="/note"}>Note</p>
            </Sides>
            <Trans {...{size}}>
                <div onClick={()=>setLang(p=>p!=='ja'?'en':'ja')}>{lang.toUpperCase()}</div>
                <div onClick={()=>setDark((p:any)=>({md:p.lg,lg:p.md}))}>{dark?'🌞':'🌛'}</div>
                <div onClick={()=>setSize((p:any)=>({md:p.lg,lg:p.md}))}>{size<75?'👨':'👶'}</div>
            </Trans>
            <Pills {...{size}}>
                <Icon fa="ellipsis-h"        {...{dark,size}} onClick={()=>null}>
                    <Icon fa="share-square"  {...{dark,size}} onClick={()=>null}/>
                    <Icon fa="location-arrow"{...{dark,size}} onClick={()=>null}/>
                    <Icon fa="sign-in-alt"   {...{dark,size}} onClick={onSign}/>
                </Icon>
            </Pills>
        </div>
    )
}

// TODO : make in last of note
// !isHome && (note.children||[]).map((child:any,i:number) =>
//     <Card {...{key:i,dark,size,style:{fontSize:"1.2rem"}}}>
//         <Mdmd source={child[`${lang}_text`]}/>
//     </Card>)
