import React, {CSSProperties as CSS, FC, useMemo} from 'react'
import {useGrid} from 'use-grid'
import {Helmet} from 'react-helmet-async';
import {hookTree,hookPage,HookPage} from './utils'
import {topUp,usePage,Card,Code,Sides,Split,Trees,Trans} from '../src'
const styles:{[key:string]:CSS} = {
    top   : {position:"relative", transition:"1s", minHeight:"100%"},
}

export const Hook:FC = () => {
    const [dark, setDark] = useGrid<number>({md:0, lg:0 })
    const [size, setSize] = useGrid<number>({md:1, lg:1.5})
    const [page, setPage] = usePage<HookPage>(hookPage)
    const [width] = useGrid({xs:0,sm:250,lg:500})
    const style = useMemo(() => ({margin:`${size*25}px auto ${size*25}px auto`,padding:"auto"}),[size])
    return (
    <div style={{...styles.top, background:dark?"#000":"#fff"}}>
        <Split order={[width/window.innerWidth, -1]} style={{paddingTop:size*100,height:"100%"}}>
            <>
                <Card min={1} {...{dark,size,style}}>
                    <Trees size={0.5}>
                        {hookTree.map((ids,i) => ids instanceof Array
                          ? <span key={i}>{ids.map(id =>
                            <span key={id} onClick={() => setPage({id})}>{id}</span>)}</span>
                          : <span key={i}  onClick={() => setPage({id:ids})}>{ids}</span>)}
                    </Trees>
                </Card>
                <Card min={1} {...{dark,size,style}}>
                    <Code {...{code:page.code,dark,size}}/>
                </Card>
            </>
            <>
                {Hook && <page.Hook />}
            </>
        </Split>
        <Sides {...{size}}>
            <span onClick={()=>window.location.href="/"    }>Home</span><>
            <span onClick={()=>window.location.href="/hook"}>Hook</span>
            <span onClick={()=>window.location.href="/hook/core"}>Core</span>
            <span onClick={()=>window.location.href="/hook/mdmd"}>Mdmd</span></>
            <span onClick={()=>window.location.href="/note"}>Note</span>
        </Sides>
        <Trans {...{size}}>
            <div onClick={()=>setDark((p:any)=>({md:p.lg,lg:p.md}))}>{dark?'🌞':'🌛'}</div>
            <div onClick={()=>setSize((p:any)=>({md:p.lg,lg:p.md}))}>{size<75?'👨':'👶'}</div>
        </Trans>
        <Helmet>
            <title>TSEI.jp {topUp(page.id)}</title>
            <link rel="canonical" href="https://tsei.jp/" />
        </Helmet>
    </div>
    )
}
