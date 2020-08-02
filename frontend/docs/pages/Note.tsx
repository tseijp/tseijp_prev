import React, {FC, useState, useCallback, useMemo} from 'react'
import { Card, Foot, Head } from '../../src/components'
import { Modal, Notes, Pills, Sides, Trans } from '../../src/containers'
import { useUser } from '../../src/hooks'
import { useGrid } from 'use-grid'
import {MDBInput, MDBBtn} from 'mdbreact'

export const Note :FC = () => {
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:true})
    const [size, setSize] = useGrid<number> ({md:50   , lg:75  })
    const [width] = useGrid<number>({xs:4/5, md:500, lg:750})
    // ******************** for Modal ******************** //
    const [share, setShare]   = useState<boolean>(false)
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
      { color:dark?"#818181":"#000",background:`rgba(${dark?"80,80,80":"0,0,0"},.5)`,},
      { color:dark?"#818181":"#000",background:dark?"#212121":"#fff", padding:size/2,},
      { color:dark?"#000":"#212121",position:"absolute",top:0,right:0,fontSize:size,transform:"translate(30%,-30%)"},
    ], [size, dark])
    return (
    <div style={{background:dark?"#000":"#f1f1f1",position:"relative",minHeight:"100vw",padding:size*2}}>
        <Head size={size}>Note</Head>
        <Foot size={size}>ⓒtsei</Foot>
        <Notes {...{size, width}}>
            <Card style={styles[1]}>Hello~</Card>
            <Card style={styles[1]}>Hello~</Card>
        </Notes>
        {/******************** Modals ********************/}
        <Modal {...{size,width,open:share,style:styles[0],onClose:()=>setShare(false)}}>
            <Card style={styles[1]}>
                <h1>Share</h1>
                <i className="fas fa-times-circle" style={styles[2]} onClick={()=>setShare(false)}/>
            </Card>
        </Modal>
        <Modal {...{size,width,open:signin,style:styles[0],onClose:()=>setSignin(false)}}>
            <Card style={styles[1]}>
                <i className="fas fa-times-circle" style={styles[2]} onClick={()=>setSignin(false)}/>
                <h1>SIGN {inup[0]} or <MDBBtn style={{borderRadius:"2em"}} color="elegant"
                    onClick={()=>setINUP(pre=>[...pre.reverse()])}>{inup[1]}</MDBBtn></h1>
                <MDBInput value={cred.username} onChange={onChange} name="username" type="text"
                    label="Type your username" icon="user" group validate error="wrong" success="right"/>
                <MDBInput value={cred.password} onChange={onChange} name="password" type="password"
                    label="Type your password" icon="lock" group validate autoComplete="on" />
                {inup[0]==="UP" &&
                <MDBInput value={cred.email} onChange={onChange} name="email" type="email"
                    label="Type your email" icon="envelope" group validate error="wrong" success="right"/> }
                <MDBBtn onClick={setUser} color="elegant" style={{width:"100%",borderRadus:"2em"}}>Get!</MDBBtn>
            </Card>
        </Modal>
        {/******************** Sub UI ********************/}
        <Sides {...{size, width}}>
            <p onClick={()=>window.location.href="/"    }>Home</p>
            <p onClick={()=>window.location.href="/hook"}>Hook</p>
            <p onClick={()=>window.location.href="/note"}>Note</p>
        </Sides>
        <Trans {...{size, width}}>
            <div onClick={()=>setLang(p=>p!=='ja'?'ja':'en')}>{lang.toUpperCase()}</div>
            <div onClick={()=>setDark( (p:any)=>({md:p.lg,lg:p.md}) )}>{dark?'🌛':'🌞'}</div>
            <div onClick={()=>setSize( (p:any)=>({md:p.lg,lg:p.md}) )}>{size<75?'👶':'👨'}</div>
        </Trans>
        <Pills {...{size, width}}>
            <i className="fas fa-ellipsis-h"         onClick={()=>null}>
                <i className="fas fa-share-square"   onClick={()=>setShare(true)}/>
                <i className="fas fa-sign-in-alt"    onClick={()=>setSignin(true)}/>
                <i className="fas fa-location-arrow" onClick={()=>null}/>
            </i>
        </Pills>
    </div>
    )
}
