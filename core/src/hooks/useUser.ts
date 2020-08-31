import { useCallback, useState, useMemo} from 'react'
import {User,UserProps,UserHandler,UserConfig,} from '../types'
import {useCookies} from 'react-cookie'
//import axios from 'axios';
//import {useCookie} from './useCookie';

// TODO : from usePages : add following keys
//userlang?:string|null,// e.g. ja, en
//username?:string|null,// e.g. tseijp
// default
//userlang:window.navigator.language||null, TODO to useUser
//username:null,

export const useUser = (
    props :UserProps={},
    config:UserConfig={url:'', keys:['username','authtoken']} // TODO to config.keys.map
):[ User, (fn?:UserHandler)=>void ] => {
    const [cookies, setCookies, rm] = useCookies(config.keys)
    const [inup, setINUP] = useState(cookies.username?'IN':'UP')
    const [credit, setCred] = useState({username:cookies.username as string||'',password:'',email:''})
    const setUser = useCallback((fn=null) => {
        const {onSign=null,onSignin=null,onSignout=null,onError=null} = props
        if (!fn) return setINUP(p=>p!=="IN"?"IN":"UP")
        return cookies.authtoken
          ? (rm('authtoken',{path:'/'}), onSign&&onSign(), onSignout&&onSignout())
          : fn && fn(credit)
        .then((user:{username:string,authtoken:string})=>{
            if (!user.username || !user.authtoken)
                throw new Error()
            onSign   && onSign()  ; setCookies("username", user.username ,{path:'/'});
            onSignin && onSignin(); setCookies("authtoken",user.authtoken,{path:'/'});
        })
        .catch((_:any)=>onError&&onError())
    }, [cookies,setCookies,rm,credit,props] )
    const onChange = useCallback(({target={name:'',value:''}}) =>
        setCred(p=>({...p, [target.name]:target.value||''}))
    , [])
    const input = useMemo(()=>{
        return Object.assign({},
            ...['username','password','email'].map(name => ({[name]:{
                ...(name==="password"
                     ? {autoComplete:"on" }
                     : {error:"wrong",success:"right"}),
                value:(credit as any)[name], name, onChange,
                type :name==="username"?"text":name,
                label:`Type your ${name}`,
                group:true, validate:true,
        }})))
    }, [credit, onChange])
    return useMemo(() => [{
        username :cookies.cookies  ||'',
        authtoken:cookies.authtoken||'',
        credit, input, status:cookies.authtoken?"OUT":inup
    }, setUser], [cookies, credit, input, inup, setUser])
}
/* Example
const App = ({login, host='https://'}) => {
    const [credit, setCred] = useState({username:'',password:'',email:''})
    const [user, set] = useUser(()=>login(host,credit), [login,host,credit])
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
   <MDBInput value={credit.username} onChange={onChange} name="username" type="text"
       label="Type your username" icon="user" group validate error="wrong" success="right"/>
   <MDBInput value={credit.password} onChange={onChange} name="password" type="password"
       label="Type your password" icon="lock" group validate autoComplete="on" />
   {inup[0]==="UP" &&
   <MDBInput value={credit.email} onChange={onChange} name="email" type="email"
       label="Type your email" icon="envelope" group validate error="wrong" success="right"/> }
*/
