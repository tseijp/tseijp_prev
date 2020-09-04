/*** ************************* USE PAGES *************************
  * This is a hook to record the URL of the Restfl API
  *   - `const [pages, set] = usePages({id:null,home:({id})=>!id}, config)`
  *   - `const onClick=()=>set({id:90}, config)`
  *   - ```
  *     {Page, id:null}  <=data=> (DB1 : URL1 by id), (DB2 : URL2 by id)
  *          | change id
  *          |  => change URLs by id (e.g. /api to /api/90)
  *          v  => change user state (e.g. home:true to home:false)
  *     {New Page, id:90}
  *     ```
  * # ***** usePages API Configs *****
  * ## Props Values
  *   - `const _ = usePages(@initPages, @config)`
  *   - @initPages = {
  *         @protocol?:MultiPages<string|null>, e.g. "https:"
  *         @hostname?:MultiPages<string|null>, e.g. "localhost"
  *         @portname?:MultiPages<string|null>, e.g. "3000"   or ["3000"(npm), "8000"(django)]
  *         @pathname?:MultiPages<string|null>, e.g. "/note/" or ["/note/", "/api/note/"]
  *         @search  ?:MultiPages<string|null>, e.g. "/note/" or ["/note/", "/api/note/"]
  *   - @config = {TODO}
  *   - type MultiPages<T=any> = T|T[]|((p:Pages)=>T|T[])
  * ## Return Values
  *   - @pages : {...@initPages(as T|T[]),
  *         @url ?: from initPages parameters   e.g. "http..." or ["http...", ...more]
  *         @XXX ?: any value you set when init e.g. @home:true
  *   - @set   : (args) => void ( setState )
 *** ************************* ********* *************************/

import {useState, useCallback, useRef} from 'react'
import {Pages, PagesConfig as Config, BasicProps, BasicState, BasicAction} from '../types'
import {defaultPages, defaultPagesConfig as defaultConfig, normPages} from '../utils'
export const usePages = <T=any>(
    props :BasicProps<Pages<T>>={},
    config:Config<T>={},
) : [Pages<T>, BasicAction<Pages<T>>] => {
    if (typeof props==="function")
        props = props()
    const pagesRef    = useRef <Pages <T>>({...defaultPages , ...props })
    const configRef   = useRef <Config<T>>({...defaultConfig, ...config})
    const [pages,set] = useState<Pages<T>>( normPages(pagesRef.current) )
    //  ************************* setPages *************************  //
    const setPages = useCallback((state:BasicState<Pages<T>>) => {
        if (typeof state==="function")
            state = state(pagesRef.current)
        pagesRef.current = {...pagesRef.current, ...state}
        set(normPages(pagesRef.current))
        const {onChange=null} = configRef.current;
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
