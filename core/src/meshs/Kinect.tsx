import React, { useMemo, useRef} from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

const cropValue=(dir:any)=>Object.assign({},...Object.keys(dir).map(key=>({[key]:{value:dir[key]}})))

const vertexShader = `
varying vec2 vUv;
uniform sampler2D map;
uniform float width, height, space, pointSize, zOffset, nearClipping, farClipping;
const float XtoZ = 1.11146; // tan( 1.0144686 / space ) * space;
const float YtoZ = 0.83359; // tan( 0.7898090 / space ) * space;

void main() {
    vUv = vec2( position.x / width, position.y / height );
    vec4 color = texture2D( map, vUv );
    float depth = ( color.r + color.g + color.b ) / 3.0;
    float z = ( 1.0 - depth ) * (farClipping - nearClipping) + nearClipping;
    vec4 pos = vec4(
        ( position.x / width - 0.5 ) * z * XtoZ,
        ( position.y / height - 0.5 ) * z * YtoZ,
        - z + zOffset,
        1.0
    );

    gl_PointSize = pointSize;
    gl_Position = projectionMatrix * modelViewMatrix * pos;
}
`
const fragmentShader = `
uniform sampler2D map;
varying vec2 vUv;
void main() {
    vec4 color = texture2D( map, vUv );
    gl_FragColor = vec4( color.r, color.g, color.b, .5);
}
`

export const Kinect = ({ url, /*center=[0,0,-1000],*/
        width=640, nearClipping=850, depthWrite=false,  pointSize=2, space=2,
        height=850, farClipping=4000, depthTest=false, zOffset=1000,
    }:any) => {
    // ******************** Mount ******************** //
    const geometry = useRef<any>()
    const material = useRef<any>()
    const map = useMemo<any>(()=>{
        const video = document.createElement('video');
        video.src   = url;
        video.loop  = true; video.load();
        video.muted = true; video.play();
        return new THREE.VideoTexture(video)
    }, [url])
    // ******************** Render ******************** //
    useFrame(()=>{
        const position = new Float32Array( width*height*3 )
        for ( var i=0, j=0, l=position.length; i<l; i+=3, j++ ) {
            position[ i ] = j % width;
            position[i+1] = Math.floor( j/width );
        }
        geometry.current?.setAttribute('position', new THREE.BufferAttribute(position,3));
    })
    const uniforms = cropValue({
        width, nearClipping, map, space,
        height, farClipping, pointSize, zOffset
    })
    return (
        <>
            <points position={[0,0,500]} >
                <bufferGeometry ref={geometry} attach="geometry"/>
                <shaderMaterial ref={material} attach="material"
                    {...{uniforms,
                        depthTest, fragmentShader,
                        depthWrite, vertexShader,
                    }}
                    blending={THREE.AdditiveBlending} transparent />
            </points>
        </>
    )
}
