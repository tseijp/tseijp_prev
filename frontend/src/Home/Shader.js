import React, {useRef} from 'react'
import * as THREE from "three";
//import shaderF from './shaderF.glsl'
//import shaderV from './shaderV.glsl'
import { useFrame, useThree } from 'react-three-fiber'
//import Logerror from '../Logerror'
const fragmentShader = `
varying vec2 v_uv;
varying vec3 v_position;

uniform float uTime;
uniform vec3 uColor;
uniform vec2 uMouse;
uniform vec2 uResolution;

mat2 getRotationMatrix(float theta){return mat2(cos(theta), -sin(theta), sin(theta), cos(theta));}
mat2 getScaleMatrix(float scale){return mat2(scale,0, 0,scale);}
float ellipse(vec2 pt, vec2 center, vec2 radius){return 1.0 - step(0.5, length(pt - center));}
float ellipse(vec2 pt, vec2 center, vec2 radius, bool soften){return 1.0 - smoothstep(radius.x-radius.x*0.5, radius.y+radius.y*0.5, length(pt-center));}
float ellipse(vec2 pt, vec2 center, vec2 radius, float linewidth){return step(radius.x-linewidth/2.0, length(pt - center)) - step(radius.y+linewidth/2.0, length(pt - center));}
float rect(vec2 pt, vec2 center, vec2 size, vec2 anchor){return step(-size.x-anchor.x,pt.x-center.x)-step(size.x-anchor.x,pt.x-center.x)*step(-size.y-anchor.x,pt.y-center.y)-step(size.y-anchor.y,pt.y-center.y);}
float line(vec2 pt, float linewidth, float edge_thickness){return smoothstep(pt.x-linewidth/2.0-edge_thickness, pt.x+linewidth/2.0, pt.y)-smoothstep(pt.x+linewidth/2.0-edge_thickness, pt.x+linewidth/2.0, pt.y);}
float random(vec2 pt, float seed){return fract(sin(dot(pt, vec2(12.9,78.2))+seed)*43758.5);}
float noise(vec2 st, float seed){
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    float a = random(i+vec2(0.0,0.0),seed);
    float b = random(i+vec2(1.0,0.0),seed);
    float c = random(i+vec2(0.0,1.0),seed);
    float d = random(i+vec2(1.0,1.0),seed);
    return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
}
void main(){
    vec2 mouse = uMouse;
    vec2 pos   = vec2(v_uv*mix(0.0,0.01,distance(mouse,vec2(0.0))));
    vec3 color = smoothstep(0.4,0.6,noise(pos*mouse, uTime))*vec3(1.0);
    gl_FragColor = vec4(color, 1.0);
}
`
const vertexShader = `
uniform float offset;
varying vec2 v_uv;
varying vec3 v_position;

void main(){
  v_uv = uv;
  v_position = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
}
`

const Shader = () => {
    const ref= useRef(null)
    const {size} = useThree()
    useFrame(({mouse})=>{
        ref.current.uniforms.uTime.value+=100;
        ref.current.uniforms.uMouse.value={x:mouse.x*size.width/2,y:mouse.y*size.height/2};
        //ref.current.material.uniforms.uResolution.value={x:size.width,y:size.heigth}
    })
    const uniforms = {
        uColor:{value:new THREE.Color(0x00FF00)},
        uResolution:{value:{x:size.width,y:size.width}},
        uTime:{value:0},
        uMouse:{value:{x:0,y:0}}
    }
    return (
        <shaderMaterial ref={ref} attach="material"args={[{uniforms,vertexShader,fragmentShader}]} skinning={false}/>
    )
}
export default Shader;
/*
const Home = () => {
    const camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 );
    camera.position.z = 1
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix();
    return (
        <ErrorBoundary>
            <Layout/>
            <Canvas camera={camera} style={{position:"fixed",width:'100%',height:'100%'}}>
                <hemisphereLight skyColor={0xffffbb} groundColor={0x080820}/>
                <directionalLight color={0xffff00} intensity={1}/>
                <Noise />
            </Canvas>
        </ErrorBoundary>
    )
}
export default Home;
*/
/*
const Home = (props) => {
    const [vertexShader, setVertexShader] = useState('');
    const [fragmentShader, setFragmentShader] = useState('');
    const scene = useRef(new THREE.Scene());
    const camera = useRef(new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 ));
    const uniforms = React.useRef({
        uColor:{value:new THREE.Color(0x00FF00)},
        uTime:{value:0.0}, uMouse:{value:{x:0.0,y:0.0}},
        uResolution:{value:{x:window.innerWidth,y:window.innerHeight}},
    })
    useEffect(()=>{
        const renderer = new THREE.WebGLRenderer({canvas:document.getElementById('renderer')})
        const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
        const light   = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set( 1, 1, 1 );
        scene.current.add(light);
        scene.current.add(ambient);
        camera.current.position.z = 1;
        const render = () => {
            requestAnimationFrame( render );
            renderer.render( scene.current, camera.current );
            uniforms.current.uTime.value += 10;
        }
        const resize = () => {
            renderer.setSize(window.innerWidth,window.innerHeight );
            camera.current.aspect = window.innerWidth/window.innerHeight
            camera.current.updateProjectionMatrix();
            uniforms.current.uResolution.value.x = window.innerWidth;
            uniforms.current.uResolution.value.y = window.innerHeight;
        }
        const mouseMove = (e) => {
            uniforms.current.uMouse.value.x = (e.touches)?e.touches[0].clientX:e.clientX
            uniforms.current.uMouse.value.y = (e.touches)?e.touches[0].clientY:e.clientY
        }
        render()
        resize()
        window.addEventListener( 'resize', resize );
        window.addEventListener( 'touchmove', mouseMove );
        window.addEventListener( 'mousemove', mouseMove );
        fetch(shaderV).then(res=>res.text()).then(res=>setVertexShader(res))
        fetch(shaderF).then(res=>res.text()).then(res=>setFragmentShader(res))
    }, [])
    useEffect(()=>{
        if (!vertexShader||!fragmentShader)
            return
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({uniforms:uniforms.current, vertexShader,fragmentShader})
        const plane = new THREE.Mesh( geometry, material );
        scene.current.add( plane );
    }, [vertexShader,fragmentShader,uniforms])
    return (
            <Layout isMargin={false}>
                <canvas style={{position:"fixed",top:0,left:0}} id="renderer"/>
            </Layout>
    )
}
*/
