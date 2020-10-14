
import * as THREE from "three";
import React, {
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";
import { Canvas, useThree, useFrame } from "react-three-fiber";
import { useAspect, Text, Html, Plane } from "drei";
// import { EffectComposer, Bloom } from "react-postprocessing";
import { Flex, Box } from "react-three-flex";
// import { Text } from "./Text";
// import {
//     Props,//type
//     useGrid,//hook
//     Player, Stage, //Title, mesh
//     Sides,Trans,//containers
// } from '../src'
type Vec3<T=number> = [T, T, T]

const state = {
  top: 0
};

const BackGrid = ({
    position=[0,-1,-8], rotation=[Math.PI/2,0,0], args=[80,80,128,128]
}: Partial<{position: Vec3, rotation: Vec3, args: any}>) => {
    const { scene } = useThree();
    useEffect(() => void (scene.fog = new THREE.FogExp2(0, 0.05)), [scene]);
    return (
        <Plane {...{position, rotation, args}}>
            <meshStandardMaterial color="#ea5455" wireframe side={THREE.DoubleSide} />
        </Plane>
    );
}

const Title:React.FC<Partial<{
    [key:string]:any, style:any, row:boolean, wrap:boolean,
    fontSize:number, maxWidth:number, space:number,
}>> = ({
    row=true, wrap=false, children, space=0.1, fontSize=0.4,
    maxWidth=undefined, style={}, ...props
}) => {
    return (
        <Box {...props}
            flexWrap={wrap?"wrap":undefined} justifyContent="center"
            flexDirection={row?"row":"column"}   alignItems="center">
            {React.Children.map(children, (child, key) =>
            <Box {...style} >
                <Text {...{key, fontSize, maxWidth}}
                    letterSpacing={space}>
                    {typeof child==="string"? child: (child as any)?.props?.children||''}
                    <meshStandardMaterial />
                </Text>
            </Box>
            )}
        </Box>
    )
}

function Page ({ onChangePages }:any) {
    const group = useRef<THREE.Group>();
    const {size} = useThree();
    const [vpWidth, vpHeight] = useAspect("cover", size.width, size.height);
    const vec = new THREE.Vector3();
    const handleReflow = useCallback((_,h=0) => onChangePages(h/vpHeight),[onChangePages, vpHeight]);
    useFrame(() => group.current?.position?.lerp(vec.set(0, state.top/100, 0), 0.1));
    return (
        <group ref={group}>
            <BackGrid />
            <Flex
                flexDirection="column"
                size={[vpWidth, vpHeight, 0]}
                onReflow={handleReflow}>
                <Title row wrap width="100%" height="100%"
                    fontSize={0.5} space={0.1}
                    style={{margin:0.05}}>
                    <>TSEI.jp</>
                </Title>
                <group position-z={-0.3}>
                    <Title row width="100%"
                        marginTop={0.3} marginBottom={0.1}
                        fontSize={0.4} maxWidth={vpWidth}
                        style={{marginLeft:0.3}}>
                        <>Flexing some Layout</>
                        <>Flexing some Layout</>
                    </Title>
                    <Title row width="100%"
                        marginTop={0.1} marginBottom={0.5}
                        fontSize={0.4} maxWidth={vpWidth/2}
                        style={{marginLeft:0.3}}>
                        <>with REACT THREE FLEX</>
                    </Title>
                </group>
                <group position-z={0.4}>
                    <Title row width="100%"
                        marginTop={0.8} marginBottom={1}
                        space={0.1} fontSize={0.2} maxWidth={vpWidth*0.8}
                        style={{margin:0.1}}>
                        <>ORDER WITH CONFIDENCE</>
                        <>ONE DAY DELIVERY</>
                    </Title>
                </group>
            </Flex>
        </group>
    );
}


export function Home() {
  const onScroll = (e:any) => (state.top = e.target.scrollTop);
  const [pages, setPages] = useState(0);
  return (
    <div>
        <Canvas colorManagement shadowMap
            gl={{ alpha: false }}
            camera={{position:[0,0,2], zoom:1}}
            style={{position:"absolute", width:"100%", height:"100%"}}>
            <pointLight position={[0,1,4]} intensity={0.1} />
            <ambientLight intensity={0.2} />
            <spotLight castShadow
                shadow-mapSize-width={1024} position={[1,1,1]}
                shadow-mapSize-height={1024} penumbra={1}/>
            <Suspense fallback={<Html center>loading..</Html>}>
              <Page onChangePages={setPages} />
            </Suspense>
        </Canvas>
      <div
      onScroll={onScroll}
      style={{  position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "auto",
        }}>
        <div style={{ height: `${pages * 100}vh` }} />
      </div>
    </div>
  );
}

//     const [dark, setDark] = useGrid<number>({init:0, md:1, lg:0  })
//     const [size, setSize] = useGrid<number>({init:0, md:1, lg:1.5})
//     const onScroll = (e:any) => (state.top = e.target.scrollTop);
//     const [pages, setPages] = useState(0);
//     return (
//         <div onScroll={onScroll} style={{width:"100%",height:"100%",background:dark?"#000":"#fff"}}>
//             <Canvas
//                 style={{width:"100%",height:`${pages * 100}vh`}}
//                 shadowMap concurrent pixelRatio={2}
//                 noEvents colorManagement camera={{position:[0,0,2],far:1000}}>
//                 <pointLight position={[-10, -10, -10]} intensity={1} />
//                 <ambientLight intensity={0.4} />
//                 <spotLight  castShadow angle={0.3} penumbra ={1} shadow-mapSize-width ={1024}
//                             position={[0, 10, 20]} intensity={5} shadow-mapSize-height={1024} />
//                 <Suspense fallback={null}>
//                     <Page onChangePages={setPages}/>
//                 </Suspense>
//             </Canvas>
//             <Sides {...{size}}>
//                 <a style={{color:"#818181"}} href="/"    >Home</a>
//                 <a style={{color:"#818181"}} href="/hook">Hook</a>
//                 <a style={{color:"#818181"}} href="/note">Note</a>
//             </Sides>
//             <Trans {...{size}}>
//                 <div onClick={()=>setDark((p:any)=>({md:p.lg,lg:p.md}))}>{dark?'🌞':'🌛'}</div>
//                 <div onClick={()=>setSize((p:any)=>({md:p.lg,lg:p.md}))}>{size<75?'👨':'👶'}</div>
//             </Trans>
//         </div>
//     )
// }

//     const {viewport} = useThree()
//     return (
//         <>
//             <Stage {...{dark,size,dist:100,amp:20}}/>
//             <axesHelper/>
//             <Flex dir="column"
//                 position={[-viewport.width/2, viewport.height/2, 0]}
//                 size    ={[ viewport.width  , viewport.height  , 0]}>
//                 <Title {...{dark,size}}/>
//             </Flex>
//             <Player position={[0,0,10]} rotation={[-Math.PI/2,0,0]}>
//                 <axesHelper/>
//             </Player>
//         </>
//     )
// }
