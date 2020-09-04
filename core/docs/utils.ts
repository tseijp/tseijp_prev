import axios  from 'axios'
import {UserCredit, joinURL} from '../src'
//const url = window.location.origin.match('localhost')?"http://localhost:8000":"https://tsei.jp"
//const headers = {'Content-Type':'application/json'}
export const fetcher = async (
    url:string|string[],
    headers:any={'Content-Type':'application/json'}
) =>  {
    if (url instanceof Array)
        url = joinURL(...url)
    return axios
        .get(url, headers)
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
