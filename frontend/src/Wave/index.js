import React, {useState, useRef, useEffect} from 'react'
//import {RecoilRoot,atom,selector,useRecoilState,useRecoilValue} from 'recoil';
import * as THREE from "three";
//import {Canvas,useThree,useFrame} from 'react-three-fiber'

import Layout from '../components/Layout';
import shaderF from './shaderF.glsl';
import shaderV from './shaderV.glsl';
//const counterState = atom({key:"counterState", default:0});

const Home = (props) => {
    const [vertexShader, setVertexShader] = useState('');
    const [fragmentShader, setFragmentShader] = useState('');
    const scene = useRef(new THREE.Scene());
    const camera = useRef(new THREE.OrthographicCamera( -1, 1, 1, -1, 0.1, 10 ));
    const uniforms = React.useRef({
        u_time:{value:0.0},
        u_mouse:{value:{x:0.0,y:0.0}},
        u_resolution:{value:{x:window.innerWidth,y:window.innerHeight}},
        u_color:{value:new THREE.Color(0x00FF00)},
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
            uniforms.current.u_time.value += 10;
        }
        const resize = () => {
            renderer.setSize(window.innerWidth,window.innerHeight );
            camera.current.aspect = window.innerWidth/window.innerHeight
            camera.current.updateProjectionMatrix();
            uniforms.current.u_resolution.value.x = window.innerWidth;
            uniforms.current.u_resolution.value.y = window.innerHeight;
        }
        const mouseMove = (e) => {
            uniforms.current.u_mouse.value.x = (e.touches)?e.touches[0].clientX:e.clientX
            uniforms.current.u_mouse.value.y = (e.touches)?e.touches[0].clientY:e.clientY
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
export default Home;
