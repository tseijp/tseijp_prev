import {useState, useCallback, useRef} from 'react'
import {PagesType, UsePagesProps, UsePagesAction} from '../types'

/***# usePages API Options : This is a hook to record the URL of the Restfl API
  * `const [pages, set] = usePages(host, config)`
  *     host:string is host url e.g. "tsei.jp" or ["tsei.jp"]
  * ## Configs
  *   TODO
  * ## Return Values
  * pages : {...}
  *    *home:boolean is now home or not
  *     auth:boolean is user is login or not
  *     dark:boolean is user device is dark mode
  *     cursor :number is last fetched id
  *    *hosturl:string  e.g. "http://localhost:8000"
  *     username:string e.g. tseijp
  *     userlang:string e.g. ja, en
  * setPages : ( URL : string e.g. `/note/` ) => {
  *     set : cursor, hosturl, username, userlang
  *     run : window.history.pushState('','',URL)
  * }
 ***/
export function cP2P (props:PagesType) : PagesType {
    const position = window.location.pathname.split('/').filter(v=>v)
    return props.map((prop:any)=>({
        active : prop.url===position[0],
        bind : (query:string="")=>!prop?.url ? null : {
            onClick : ()=>window.open(prop.url+query,"blank")
        },
        ...prop
    }))
}
export const usePages = (
    props:UsePagesProps,
) : [PagesType, UsePagesAction]=> {
    if (typeof props==="function")
        props = props()
    const [pages, set] = useState( cP2P(props) )
    const propsRef = useRef(props)
    const setPages = useCallback((state)=>{
        if (typeof state==="function")
            state = state(propsRef.current)
        propsRef.current = state
        set( cP2P(state) )
	}, [])
    return [pages, setPages]
}
/*
export const App = () => {
    const [pages, set] = usePages([
        { url:"note", icon:{fa:"note"} },
        { url:"hook", icon:{fa:"hook"} },
    ])
    // pages : [["note",{}],[]...]
    return (
        {pages.map(({url,icon,bind})=>
            <Icon url={url} {...icon} {...bind()}/>
        )}
    )
}
 */
