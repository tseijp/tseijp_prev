//import axios from 'axios';
import {useRef, useMemo, useState, useEffect, useCallback} from 'react'
const Cookies = require("js-cookie");
const { useCookie } = require("@use-hook/use-cookie");

const useSignin = () => {
    const host = '192.168.0.112:8000'//window.location.host//
    const [username, setSigninname] = useCookie('username', '')
    const [authtoken, setAuthtoken] = useCookie('authtoken', null)
    const [signin, set] = useState({username, authtoken})
    const headers = useMemo(()=>({'Content-Type':'application/json'}),[])
    useEffect(()=>set({username, authtoken}), [username, authtoken])
    const setSignin = useCallback((cred,isSignIn=true)=> {//cred={username, password, email}
        if(!cred)
            return Cookies.remove('authtoken')
        const url =  `http://${host}/${isSignIn?"auth":"api/user"}/`
        /* TODO
        axios.post(url, cred, {headers}).then(res=>{
            if ((res.status===200||res.status===201) && res.data.token){
                setSigninname(cred.username, {path:"/"});
                setAuthtoken(res.data.token, {path:"/"});
            }//console.log(res);
        }).catch(e=>{return 500})
        */
    }, [host, headers])
    return [signin, setSignin]
}
export {useSignin}
