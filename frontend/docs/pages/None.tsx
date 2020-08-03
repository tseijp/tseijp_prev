import React, {FC, Suspense, useState, useMemo} from 'react'
//import { Card, Foot, Head } from '../../src/components'
import { /*Modal, Pills, */Sides, Trans } from '../../src/containers'
import { useGrid } from 'use-grid'
import { Kinect } from '../meshs'
import { Canvas } from 'react-three-fiber'
import { OrbitControls, StandardEffects } from 'drei'
import * as THREE from 'three'

export const None :FC = () => {
    /* state */
    const url = '/static/kinect.mp4'
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:true})
    const [size, setSize] = useGrid<number> ({md:1    , lg:1.5 })
    const styles = useMemo<React.CSSProperties[]>(()=>[
      { position:"relative", height:"100vw", padding:size*2, background:dark?"#000":"#fff"},
      { padding:`${size}px`, color:dark?"#818181":"#000", background:dark?"#212121":"#fff" },
    ], [size, dark])
    return (
        <div style={{...styles[0]}}>
            <div style={{position:"fixed",top:0,left:0,width:'100%',height:'100%'}}>
                <Canvas gl={{ alpha: false, antialias: false, logarithmicDepthBuffer: true }}
                        camera={{ position:[0,0,500], far:2000 }}
                        pixelRatio={window.devicePixelRatio}
                        onCreated={({gl}:any) => {
                            gl.toneMapping    = THREE.ACESFilmicToneMapping
                            gl.outputEncoding = THREE.sRGBEncoding}}>
                    <ambientLight intensity={1.1} />
                    <pointLight position={[100, 100, 100]} intensity={2.2} />
                    <pointLight position={[-100, -100, -100]} intensity={5} color="red" />
                    <gridHelper position={[0,-1000,0]} args={[2000,50]}/>
                    <Kinect {...{url}}/>
                    <Suspense fallback={null}>
                      <StandardEffects />
                    </Suspense>
                    <OrbitControls />
                </Canvas>
            </div>
            <Sides {...{size}}>
                <p onClick={()=>window.location.href="/"    }>Home</p>
                <p onClick={()=>window.location.href="/hook"}>Hook</p>
                <p onClick={()=>window.location.href="/note"}>Note</p>
            </Sides>
            <Trans {...{size}}>
                <div onClick={()=>setLang(p=>p!=='ja'?'ja':'en')}>{lang.toUpperCase()}</div>
                <div onClick={()=>setDark( (p:any)=>({md:p.lg,lg:p.md}) )}>{dark?'🌛':'🌞'}</div>
                <div onClick={()=>setSize( (p:any)=>({md:p.lg,lg:p.md}) )}>{size<75?'👶':'👨'}</div>
            </Trans>
        </div>
    )
}
