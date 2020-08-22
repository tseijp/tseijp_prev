import React, { Suspense, useRef } from "react"
import { Canvas } from "react-three-fiber"
//import { Controls} from 'react-three-gui';
import Model from "./Model"
import Shader from './Shader';
//import { getMousePos } from "./utils"
//import "./styles.css"
import Logerror from '../Logerror';
import Layout from '../components/Layout';

const App = (props) => {
  const mouse = useRef({ x:10000, y:10000 })
  return (
      <Logerror>
        <Layout/>
        <Canvas shadowMap
            pixelRatio={window.devicePixelRatio}
            camera={{ position:[0, -3, 3] }}
            onMouseMove={({clientX:x,xlientY:y})=>(mouse.current = {x,y})}
            style={{position:"fixed",width:"100%",height:"100%",top:0,left:0}}>
            <fog attach="fog" args={[0xdfdfdf, 35, 65]} />
            <hemisphereLight skyColor={"black"} groundColor={0xffffff} intensity={0.68} position={[0, 50, 0]} />
            <directionalLight position={[-8, 12, 8]} castShadow />
            <mesh position={[0, -3, -10]}>
                <circleBufferGeometry attach="geometry" args={[8*4, 64]}/>
                <Shader />
            </mesh>
            <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -11, 0]} receiveShadow>
                <planeGeometry attach="geometry" args={[5000, 5000, 1, 1]} />
                <Shader />
            </mesh>
            <Suspense fallback={null}>
                <Model mouse={mouse} position={[0, -11, 0]} scale={[7, 7, 7]} />
            </Suspense>
        </Canvas>
    </Logerror>
  )
}
export default App;
