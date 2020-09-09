/** ************************* 🙍‍♂️ USE USER 🙍 *************************
 *  This is a hook to manage user info and API
 *    - const [user, set] = useUser(url, fetcher)
 *    - ```
 *      ```
 *  # ***** useUser API Configs *****
 *  ## Props Values
 *    - `const _ = usePage(@initURL, @initFetcher, @initConifg)`
 *    - @initURL:string
 *    - @initFetcher:function
 *    - @initConfig : {
 *        @
 *      }
 *  ## Return Values
 *    - `const [user, setUser] = useUser(...)`
 *    - @user : {
 *        @username : user name from fetched API e.g. tseijp
 *        @authtoken: user token from cookie
 *        @input    : for input Components
 *       ~@credit   : the value to send at fetching~
 *        @status   : the acton at fetch e.g. IN, UP, OUT or ""
 *        @userlang : user language from window.navigator.language e.g. ja, en
 *      }
 *    - @setUser
 *      `setUser()`       : Toggle fetching
 *      ~`setUser(null)`   : switch status IN->UP or UP->IN~
 *      ~`setUser(boolean)`: switch status '' or IN|UP|OUT~
 *  # TODO : from usePages : add following keys
 ** ************************* ************** *************************/
import {useCallback, useState, useMemo, useRef} from 'react'
import {useCookies} from 'react-cookie'
import {URLType,User,UserHandler,UserConfig} from '../types'
import {defaultUserConfig} from '../utils'
export const useUser = (
    initURL :URLType,
    initSign:any,
    initConfig:Partial<UserConfig>=defaultUserConfig // TODO to config.keys.map
):[ User, (fn?:string|UserHandler)=>void ] => {
    const urlRef    = useRef<URLType>(initURL)
    const signinRef = useRef(initSign)
    const configRef = useRef<UserConfig>({...defaultUserConfig,...initConfig})
    const [cookies, setCookies, rm] = useCookies(configRef.current.keys)
    const [inup, setINUP] = useState(cookies.username?'IN':'UP')
    const [credit, setCred] = useState({username:cookies.username as string||'',password:'',email:''})
    // ************************* 🙍‍♂️ For setUser 🙍 ************************* //
    const setUser = useCallback((fn=null) => {
        /*TODO
        const {onSign=null,onSignin=null,onSignout=null,onError=null} = initConfig
        console.log('\t\tsetUser', fn, sign)
        if (typeof fn==="string")return fn?setINUP(fn):setSign(p=>!p)
        if (!fn) return setINUP(p=>p!=="IN"?"IN":"UP")
        return cookies.authtoken
          ? (rm('authtoken',{path:'/'}), setSign(false), onSign&&onSign(), onSignout&&onSignout())
          : fn && fn(credit)
        .then((user:{username:string,authtoken:string})=>{
            if (!user.username || !user.authtoken)
                throw new Error()
            setSign(false)
            onSign   && onSign()  ; setCookies("username", user.username ,{path:'/'});
            onSignin && onSignin(); setCookies("authtoken",user.authtoken,{path:'/'});
        })
        .catch((_:any)=>onError&&onError())
        */
    }, [cookies,setCookies,rm,credit] )
    // ************************* 🙍‍♂️ For render 🙍 ************************* //
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
    return [useMemo(() => ({
        username :cookies.cookies  ||'',
        authtoken:cookies.authtoken||'', input,
        //status : sign?"":cookies.authtoken?"OUT":inup
    }), [cookies, input, inup]), setUser]
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
