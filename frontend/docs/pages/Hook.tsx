import React, {FC, useState, useMemo} from 'react'
import { Head, Foot } from '../../src/components'
import { Sides, Trans } from '../../src/containers'
import { useGrid } from 'use-grid'

export const Hook :FC = () => {
    /* state */
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:true})
    const [size, setSize] = useGrid<number> ({md:50   , lg:75  })
    const [width] = useGrid<number>({xs:4/5,  md:500  , lg:750 })
    const styles = useMemo<React.CSSProperties[]>(()=>[
      { position:"relative", transition:"1s", minHeight:"100vw", padding:size*2 },
      { padding:`${size}px`, color:dark?"#818181":"#000",background:dark?"#212121":"#fff" },
    ], [size, dark])
    console.log(styles[1])
    return (
    <div style={{...styles[0],background:dark?"#000":"#fff"}}>
        <Head {...{size, style:{color:dark?0x818181:0x000}}}>Hook</Head>
        <Foot {...{size, style:{color:dark?0x818181:0x000}}}>ⓒtsei</Foot>
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
    </div>
    )
}
