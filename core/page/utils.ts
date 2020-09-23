import axios  from 'axios'
import * as THREE from 'three'
import * as HOOKS from './hooks'
import * as MESHS from './meshs'
import {Credit, URLType, Page} from '../src'
const oneUpper =(text:string)=> text.charAt(0).toUpperCase()+text.slice(1).toLowerCase()
// ************************* FOR HOOK ************************* //
export type  HookPage = {Hook:any}
export const hookPage = {
    Hook: ({id=""}) => (HOOKS as any)[oneUpper(id)] || null,
}
// ************************* FOR MESH ************************* //
const canvas = {
    Kinect:{},
    Swarm :{
        gl: {antialias:false, logarithmicDepthBuffer:true},
        camera: {position:[0,-2,3]},
        onCreated: ({gl}:any)=>{gl.outputEncoding=THREE.sRGBEncoding},
        pixelRatio: window.devicePixelRatio,
    }
}
export type  MeshPage = {canvas:any, Mesh:any}
export const meshPage = {
    Mesh  :({id=""}) => (MESHS  as any)[oneUpper(id)] || null,
    Canvas:({id=""}) => (canvas as any)[oneUpper(id)] || null,
}

// ************************* FOR NOTE ************************* //
export type CustomPage = {
    portname:string[], isHome:boolean,
    pathname:string[], status:string, }
export const customPage : Partial<Page<CustomPage>> = {
    isSign:false,status:"", portname: ({isLocal}) => isLocal?["3000","8000","8000"]:[],
    isHome:({id}) => !id  , pathname: ({id,status}) => [
            `/note/${ id?id+'/':'' }`,
        `/api/note/${ id?id+'/':'' }`,
        status!=="UP"? `/auth/`: `/api/user/`
    ]
}
export const scrollTop = () => document.getElementById('root')?.scroll({top:0,left:0,behavior: 'smooth',});
export const pageConfig = { onChange:() => scrollTop() }
export const fetcher = async (
    url:URLType,
    headers:any={'Content-Type':'application/json'}
) =>  {
    return axios
        .get(url.href, headers)
        .then(res => {
            if(!res || res.status!==200)
                throw new Error('Bad Request')
            return res.data
        })
}
export const signin = async (
    url:URLType,
    cred:Credit,
    headers:any={'Content-Type':'application/json'}
) => {
    return axios
        .post(url.href, cred, {headers})
        .then((res:any) => {
            if (res.status>201 || !res.data.token)
                throw new Error('Bad Request')
            return {username:cred.username, authtoken:res.data.token}
    })
}
