import React, {FC, useState, useMemo} from 'react'
import { Pages, Sides, Trans } from '../../src/containers'
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
        <Pages>
            <div style={{background:"green"}}/>
            <div style={{background:"blue"}}/>
            <div style={{background:"red"}}/>
        </Pages>
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
    </div>
    )
}
