import React, {CSSProperties as CSS, FC} from 'react'
import {useGrid}  from 'use-grid'
import {Controls} from 'react-three-gui';
import {Helmet}   from 'react-helmet-async';
import {hookTree,hookPage,HookPage} from './utils'

import {is,topUp,usePage,Card,Code,Notes,Sides,Split,Trees,Trans} from '../src'
const styles:{[key:string]:CSS} = {
    top : {position:"relative", transition:"1s", minHeight:"100%",overflowX:"hidden"},
    item: {height:"100vh",overflow:"scroll",},
    card: {margin:`auto`,padding:"auto", paddingLeft:"1rem", width:"100%",overflow:"auto"},
    ctrl: {position:"relative",width:"100%",zIndex:1,top:0,left:0,margin:0}
}

export const Hook:FC = () => {
    const [dark, setDark] = useGrid<number>({md:0, lg:0 })
    const [size, setSize] = useGrid<number>({md:1, lg:1.5})
    const [page, setPage] = usePage<HookPage>(hookPage)
    const [side, setSide] = useGrid({xs:0,sm:size*100,lg:250,init:250})
    return (
    <div style={{...styles.top,background:dark?"#000":"#fff",}}>
        {/*<Head style={{marginTop:size*100}}>Hook</Head>*/}
        <Split order={page.Hook?[side,-1]:[1,0]} min={size*100} styleItem={styles.item}>
            <Notes {...{dark,size}}>
                {page.Hook &&
                    <Controls
                        title={topUp(page.id)}
                        anchor={'top_left'}
                        style={{...styles.ctrl,fontSize:size*25}}
                        collapsed={true}/>}
                <Card min={-1} {...{dark,size,style:styles.card,rate:0}}>
                    <Trees  {...{dark,size:size/2,root:page.id?0:1}}
                            {...(page.id?{fontSize:"14px"}:{})}
                           topStyle={{padding:page.Hook?25*size:100*size}}
                           content={
                            <span onClick={() => setPage({id:""})}>Hook</span>}>
                        { hookTree.map((ids,i) => ids instanceof Array
                        ?   <span key={i}>{ ids.map((id, j) =>
                            <span key={id} onClick={() => j&&setPage({id})}>{id}</span>) }</span>
                        :   <span key={i}  onClick={() =>    setPage({id:ids})}>{ids}</span>) }
                    </Trees>
                </Card>
                <Card min={-1} {...{dark,size,style:styles.card,rate:0}}/>
            </Notes>
            <Notes {...{dark,size}}>{ page.code && is.str(page.code) &&
                <Card min={-1} {...{dark,size,style:styles.card,rate:0}}>
                    <Code {...{code:page.code,dark,size}}/>
                </Card> }
                <Card min={-1} {...{dark,size,style:styles.card,rate:0}}>
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
