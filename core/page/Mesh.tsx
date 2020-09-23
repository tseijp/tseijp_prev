// todo
//     <TransformControls>
//         <Model {...{dark,size}}/>
//     </TransformControls>
//     <Swarm {...{dark,size}}/>
import React, {
    CSSProperties as CSS, FC, Suspense,// useMemo
} from 'react'
import {Sides, Trans} from '../src/containers'
import {useGrid} from 'use-grid'
import {Helmet} from 'react-helmet-async';
import {TransformControls} from 'drei'
// import * as THREE from 'three'
import {Canvas} from "react-three-fiber"
import {meshPage,MeshPage} from './utils'
import {usePage,//Trees
        } from '../src'
import {Model, Swarm} from './meshs'
const styles:{[key:string]:CSS} = {
    top   : {position:"relative", transition:"1s", minHeight:"100%", overflow:"hidden"},
    canvas: {position:"fixed", width:"100%", height:"100%", top:0, left:0}
}
export const Mesh :FC = () => {
    const [dark, setDark] = useGrid<number>({md:1, lg:0 })
    const [size, setSize] = useGrid<number>({md:1, lg:1.5})
    const [page, ] = usePage<MeshPage>(meshPage)
    return (
    <div style={{...styles.top, background:dark?"#000":"#fff"}}>
        <Canvas {...page.canvas} style={styles.canvas}>
            <fog attach="fog" args={[0xdfdfdf, 35, 65]} />
            <hemisphereLight intensity={0.68} position={[0, 50, 0]} />
            <directionalLight position={[-8, 12, 8]} castShadow />
            <Suspense fallback={null}>
                <TransformControls>
                    <Model {...{dark,size}}/>
                </TransformControls>
                <Swarm {...{dark,size}}/>
                {/*page.Mesh && <page.Mesh /> */}
            </Suspense>
        </Canvas>
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
