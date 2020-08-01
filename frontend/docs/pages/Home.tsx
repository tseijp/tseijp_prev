import React, {FC, Suspense, useState, useMemo} from 'react'
import { Sides, Trans } from '../../src/containers'
import { useGrid } from 'use-grid'
import { OrbitControls, StandardEffects } from 'drei'
import * as THREE from 'three'

import { Canvas } from "react-three-fiber"
import { Model, Swarm } from "../meshs"

export const Home :FC = () => {
    /* state */
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:true})
    const [size, setSize] = useGrid<number> ({md:50   , lg:75  })
    const [width] = useGrid<number>({xs:4/5, md:500, lg:750})
    const styles = useMemo<React.CSSProperties[]>(()=>[
      { position:"relative", transition:"1s", minHeight:"100vw", padding:size*2 },
      { padding:`${size}px`, color:dark?"#818181":"#000",background:dark?"#212121":"#fff" },
    ], [size, dark])
    return (
    <div style={{...styles[0],background:dark?"#000":"#fff"}}>
        <Canvas
            gl={{antialias:false, logarithmicDepthBuffer:true}}
            pixelRatio={window.devicePixelRatio}
            camera={{position:[0,-2,3]}}
            style={{position:"fixed",width:"100%",height:"100%",top:0,left:0}}
            onCreated={({gl})=>{gl.outputEncoding=THREE.sRGBEncoding}}>
            <fog attach="fog" args={[0xdfdfdf, 35, 65]} />
            <hemisphereLight intensity={0.68} position={[0, 50, 0]} />
            <directionalLight position={[-8, 12, 8]} castShadow />
            <Suspense fallback={null}>
                <Model {...{dark,size}}/>
                <StandardEffects />
                <Swarm {...{dark,size}}/>
            </Suspense>
            <OrbitControls />
        </Canvas>
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
