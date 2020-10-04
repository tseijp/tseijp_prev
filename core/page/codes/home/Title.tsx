import React, {FC, Suspense} from 'react'
import {Flex} from 'react-three-flex'
import {useSpring} from 'react-spring'
import {useGesture} from 'react-use-gesture'
import {Canvas,useFrame,useThree} from 'react-three-fiber'
import {useControl as use} from 'react-three-gui'
import {Title} from '../../../src'

const items = ["TSEIJP", "TEST"]
const Content:FC = (props) => {
    const {viewport} = useThree()
    return (
        <Flex dir="column"
            position={[-viewport.width/2, viewport.height/2, 0]}
            size    ={[ viewport.width  , viewport.height  , 0]}>
            <Title {...props}/>
        </Flex>
    )
}
const Control = ({position=[0,0,0]}) => {
    useFrame(({camera}) => {
        camera.position.x =-position[0]
        camera.position.y = position[1]
        camera.position.z = position[2]
    })
    return null
}
export const HookTitle:FC = () => {
    const dark = use('dark', {type:'boolean', value:false})
    const size = use('size', {type:'number', value:1})
    const camera = use('camera', {type:'xypad', value: {x:0,y:0}, scrub:true, distance:10})
    const position = use('position', {type:'xypad', value: {x:0,y:0}, scrub:true, distance:10})
    const children = use('title', {type:"select", value:items[0], items})
    const [, set] = useSpring(()=>({x:0,y:0}))
    useGesture({
        onWheel:({offset:[,y],vxvy:[,vy]}) => vy && set({y})
    })
    return (
        <Canvas
            style={{width:"100%",height:"100vh",margin:0,padding:0}}
            shadowMap concurrent pixelRatio={2}
            noEvents colorManagement
            camera={{position:[0,0,10],far:1000}}
            gl={{powerPreference:'high-performance', alpha:true, antialias:false, stencil:false, depth:false}}
            onCreated={({gl}) => gl.setClearColor('#f5f5f5')}>
            <pointLight position={[-10, -10, -10]} intensity={1} />
            <ambientLight intensity={0.4} />
            <spotLight  castShadow angle={0.3} penumbra ={1} shadow-mapSize-width ={1024}
                        position={[0, 10, 20]} intensity={5} shadow-mapSize-height={1024} />
            <Suspense fallback={null}>
                <Content {...{
                    position:[position.x, position.y, 0],
                    children,dark,size}}/>
            </Suspense>
            <Control {...{position:[camera.x, camera.y, 10]}}/>
        </Canvas>
    )
}
export const codeTitle =
`import {Title} from '@tsei/core'
const App = () =>
    <Title/>`
