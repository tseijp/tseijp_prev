import axios  from 'axios'
import {UserCredit, joinURL} from '../src'
import {NoteURL} from '../src/types'
export type CustomPage = {isHome:boolean,portname:string[], pathname:string[]}
const  {animateScroll} = require('react-scroll');

export const customPage = {
    isHome  : ({id}:any)=>!id,
    portname: ({isLocal}:any) => isLocal?["3000","8000"]:[],
    pathname: ({id}:any) => ['','/api'].map(s=>`${s}/note/${ id?id+'/':'' }`),
}
export const noteConfig = {
    onChange:()=>{
        animateScroll.scrollToTop({
        //    duration: 800,
            delay: 1000,
            smooth: 'easeInOutQuart'
        })
    }
}
export const fetcher = async (
    url:NoteURL,
    headers:any={'Content-Type':'application/json'}
) =>  {
    if (url instanceof Array)
        url = joinURL(...url)
    return axios
        .get(url as string, headers)
        .then(res => {
            if(!res || res.status!==200)
                throw new Error('Bad Request')
            return res.data
        })
}
export const signin = async (
    url:string|string[],
    cred:UserCredit,
    headers:any={'Content-Type':'application/json'}
) => {
    if (url instanceof Array)
        url = joinURL(...url)
    return axios
        .post(url, cred, {headers})
        .then((res:any) => {
            if (res.status>201 || !res.data.token)
                throw new Error('Bad Request')
            return {username:cred.username, authtoken:res.data.token}
    })
}
