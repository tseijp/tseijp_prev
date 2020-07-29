import React, {FC, useState} from 'react'
import { Card, Case, Foot, Head } from '../src/components'
import { Modal, Notes, Pills, Sides, Trans } from '../src/containers'
import { useGrid } from 'use-grid'

export const Note :FC = () => {
    /* state */
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:true})
    const [size, setSize] = useGrid<number> ({md:50   , lg:75  })
    const [share, setShare]   = useState<boolean>(false)
    const [signin, setSignin] = useState<boolean>(false)
    const [width] = useGrid<number>({xs:4/5, md:500, lg:750})
    return (
    <Case size={size} style={{background:dark?"#000":"#fff"}}>
        <Head size={size} style={{color:dark?"#818181":"#000"}}>Note</Head>
        <Foot size={size} style={{color:dark?"#818181":"#000"}}>ⓒtsei</Foot>
        <Modal {...{size, width, open:signin, set:setSignin}}>
            Hello
        </Modal>
        <Modal {...{size, width, open:share, set:setShare}}>
            World
        </Modal>
        <Notes {...{size, width}}>
            <Card style={{padding:`${size}px`, background:dark?"#000":"#fff"}}>Hello~</Card>
        </Notes>
        <Sides {...{size, width}}>
            <p onClick={()=>window.location.href="/note"}>Note</p>
            <p onClick={()=>window.location.href="/hook"}>Hook</p>
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
    </Case>
    )
}
