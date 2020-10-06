import React from 'react'
import {useControl as use} from 'react-three-gui';
import {Stage} from '../../../src'
import * as THREE from 'three'
import {Canvas, } from 'react-three-fiber'
import {TransformControls} from 'drei'

export const HookStage = () => {
    const amp    = use('amp'   ,{type:'number', distance:5   ,min:1,value:100 ,max:200 ,})
    const dist   = use('dist'  ,{type:'number', distance:5   ,min:1,value:1000,max:2000,})
    const time   = use('time'  ,{type:'number', distance:0.01,min:0,value:1,max:2,})
    const amount = use('amount',{type:"xypad" ,distance:5, value:{x:50,y:50} ,scrub:true})
    return (
            <Canvas gl={{antialias:false, logarithmicDepthBuffer: true}}
                    style={{width:'100%',height:'calc(100vh - 2rem)'}}
                    camera={{position:[0,500,0], far:2000}}
                    pixelRatio={window.devicePixelRatio}
                    onCreated ={({gl}:any) => {
                        gl.outputEncoding = THREE.sRGBEncoding
                        gl.toneMapping    = THREE.ACESFilmicToneMapping
                    }}>
                <ambientLight intensity={1.1} />
                <pointLight position={[100, 100, 100]} intensity={2.2} />
                <pointLight position={[-100, -100, -100]} intensity={5} color="red" />
                <TransformControls>
                    <Stage {...{amp,dist,time,amount}}/>
                </TransformControls>
            </Canvas>
    )
}
