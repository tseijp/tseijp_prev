//import * as THREE from 'three'
import  React, {FC, //CSSProperties as CSS, FC, Children
        useRef,//useEffect, useState, useCallback, useLayoutEffect
        Suspense, } from 'react'
import {useThree, //useFrame, useLoader
        Canvas, } from 'react-three-fiber'
import {//useReflow, useFlexSize
        Flex, Box,} from 'react-three-flex'
// import { Line } from 'drei/abstractions/Line'
// import { Loader } from 'drei/prototyping/Loader'
// import { useAspect } from 'drei/misc/useAspect'
import { Text } from 'drei/abstractions/Text'
// import * as hooks from 'hooks'
//import {} from '../src'

const Content:FC = () => {
    const group = useRef()
    const {
        viewport,
        //size
    } = useThree()
    const scale = Math.min(1, viewport.width / 16)
    return (
        <group ref={group}>
            <Flex dir="column" position={[-viewport.width / 2, viewport.height / 2, 0]} size={[viewport.width, viewport.height, 0]}>
                <Box dir="row" width="100%" height="100%" align="center" justify="center">
                    <Box centerAnchor>
                        <Text
                            anchorX="center" position-z={0.5} fontSize={1.5*scale}
                            anchorY="middle" lineHeight={1.0} letterSpacing={-.05}
                            color="black" maxWidth={(viewport.width / 4) * 3}>
                            test
                        </Text>
                    </Box>
                </Box>
            </Flex>
        </group>
    )
}

export const Home:FC = () => {
    return (
        <div style={{width:"100%",height:"100%",margin:0,padding:0}}>
            <Canvas
                shadowMap concurrent pixelRatio={2}
                noEvents colorManagement camera={{position:[0,0,10],far:1000}}
                gl={{ powerPreference:'high-performance', alpha:false, antialias:false, stencil:false, depth:false }}
                onCreated={({ gl }) => gl.setClearColor('#f5f5f5')}>
                <pointLight position={[-10, -10, -10]} intensity={1} />
                <ambientLight intensity={0.4} />
                <spotLight  castShadow angle={0.3} penumbra ={1} shadow-mapSize-width ={1024}
                            position={[0, 10, 20]} intensity={5} shadow-mapSize-height={1024} />
                <Suspense fallback={null}>
                    <Content />
                </Suspense>
            </Canvas>
        </div>
    )
}
