import React, {FC, useState, useMemo} from 'react'
import { Card, Foot, Head } from '../../src/components'
import { Modal, Notes, Pills, Sides, Trans } from '../../src/containers'
import { useGrid } from 'use-grid'

export const Note :FC = () => {
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:true})
    const [size, setSize] = useGrid<number> ({md:50   , lg:75  })
    const [share, setShare]   = useState<boolean>(false)
    const [signin, setSignin] = useState<boolean>(false)
    const [width] = useGrid<number>({xs:4/5, md:500, lg:750})
    const styles = useMemo<React.CSSProperties[]>(()=>[
      { position:"relative", transition:"1s", minHeight:"100vw", padding:size*2 },
      { padding:`${size}px`, color:dark?"#818181":"#000",background:dark?"#212121":"#fff" },
    ], [size, dark])
    return (
    <div style={{...styles[0],background:dark?"#000":"#fff"}}>
        <Head size={size} style={{color:dark?"#818181":"#000"}}>Note</Head>
        <Foot size={size} style={{color:dark?"#818181":"#000"}}>ⓒtsei</Foot>
        <Modal {...{size, width, state:[signin,setSignin]}}>
            <Card style={styles[1]}>Hello</Card>
        </Modal>
        <Modal {...{size, width, state:[share,setShare]}}> World </Modal>
        <Notes {...{size, width}}>
            <Card style={styles[1]}>Hello~</Card>
            <Card style={styles[1]}>Hello~</Card>
        </Notes>
        <Sides {...{size, width}}>
            <p onClick={()=>window.location.href="/"    }>Home</p>
            <p onClick={()=>window.location.href="/hook"}>Hook</p>
            <p onClick={()=>window.location.href="/note"}>Note</p>
            <p onClick={()=>window.location.href="/sign"}>Sign</p>
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
                <i className="fas fa-location-arrow" onClick={()=>null}>
                    <i className="fas fa-angle-up"   onClick={()=>null}/>
                    <i className="fas fa-home"       onClick={()=>null}/>
                    <i className="fas fa-angle-down" onClick={()=>null}/>
                </i>
            </i>
        </Pills>
    </div>
    )
}
