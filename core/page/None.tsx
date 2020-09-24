import React, {CSSProperties as CSS, FC, useState} from 'react'
//import { Card, Foot, Head } from '../src/components'
import { /*Modal, Pills, */Sides, Trans } from '../src/containers'
import { useGrid } from 'use-grid'
import { Canvas } from 'react-three-fiber'
import { Helmet } from 'react-helmet-async';
import { TransformControls } from 'drei'
import { Kinect } from './meshs'
import * as THREE from 'three'
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
const styles:{[key:string]:CSS} = {
    top: {position:"fixed",top:0,left:0,width:'100%',height:'100%'},
}

export const None :FC = () => {
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:true, lg:false})
    const [size, setSize] = useGrid<number> ({md:1    , lg:1.5 })
    return (
        <>
            <div style={{...styles.top, background:dark?"#000":"#fff"}}>
                <Canvas gl={{ alpha: false, antialias: false, logarithmicDepthBuffer: true }}
                        camera={{ position:[0,0,500], far:2000 }}
                        pixelRatio={window.devicePixelRatio}
                        onCreated ={({gl}:any) => {
                            gl.outputEncoding = THREE.sRGBEncoding
                            gl.toneMapping    = THREE.ACESFilmicToneMapping }}>
                    <ambientLight intensity={1.1} />
                    <pointLight position={[100, 100, 100]} intensity={2.2} />
                    <pointLight position={[-100, -100, -100]} intensity={5} color="red" />
                    <gridHelper position={[0,-1000,0]} args={[2000,50]}/>
                    <TransformControls>
                        <Kinect url="/static/core/kinect.mp4"/>
                    </TransformControls>
                </Canvas>
            </div>
            <Helmet>
                <title>404 NOT FOUND</title>
                <link rel="canonical" href="https://tsei.jp/" />
            </Helmet>
            <Sides {...{size}}>
                <p onClick={()=>window.location.href="/"    }>Home</p>
                <p onClick={()=>window.location.href="/note"}>Note</p>
            </Sides>
            <Trans {...{size}}>
                <div onClick={()=>setLang(p=>p!=='ja'?'en':'ja')}>{lang.toUpperCase()}</div>
                <div onClick={()=>setDark((p:any)=>({md:p.lg,lg:p.md}))}>{dark?'🌞':'🌛'}</div>
                <div onClick={()=>setSize((p:any)=>({md:p.lg,lg:p.md}))}>{size<75?'👨':'👶'}</div>
            </Trans>
        </>
    )
}
