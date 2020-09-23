import React, {CSSProperties as CSS, FC} from 'react'
import {Sides, Trans} from '../src/containers'
import {useGrid} from 'use-grid'
import {Helmet} from 'react-helmet-async';
import {hookPage,HookPage} from './utils'
import {usePage,//Card,Trees
} from '../src'

const styles:{[key:string]:CSS} = {
    top   : {position:"relative", transition:"1s", minHeight:"100%", overflow:"hidden"},
    canvas: {position:"fixed", width:"100%", height:"100%", top:0, left:0}
}
export const Hook:FC = () => {
    const [dark, setDark] = useGrid<number>({md:1, lg:0 })
    const [size, setSize] = useGrid<number>({md:1, lg:1.5})
    const [page, ] = usePage<HookPage>(hookPage)
    return (
    <div style={{...styles.top, background:dark?"#000":"#fff"}}>
        {/*<Trees content="1">
            <Trees content="2"/>
        </Trees>*/}
        <Sides {...{size}}>
            <p onClick={()=>window.location.href="/"   }>Home</p>
            <p onClick={()=>window.location.href="/note"}>Note</p>
        </Sides>
        <Trans {...{size}}>
            <div onClick={()=>setDark((p:any)=>({md:p.lg,lg:p.md}))}>{dark?'🌞':'🌛'}</div>
            <div onClick={()=>setSize((p:any)=>({md:p.lg,lg:p.md}))}>{size<75?'👨':'👶'}</div>
        </Trans>
        <Helmet>
            <title>TSEI.jp {page.id}</title>
            <link rel="canonical" href="https://tsei.jp/" />
        </Helmet>
    </div>
    )
}
