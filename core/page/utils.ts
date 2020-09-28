import axios  from 'axios'
import * as THREE from 'three'
import * as MESHS from './meshs'
import * as CODES from './codes'
import {Credit, URLType, Page, topUp} from '../src'
// *************************📋 FOR NOTE 📋************************* //
export const scrollTop=()=>document.getElementById('root')?.scroll({top:0,left:0,behavior:'smooth',});
export const pageConfig = { onChange:() => scrollTop() }
export type CustomPage =
   {portname:string[], isHome:boolean,
    pathname:string[], status:string, }
export const customPage : Partial<Page<CustomPage>> = {
    isSign:false,status:"", portname: ({isLocal}) => isLocal?["3000","8000","8000"]:[],
    isHome:({id}) => !id  , pathname: ({id,status}) =>
        [   `/note/${ id?id+'/':'' }`,
        `/api/note/${ id?id+'/':'' }`,
        status!=="UP"? `/auth/`: `/api/user/`]
}
export const fetcher = async (url:URLType,headers={'Content-Type':'application/json'}) =>
   axios.get(url.href, {headers})
        .then(res => {
            if(!res || res.status!==200)
                throw new Error('Bad Request')
            return res.data
        })
export const signin = async (url:URLType, cred:Credit, headers={'Content-Type':'application/json'}) =>
   axios.post(url.href, cred, {headers})
        .then((res) => {
            if (res.status>201 || !res.data.token)
                throw new Error('Bad Request')
            return {username:cred.username, authtoken:res.data.token}
        })

// *************************🤏 FOR HOOK 🤏************************* //
export const hookTree = [
    ["Components","Card","Code","Grow",],//"Head","Icon"],
    ["Containers","Notes","Split","Trees"],
    ["Mesh","Kinect","Model","Swarm"],
    "Mdmd"
]
export type  HookPage = {pathname:string, Hook:any, code:any, codes:any}
const getval = (obj={},key='') => key in obj ? (obj as any)[key] : ""
export const hookPage = {
    pathname: ({id=""}) => `/hook/${id}`,
    Hook : ({id="",codes={}}) => getval(codes,          topUp(id)),
    code : ({id="",codes={}}) => getval(codes, 'code' + topUp(id)),
    codes: Object.assign({}, ...Object.entries(CODES).map(([k,v])=>({[k]:v})))
}
// *************************🧠 FOR MESH 🧠************************* //
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
    Mesh  :({id=""}) => (MESHS  as any)[topUp(id)] || null,
    Canvas:({id=""}) => (canvas as any)[topUp(id)] || null,
}
