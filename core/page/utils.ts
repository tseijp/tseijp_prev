import axios  from 'axios'
import {Credit} from '../src'
import {URLType, Page} from '../src/types'
//const  {animateScroll} = require('react-scroll');

export type CustomPage = {
    portname:string[], isHome:boolean,
    pathname:string[], status:string,}
export const customPage : Partial<Page<CustomPage>> = {
    isSign:false,status:"", portname: ({isLocal}) => isLocal?["3000","8000","8000"]:[],
    isHome:({id}) => !id  , pathname: ({id,status}) => [
            `/note/${ id?id+'/':'' }`,
        `/api/note/${ id?id+'/':'' }`,
        status!=="UP"? `/auth/`: `/api/user/`
    ]
}
export const pageConfig = {
    onChange:() => {
        document.getElementById('root')?.scroll({top:0,left: 0,behavior: 'smooth',});
        //setTimeout(() => {
            /*
            animateScroll.scrollToTop({
                duration: 800,
                delay: 1000,
                smooth: 'easeInOutQuart'
            })
            */
        //}, 1)
    }
}
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
