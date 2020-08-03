import React, {FC, useState, useCallback, useMemo} from 'react'
import { Card, Foot, Head, Icon } from '../../src/components'
import { Modal, Notes, Pills, Sides, Trans } from '../../src/containers'
import { useUser } from '../../src/hooks'
import { useGrid } from 'use-grid'
import {MDBInput, MDBBtn} from 'mdbreact'

export const Note :FC = () => {
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:true})
    const [size, setSize] = useGrid<number> ({md:1    , lg:1.5 })
    // ******************** for Modal ******************** //
    const [signin, setSignin] = useState<boolean>(true)
    // ******************** for Signin ******************** //
    const login = useCallback(()=>{
        setSignin(false)
        return {username:"",authtoken:""}
    }, [])
    const [inup, setINUP] = useState<string[]>(['IN','UP'])
    const [user, setUser] = useUser(()=>login(), [login])
    const [cred, setCred] = useState({username:user?.username as string||'',password:'',email:''})
    const onChange = useCallback(({target})=>setCred(p=>({...p,[target.name]:target.value})),[])
    // ******************** for Render ******************** //
    const styles = useMemo<React.CSSProperties[]>(()=>[
      { background:`rgba(${dark?"80,80,80":"0,0,0"},.5)`,},
      { background:dark?"#212121":"#fff", padding:size/2,},
      { position:"absolute",top:0,right:0,transform:"translate(30%,-30%)"},
    ], [size, dark])
    return (
    <div style={{background:dark?"#000":"#f1f1f1",position:"relative",minHeight:"100vw",padding:size*100}}>
        <Head size={size}>Note</Head>
        <Foot size={size}>ⓒtsei</Foot>
        <Notes {...{size}}>
            <Card {...{color:dark?"#818181":"#000",style:styles[1]}}>Hello~</Card>
            <Card {...{color:dark?"#818181":"#000",style:styles[1]}}>Hello~</Card>
        </Notes>
        {/******************** Modals ********************/}
        <Modal {...{size,open:signin,style:styles[0],onClose:()=>setSignin(false)}}>
            <Card {...{color:dark?"#818181":"#000",style:styles[1]}}>
                <Icon fa="times" color={dark?"#818181":"#fff"}
                    size={size} style={styles[2]} onOpen={()=>setSignin(false)}/>
                <h1>SIGN {inup[0]} <Icon fa="exchange-alt" color={dark?"#818181":"#fff"}
                    size={size} onOpen={()=>setINUP(pre=>[...pre.reverse()])}/></h1>
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
        {/******************** Sub UI ********************/}
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
                <Icon fa="sign-in-alt"   color={dark?"#818181":"#fff"} size={size} onOpen={()=>setSignin(true)}/>
                <Icon fa="location-arrow"color={dark?"#818181":"#fff"} size={size} onOpen={()=>null}/>
            </Icon>
        </Pills>
    </div>
    )
}
