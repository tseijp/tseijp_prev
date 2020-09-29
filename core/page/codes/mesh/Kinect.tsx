import React, {CSSProperties as CSS, FC} from 'react'
import * as THREE from 'three'
import {Canvas, } from 'react-three-fiber'
import {useControl} from 'react-three-gui';
import {TransformControls} from 'drei'
import {Kinect as Target} from '../../../src'
const styles:{[key:string]:CSS} = {
    top: {width:'100%',height:'100vh'},
}

export const Kinect :FC = () => {
    const dark = useControl('dark', {type: 'boolean', value:false})
    return (
        <Canvas gl={{alpha: false, antialias: false, logarithmicDepthBuffer: true}}
                style={{...styles.top, background:dark?"#000":"#fff"}}
                camera={{position:[0,0,500], far:2000}}
                pixelRatio={window.devicePixelRatio}
                onCreated ={({gl}:any) => {
                    gl.outputEncoding = THREE.sRGBEncoding
                    gl.toneMapping    = THREE.ACESFilmicToneMapping}}>
            <ambientLight intensity={1.1} />
            <pointLight position={[100, 100, 100]} intensity={2.2} />
            <pointLight position={[-100, -100, -100]} intensity={5} color="red" />
            <gridHelper position={[0,-1000,0]} args={[2000,50]}/>
            <TransformControls>
                <Target url="/static/core/kinect.mp4"/>
            </TransformControls>
        </Canvas>
    )
}
export const codeKinect =
`
import {Kienct} from '@tsei/core'
import {Canvas} from 'react-three-fiber'
const MyCanvas = () =>
    <Canvas>
        <Kinect />
    </Canvas
`
