import React, {CSSProperties as CSS, FC} from 'react'
import {useGrid} from 'use-grid'
import {Helmet} from 'react-helmet-async';
import {hookTree,hookPage,HookPage} from './utils'
import {topUp,usePage,Card,Code,Notes,Sides,Split,Trees,Trans} from '../src'
const styles:{[key:string]:CSS} = {
    top   : {position:"relative", transition:"1s", minHeight:"100%",overflowX:"hidden"},
    card  : {margin:`auto`,padding:"auto", paddingLeft:"1rem", width:"100%",overflow:"auto"},
}

export const Hook:FC = () => {
    const [dark, setDark] = useGrid<number>({md:0, lg:0 })
    const [size, setSize] = useGrid<number>({md:1, lg:1.5})
    const [page, setPage] = usePage<HookPage>(hookPage)
    const [side, setSide] = useGrid({xs:0,sm:250,lg:1/3,init:250})
    return (
    <div style={{...styles.top,background:dark?"#000":"#fff",}}>
        {/*<Head style={{marginTop:size*100}}>Hook</Head>*/}
        <Split order={page.Hook?[side,-1]:[1,0]} styleItem={{height:"100vh",overflow:"scroll"}}>
            <Notes {...{dark,size}}>
                <Card min={1} {...{dark,size,style:styles.card,rate:0}}>
                    <Trees {...{dark,size:size/2,root:1,
                            ...(page.Hook?{}:{topStyle:{padding:100*size}})}}
                            content={<span onClick={() => setPage({id:""})}>Hook</span>}>
                        { hookTree.map((ids,i) => ids instanceof Array
                        ?   <span key={i}>{ ids.map((id, j) =>
                            <span key={id} onClick={() => j&&setPage({id})}>{id}</span>) }</span>
                        :   <span key={i}  onClick={() =>    setPage({id:ids})}>{ids}</span>) }
                    </Trees>
                </Card>
            </Notes>
            <Notes {...{dark,size}}>
                { page.code &&
                <Card min={1} {...{dark,size,style:styles.card,rate:0}}>
                    <Code {...{code:page.code,dark,size}}/>
                </Card> }
                <Card min={1} {...{dark,size,style:{...styles.card},rate:0,height:"100%"}}>
                    {page.Hook && <page.Hook />}
                </Card>
            </Notes>
        </Split>
        <Sides {...{size}}>
            <a style={{color:"#818181"}} href="/"    >Home</a>
            <a style={{color:"#818181"}} href="/hook">Hook</a>
            <a style={{color:"#818181"}} href="/note">Note</a>
        </Sides>
        <Trans {...{size}}>
            <div onClick={()=>setDark((p:any)=>({md:p.lg,lg:p.md}))}>{dark?'🌞':'🌛'}</div>
            <div onClick={()=>setSize((p:any)=>({md:p.lg,lg:p.md}))}>{size<75?'👨':'👶'}</div>
            <div onClick={()=>setSide((p:any)=>p.lg?{xs:0,sm:0,lg:0}:{xs:0,sm:250,lg:1/3})}>{side?'😆':'😃'}</div>
        </Trans>
        <Helmet>
            <title>TSEI.jp {topUp(page.id)}</title>
            <link rel="canonical" href="https://tsei.jp/" />
        </Helmet>
    </div>
    )
}
