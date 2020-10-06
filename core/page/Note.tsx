import React, {FC, CSSProperties as CSS,useState, useMemo} from 'react'
import { Helmet } from 'react-helmet-async';
import { MDBInput, MDBBtn } from 'mdbreact'
import { Mdmd } from '@tsei/mdmd'
import { useGrid } from 'use-grid'
import { Card, Grow, Head, Icon } from '../src/components'
import { useNote, usePage, useUser } from '../src/hooks'
import { Modal, Notes, Pills, Sides, Trans } from '../src/containers'
import { customPage, CustomPage, pageConfig, fetcher, signin, scrollTop } from './utils'

const styles:{[key:string]:CSS} = {
    top: {minHeight:"100%",overflow:"hidden"},
}
export const Note :FC = () => {
    // ******************** FOR FETCH ******************** //
    const [page, setPage] = usePage<CustomPage>(customPage, pageConfig)
    const [note, setNote] = useNote(page.urls[1], fetcher)
    const [user, setUser] = useUser(page.urls[2], signin, {onSign:()=>setPage({status:""})})
    // ******************** FOR DESIGN ******************** //
    const [lang, setLang] = useState<string>(page.language)
    const [size, setSize] = useGrid <number>({md:1, lg:1.5})
    const [dark, setDark] = useGrid <number>({md:1, lg:0  })
    // ******************** FOR RENDER ******************** //
    const onView       = useMemo(()=>()=>setNote(p=>p?.next),[setNote])
    const onClick      = useMemo(()=>()=>setPage({id:""})   ,[setPage])
    const onSignin     = useMemo(()=>()=>setPage(p=>({status:p.status===  ""?"IN":""  })),[setPage])
    const onMouseEnter = useMemo(()=>()=>setPage(p=>({status:p.status==="UP"?"IN":"UP"})),[setPage])
    const [left,right] = useMemo(()=>{
        const style = {transform:"translate(-50%)",left:"50%",marginTop:size*50}
        return ["cooment","arrow-left"].map(fa => (<Icon {...{fa,size,style,onClick}}/>))
    }, [size,onClick])
    return (
        <div style={{...styles.top, background:dark?"#000":"#f1f1f1", paddingTop:size*100,}}>
            <Head {...{dark,size,onClick,}}>Note</Head>
            { note && note.results instanceof Array &&
            <Notes {...(page.isHome?{}:{size,left,right})}>{note.results.map(({
                ja_text="",//note_id="",author_name=null, //,posted_time=null,
                en_text="",     id="" }) =>
                <div key={id}>
                    <Card {...{...page.isHome?{max:500,onClick:()=>setPage({id:id+""})}:{size},dark,space:size*25}}>
                        <Mdmd color={dark?"dark":"elegant"} style={{fontSize:"1.2rem"}}
                             source={lang==="ja"?ja_text:en_text}/>
                    </Card>
                </div> )}
            </Notes> } { (!note || note.next) &&
            <Grow {...{size,onView,onClick:()=>setNote(p=>p?p?.next||p?.now:null )}} /> }
            {/******************** Modals ********************/}
            <Modal {...{dark,size,open:!!page.status,onClose:()=>setPage({status:""})}}>
                <Card {...{dark,size,style:{max:"100vh"},space:size*25}}>
                    <Head {...{dark,size,onMouseEnter}}>SIGN {user.isAuth?"OUT":page.status}</Head>
                    {!user.isAuth && user.input.map((v,k)=>v.name==="email"&&page.status!=="UP"?null:
                    <MDBInput {...v} key={k}/> )}
                    <MDBBtn color="elegant"
                        style={{width:"100%",borderRadus:size*50}}
                        onClick={()=>setUser(page.urls[2])}
                        children={user.isAuth?"Signout":"Get!"}/>
                </Card>
            </Modal>
            {/******************** FANTASTIC UI ********************/}
            <Sides {...{size}}>
                <a style={{color:"#818181"}} href="/"    >Home</a>
                <a style={{color:"#818181"}} href="/hook">Hook</a>
                <a style={{color:"#818181"}} href="/note">Note</a>
            </Sides>
            <Trans {...{size}}>
                <div onClick={()=>setLang(p=>p!=='ja'?'ja':'en')}>{lang.toUpperCase()}</div>
                <div onClick={()=>setDark((p:any)=>({md:p.lg,lg:p.md}))}>{dark?'🌞':'🌛'}</div>
                <div onClick={()=>setSize((p:any)=>({md:p.lg,lg:p.md}))}>{size>1?'👶':'👨'}</div>
            </Trans>
            <Pills {...{size}}>
                <Icon fa="ellipsis-h"        {...{dark,size}} onClick={()=>null}>
                    <Icon fa="arrow-left"    {...{dark,size}} onClick={onClick}/>
                    <Icon fa="location-arrow"{...{dark,size}} onClick={scrollTop}/>
                    <Icon fa="sign-in-alt"   {...{dark,size}} onClick={onSignin}/>
                </Icon>
            </Pills>
            <Helmet>
                <title>{note?"note":"Loading..."}</title>
                <meta charSet="utf-8" />
                <meta name="Hatena::Bookmark" content="nocomment" />
                <link rel="canonical" href="https://tsei.jp/" />
            </Helmet>
        </div>
    )
}

// TODO : make in last of note
// !isHome && (note.children||[]).map((child:any,i:number) =>
//     <Card {...{key:i,dark,size,style:{fontSize:"1.2rem"}}}>
//         <Mdmd source={child[`${lang}_text`]}/>
//     </Card>)
