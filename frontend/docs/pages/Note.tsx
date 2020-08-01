import React, {FC, useState, useCallback, useMemo} from 'react'
import { Card, Foot, Head } from '../../src/components'
import { Modal, Notes, Pills, Sides, Trans } from '../../src/containers'
import { useGrid } from 'use-grid'
import {MDBInput, MDBBtn} from 'mdbreact'

export const Note :FC = () => {
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:true})
    const [size, setSize] = useGrid<number> ({md:50   , lg:75  })
    const [width] = useGrid<number>({xs:4/5, md:500, lg:750})
    // ******************** for Modal ******************** //
    const [share, setShare]   = useState<boolean>(false)
    const [signin, setSignin] = useState<boolean>(false)
    // ******************** for Signin ******************** //
    const [cred, setCred] = useState({username:'',password:'',email:''})
    const [isSignin] = useState<boolean>(false)
    const inputChange = useCallback((e:any)=> {
        e.persist()
        setCred(pre=>({...pre, [e.target.name]:e.target.value}))
    }, [])
    // ******************** for Render ******************** //
    const styles = useMemo<React.CSSProperties[]>(()=>[
      { position:"relative", transition:"1s", minHeight:"100vw", padding:size*2 },
      { color:dark?"#818181":"#000",background:dark?"#212121":"#fff",padding:`${size}px`},
      { color:dark?"#818181":"#000",background:dark?"rgba(80,80,80,.5)":"rgba(0,0,0,.5)"},
      { position:"absolute",top:0,right:0,fontSize:size,transform:"translate(30%,-30%)" },
    ], [size, dark])
    return (
    <div style={{...styles[0],background:dark?"#000":"#fff"}}>
        <Head size={size} style={{color:dark?"#818181":"#000"}}>Note</Head>
        <Foot size={size} style={{color:dark?"#818181":"#000"}}>ⓒtsei</Foot>
        <Notes {...{size, width}}>
            <Card style={styles[1]}>Hello~</Card>
            <Card style={styles[1]}>Hello~</Card>
        </Notes>
        {/******************** Modals ********************/}
        <Modal {...{size,width}} open={share} onClose={()=>setShare(false)} style={styles[2]}>
            <Card style={styles[1]}>
                <h1>Share</h1>
                <i className="fas fa-times-circle" style={styles[3]} onClick={()=>setShare(false)}/>
            </Card>
        </Modal>
        <Modal {...{size, width}} open={signin} onClose={()=>setSignin(false)} style={styles[2]}>
            <Card style={styles[1]}>
                <h1>Sign in</h1>
                <i className="fas fa-times-circle" style={styles[3]} onClick={()=>setSignin(false)}/>
                <MDBInput value={cred.username} name="username" onChange={inputChange}
                    label="Type your username" icon="user"
                    group type="text" validate error="wrong" success="right"/>
                <MDBInput value={cred.password} name="password" onChange={inputChange}
                    label="Type your password" icon="lock"
                    group type="password" validate autoComplete="on" />
                {isSignin &&
                <MDBInput value={cred.email} name="email" onChange={inputChange}
                    label="Type your email" icon="envelope"
                    group type="email" validate error="wrong" success="right"/> }
                <MDBBtn color="elegant" style={{width:"100%",borderRadus:"2em"}}>Sign in</MDBBtn>
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
