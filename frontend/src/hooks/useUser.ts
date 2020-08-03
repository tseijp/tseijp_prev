import {useEffect, useCallback} from 'react'
//import axios from 'axios';
//import {useCookie} from './useCookie';
import {User, UseUser} from '../types'
import {useCookies} from 'react-cookie'

export const useUser:UseUser<User> = ( getUser, dependencies=[] ) => {
    //const [username, setUsername] = useCookie('username', '')
    //const [authtoken, setAuthtoken] = useCookie('authtoken', '')
    const [cookies, set] = useCookies(['username','authtoken'])
    const setUser = useCallback(()=> {
        const user = getUser && getUser()
        user && user.username && set('username',user.username)
        user && user.authtoken && set('authtoken',user.authtoken)
    }, [set, getUser] )
    useEffect(()=>setUser(), [dependencies, setUser])
    return [ cookies as User, setUser]
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
