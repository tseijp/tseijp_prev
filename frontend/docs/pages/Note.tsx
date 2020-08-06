import React, {FC, useState, useCallback, useMemo} from 'react'
import { Card, Foot, Head, Icon } from '../../src/components'
import { Modal, Notes, Pills, Sides, Trans } from '../../src/containers'
import { useUser, useNotes } from '../../src/hooks'
import { useGrid } from 'use-grid'
import { MDBInput, MDBBtn } from 'mdbreact'
//import { Mdmd } from '@tsei/mdmd'

export const Note :FC = () => {
    // ******************** FOR MANAGE ******************** //
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:false})
    const [size, setSize] = useGrid<number> ({md:1    , lg:1.5  })
    // ******************** FOR SIGNIN ******************** //
    const login = useCallback(()=>({username:"",authtoken:""}),[]) //TODO
    const [sign, setSign] = useState<boolean>(false)
    const [inup, setINUP] = useState<string[]>(['IN','UP'])
    const [user, setUser] = useUser(()=>login(), [login])
    const [cred, setCred] = useState({username:user?.username as string||'',password:'',email:''})
    const onChange = useCallback(({target})=>setCred(p=>({...p,[target.name]:target.value})),[])
    // ******************** FOR FETCH ******************** //
    const [notes, setNotes] = useNotes([{ ja_text:'hello', children:[{ja_text:'im child'}] }])
    // const ref = useVisible(()=>{return ()=>null}, [])
    // ******************** FOR RENDER ******************** //
    const styles = useMemo<React.CSSProperties[]>(()=>[
      { background:`rgba(${dark?"80,80,80":"0,0,0"},.5)`,},
      { background:dark?"#212121":"#fff",color:dark?"#818181":"#000",padding:size/2,},
      { position:"absolute",color:dark?"#818181":"#fff",top:0,right:0,transform:"translate(30%,-30%)"},
      { position:"relative",color:dark?"#818181":"#fff",left:"50%",transform:"translate(-50%)",margin:`${size*50}px auto`},
    ], [size, dark])
    return (
    <div style={{background:dark?"#000":"#f1f1f1",position:"relative",minHeight:"100vw",padding:size*100}}>
        <Head size={size}>Note</Head>
        <Foot size={size}>ⓒtsei</Foot>
        <Notes {...{size}}
            right={(<Icon fa="plus"   size={size*2} style={styles[3]} onOpen={()=>null}/>)}
            left ={(<Icon fa="comment"size={size*2} style={styles[3]} onOpen={()=>null}/>)}>
        {(notes||[]).map((note,key)=>
            <>
                <Card {...{key,size,style:styles[1]}}>{note.ja_text}</Card>
                {(note.children||[]).map((child,i) =>
                    <Card {...{key:i,size,style:styles[1]}}>{child.ja_text}</Card>)}
            </>
        )}
        </Notes>
        <Icon size={size*2} fa="plus" style={styles[3]} onOpen={setNotes}/>
        {/******************** Modals ********************/}
        <Modal {...{size,open:sign,style:styles[0],onClose:()=>setSign(false)}}>
            <Card {...{size,style:styles[1]}}>
                <Icon fa="times" size={size} style={styles[2]} onOpen={()=>setSign(false)}/>
                <Head size={size}>SIGN {inup[0]} <Icon fa="exchange-alt" color={dark?"#818181":"#fff"}
                      size={size} onOpen={()=>setINUP(pre=>[...pre.reverse()])}/></Head>
                <MDBInput value={cred.username} onChange={onChange} name="username" type="text"
                    label="Type your username" icon="user" group validate error="wrong" success="right"/>
                <MDBInput value={cred.password} onChange={onChange} name="password" type="password"
                    label="Type your password" icon="lock" group validate autoComplete="on" />
                {inup[0]==="UP" &&
                <MDBInput value={cred.email} onChange={onChange} name="email" type="email"
                    label="Type your email" icon="envelope" group validate error="wrong" success="right"/> }
                <MDBBtn onClick={setUser} color="elegant" style={{width:"100%",borderRadus:size}}>Get!</MDBBtn>
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
