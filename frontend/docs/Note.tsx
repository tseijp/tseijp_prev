import React, {FC, useCallback, useMemo, useState, useRef} from 'react'
import { Notes, Pills, Sides, Trans } from '../src'
import { useGrid } from 'use-grid'

export const Note :FC = () => {
    /* state */
    const [lang, setLang] = useState<string>('Ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:true})
    const [size, setSize] = useGrid<number>({md:50   , lg:75  })
    const [width] = useGrid<number>({xs:4/5, md:500, lg:750})
    /*const style = useMemo<React.CSSProperties>(()=>({
        background:dark?"#212121":"#fff",boxShadow:"0px 1px 50px rgba(0,0,0,0.2)",
        color     :dark?"#818181":"#000",borderRadius:`${size/2}px`,
    }),[dark,size])*/
    return (
    <div style={{background:dark?"#000":"#fff",transition:"1s",padding:size*2}}>
        <div style={{color:dark?"#818181":"#000", fontSize:size}}>Note</div>
        <Sides {...{size, width}}>
            <p onClick={()=>window.location.href="/note"}>Note</p>
            <p onClick={()=>window.location.href="/hook"}>Hook</p>
            <p onClick={()=>window.location.href="/sign"}>Sign</p>
        </Sides>
        <Trans {...{size, width}}>
            <div onClick={()=>setLang(p=>p!=='Ja'?'Ja':'En')}>{lang}</div>
            <div onClick={()=>setDark( (p:any)=>({md:p.lg,lg:p.md}) )}>{dark?'🌛':'🌞'}</div>
            <div onClick={()=>setSize( (p:any)=>({md:p.lg,lg:p.md}) )}>{size<75?'👶':'👨'}</div>
        </Trans>
        <Pills {...{size, width, dark}}>
            <i className="fas fa-ellipsis-h"         onClick={()=>null}>
                <i className="fas fa-share-square"   onClick={()=>null}>
                    <i className="fas fa-bold"       onClick={()=>null}/>
                    <i className="fab fa-twitter"    onClick={()=>null}/>
                    <i className="fab fa-facebook-f" onClick={()=>null}/>
                </i>
                <i className="fas fa-sign-in-alt"    onClick={()=>null}/>
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
