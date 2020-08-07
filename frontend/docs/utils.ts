import axios  from 'axios'
import {UserCred} from '../src'
//const url = window.location.origin.match('localhost')?"http://localhost:8000":"https://tsei.jp"
//const headers = {'Content-Type':'application/json'}
export const geter = async (
    url:string,
    headers:any={'Content-Type':'application/json'}
) =>  {
    return axios.get(url, headers)
}

export const signin = async (
    url:string,cred:UserCred,
    headers:any={'Content-Type':'application/json'}
)=>{
    return axios
        .post(url, cred, {headers})
        .then((res:any) => {
            if (res.status>201 || !res.data.token)
                throw new Error('Bad Request')
            return {username:cred.username, authtoken:res.data.token}
    })
}
