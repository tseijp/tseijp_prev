// # usePages API Options : This is a hook to record the URL of the Restfl API
//     `const [pages, set] = usePages(host, config)`
//      host:string is host url e.g. "tsei.jp" or ["tsei.jp"]
// ## Configs
//     TODO
// ## Return Values
//     export type Pages = {
//         home    ?:boolean     ,// is now home or not
//         auth    ?:boolean     ,// is user is login or not
//         dark    ?:boolean     ,// is user device is dark mode
//         cursor  ?:number|null ,// is last fetched id
//         hosturl ?:string|null ,// e.g. "http://localhost:8000"
//         userlang?:string|null ,// e.g. ja, en
//         username?:string|null ,// e.g. tseijp
//     }
//     setPages = ( URL : string e.g. `/note/` ) => {
//         set : cursor, hosturl, username, userlang
//         run : window.history.pushState('','',URL)
//     }

import {useState, useCallback, useRef} from 'react'
import {Pages, BasicProps, BasicState, BasicAction} from '../types'
import {normPages} from '../utils'
export const usePages = (
    initProps:BasicProps<Pages>={},
) : [Pages, BasicAction<Pages>] => {
    if (typeof initProps==="function")
        initProps = initProps()
    const pagesRef = useRef<Pages>(normPages(initProps))
    const [pages, set] = useState<Pages>(pagesRef.current)
    //  ************************* setPages *************************  //
    const setPages = useCallback((initState:BasicState<Pages>) => {
        if (typeof initState==="function")
            initState = initState(pagesRef.current)
        const state = normPages(initState, pagesRef.current)
        set(state)
        //console.log("\n\t\t~~setPages~~\n", initState, state)
        if ( typeof state.pathname==="string" && state.pathname!==pagesRef.current.pathname)
            window.history.pushState('','', state.pathname)
        pagesRef.current = state
    }, [set])
    return [pages, setPages]
}

/* Prev
export type PagesType = {
    [key:string]:any,
    url  : string,
    bind?: (q?:string)=>(null | {
        onClick?:void
    })
}[]
export type UsePagesProps  = BasicProps<PagesType>
export type UsePagesState  = BasicState<PagesType>
export type UsePagesAction = BasicAction<PagesType>
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
