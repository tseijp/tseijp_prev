// # usePages API Options : This is a hook to record the URL of the Restfl API
//     `const [pages, set] = usePages(host, config)`
//      host:string is host url e.g. "tsei.jp" or ["tsei.jp"]
// ## Return Values
//     pages    : Pages
//     setPages : ( URL : string e.g. `/note/` ) => {
//         set : cursor, hosturl, username, userlang
//         run : window.history.pushState('','',URL)
//     }

import {useState, useCallback, useRef} from 'react'
import {Pages, BasicProps, BasicState, BasicAction} from '../types'
import {normPages, defaultPages} from '../utils'
export const usePages = (
    props:BasicProps<Pages>={},
) : [Pages, BasicAction<Pages>] => {
    if (typeof props==="function")
        props = props()
    const pagesRef = useRef<Pages>({...defaultPages, ...props})
    const [pages, set] = useState<Pages>(normPages(pagesRef.current))
    //  ************************* setPages *************************  //
    const setPages = useCallback((state:BasicState<Pages>) => {
        if (typeof state==="function")
            state = state(pagesRef.current)
        pagesRef.current = {...pagesRef.current, ...state}
        set(normPages(pagesRef.current))
        const {onChange=null} = pagesRef.current
        onChange && onChange(pagesRef.current)
        //console.log("\n\t\t~~setPages~~\n", state, state)
    }, [set])
    //console.log(`\tusePages`)
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
