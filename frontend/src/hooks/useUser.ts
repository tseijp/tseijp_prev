import { useCallback, useState, useMemo} from 'react'
//import axios from 'axios';
//import {useCookie} from './useCookie';
import {User,UseUserHandler, UseUserConfig,SetUserHandler} from '../types'
import {useCookies} from 'react-cookie'
export const useUser = (
    { onSign,onSignin,onSignout,onError}:UseUserHandler={
      onSign:null,onSignin:null,onSignout:null,onError:null
    },
    config:UseUserConfig={url:'', keys:['username','authtoken']}
) : [User, (fn?:SetUserHandler)=>void] => {
    const [cookies, set, rm] = useCookies(config.keys)
    const [inup, setINUP] = useState(cookies.username?'IN':'UP')
    const [cred, setCred] = useState({username:cookies.username as string||'',password:'',email:''})
    const setUser = useCallback((fn=null)=> {
        if (!fn) return setINUP(p=>p!=="IN"?"IN":"UP")
        return cookies.authtoken
          ? (rm('authtoken',{path:'/'}), onSign&&onSign(), onSignout&&onSignout())
          : fn && fn(cred)
        .then((user:{username:string,authtoken:string})=>{
            if(!user.username||!user.authtoken)
                throw new Error()
            onSign && onSign()
            onSignin && onSignin()
            set("username", user.username ,{path:'/'}) // TODO to config.keys.map
            set("authtoken",user.authtoken,{path:'/'})
        })
        .catch((_:any)=>onError&&onError())
    }, [cookies, set, rm, cred, onSign,onSignin,onSignout,onError] )
    const onChange = useCallback(({target={name:'',value:''}}) => {
        setCred(p=>({...p, [target.name]:target.value||''}))
    }, [])
    //(({target})=>setCred(p=>({...p,[target.name]:target.value})),[])
    const input = useMemo(()=>{
        return Object.assign({},...['username','password','email'].map(name=>({[name]:{
            value:(cred as any)[name], name,
            type:name==="username"?"text":name,
            label:`Type your ${name}`,
            ...(name==="password"?{autoComplete:"on" }:{error:"wrong",success:"right"}),
            group:true, validate:true, onChange,
        }})))
    }, [cred, onChange])
    return useMemo(()=>[{
        username :cookies.cookies  ||'',
        authtoken:cookies.authtoken||'',
        cred, input, status:cookies.authtoken?"OUT":inup
    }, setUser], [cookies, cred, input, inup, setUser])
}
/* Example
const App = ({login, host='https://'}) => {
    const [cred, setCred] = useState({username:'',password:'',email:''})
    const [user, set] = useUser(()=>login(host,cred), [login,host,cred])
    return user ? (
        <>
            <h1>Hello ! {user.username} ></h1>
            <button onClick={()=>set(null)}>Signout</button>
        </>
    ) : (
        <>
            <input value={username} onChange={}/>
            <input value={password} onChange={}/>
            <button onClick={()=>set()}></button>
            }
        </>
    )
}
 */
/* REFv
   <MDBInput value={cred.username} onChange={onChange} name="username" type="text"
       label="Type your username" icon="user" group validate error="wrong" success="right"/>
   <MDBInput value={cred.password} onChange={onChange} name="password" type="password"
       label="Type your password" icon="lock" group validate autoComplete="on" />
   {inup[0]==="UP" &&
   <MDBInput value={cred.email} onChange={onChange} name="email" type="email"
       label="Type your email" icon="envelope" group validate error="wrong" success="right"/> }
*/
