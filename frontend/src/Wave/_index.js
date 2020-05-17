//https://threejs.org/examples/#webaudio_visualizer
//https://github.com/mrdoob/three.js/blob/master/examples/webaudio_visualizer.html
import React,{useRef,useState,useEffect} from 'react';
import * as THREE from 'three';
import shaderV from './shaderV.glsl';
import shaderF from './shaderF.glsl';
const useMediaElement = (url) => {
    const [audio] = useState(new Audio(url));
    useEffect(()=>{
        audio.loop = true;
        const audioPromise = audio.play();
        if(audioPromise !== undefined)
            audioPromise.then(_=>null).catch(e=>console.log(e))
    },[audio])
    return audio
}
const Wave = () => {
    const [vertexShader, setVertexShader] = useState('');
    const [fragmentShader, setFragmentShader] = useState('');
    //const [analizer, setAnalizer]= useState(null);
    const scene = useRef(new THREE.Scene());
    const camera = useRef(new THREE.Camera());
    const uniforms = useRef({tAudioData:{value:null}});
    const mediaElement = useMediaElement('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
    useEffect(()=>{
        console.log("init");
        const fftSize = 128;
        const renderer = new THREE.WebGLRenderer({canvas:document.getElementById('renderer'),antialias:true});
        const listener = new THREE.AudioListener();
        const audio = new THREE.Audio( listener );
        audio.setMediaElementSource( mediaElement );
        const analyser = new THREE.AudioAnalyser( audio, fftSize );
        uniforms.current.tAudioData.value = new THREE.DataTexture(analyser.data, fftSize/2, 1, THREE.LuminanceFormat);
        const render = () => {
            //requestAnimationFrame( render );
            analyser.getFrequencyData();
            uniforms.current.tAudioData.value.needsUpdate = true;
            renderer.render( scene.current, camera.current );
        }
        const resize = () => renderer.setSize( window.innerWidth, window.innerHeight )
        render()
        resize()
        window.addEventListener( 'resize', resize );
        fetch(shaderV).then(res=>res.text()).then(res=>setVertexShader(res));
        fetch(shaderF).then(res=>res.text()).then(res=>setFragmentShader(res));
    },[mediaElement]);

    useEffect(()=>{
        console.log("mesh");
        if(!vertexShader||!fragmentShader)
            return
        const material = new THREE.ShaderMaterial({uniforms:uniforms.current, vertexShader, fragmentShader});
        const geometry = new THREE.PlaneBufferGeometry(1, 1);
        const mesh = new THREE.Mesh(material, geometry);
        scene.current.add(mesh);
    }, [vertexShader, fragmentShader]);

    return (
        <>
            <canvas id="renderer"/>
        </>
    )
}


export default Wave;
