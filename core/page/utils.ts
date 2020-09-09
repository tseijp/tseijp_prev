import axios  from 'axios'
import {Credit, joinURL} from '../src'
import {NoteURL, Page} from '../src/types'
const  {animateScroll} = require('react-scroll');

export type CustomPage = Page<{
    portname:string[], isHome:boolean,
    pathname:string[], isSign:boolean,
}>
export const customPage : CustomPage = {
    isHome  : ({id})=>!id,   isSign:true,
    portname: ({isLocal}) => isLocal?["3000","8000","8000"]:[],
    pathname: ({id,isSign}) => [ // in ///error
            `/note/${ id?id+'/':'' }`,
        `/api/note/${ id?id+'/':'' }`,
        isSign? `/auth`: `/api/user`
    ]
}
/*
export type CustomPage = {isHome:boolean,portname:string[], pathname:string[]}
export const customPage : Page<{
    portname:string[], isHome:boolean,
    pathname:string[], sign:string,
}> = {
    isHome  : ({id})=>!id, sign:"",
    portname: ({isLocal}) => isLocal?["3000","8000","8000"]:[],
    pathname: ({id,sign}) => [ // in ///error
            `/note/${ id?id+'/':'' }`,
        `/api/note/${ id?id+'/':'' }`,
        sign==="in"? `/auth`: `/api/user`
    ]
}
*/

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
    cred:Credit,
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
