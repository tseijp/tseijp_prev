/** ************************* USE PAGE *************************
 * This is a hook to record the URL of the Restfl API
 *   - `const [page, set] = usePage({id:null,home:({id})=>!id}, config)`
 *   - `const onClick=()=>set({id:90}, config)`
 *   - ```
 *     {Page, id:null}  <=data=> (DB1 : URL1 by id), (DB2 : URL2 by id)
 *          | change id
 *          |  => change URLs by id (e.g. /api to /api/90)
 *          v  => change user state (e.g. home:true to home:false)
 *     {New Page, id:90}
 *     ```
 * # ***** usePage API Configs *****
 * ## Props Values
 *   - `const _ = usePage(@initPage, @config)`
 *   - @initPage = {
 *         @isHome  :boolean
 *         @isLocal :boolean
 *         @id      :string e.g. 2
 *         @protocol:string e.g. "https:"
 *         @hostname:string e.g. "localhost"
 *         @portname:string e.g. "3000"   or ["3000"(npm), "8000"(django)]
 *         @pathname:string e.g. "/note/" or ["/note/", "/api/note/"]
 *         @search  :string e.g. "/note/" or ["/note/", "/api/note/"]
 *   - @config = {TODO}
 *   - type MultiPage<T=any> = T|T[]|((p:Page)=>T|T[])
 * ## Return Values
 *   - @page : {...@initPage(as T|T[]),
 *         @url ?: from initPage parameters    e.g. "http..." or ["http...", ...more]
 *         @XXX ?: any value you set when init e.g. @home:true
 *   - @set   : (args) => void ( setState )
 ** ************************* ********* *************************/

import {useEffect, useState, useCallback, useRef} from 'react'
import {Page , PageConfig as Conf, BasicProps, BasicState, BasicAction} from '../types'
import {defaultPageConfig as defaultConf, defaultPage, normPage} from '../utils'
export const usePage = <T extends {}={}>(
    props :BasicProps<Partial<Page<T>>>,//BasicProps<Page<T>>,
    config:BasicProps<Partial<Conf<T>>>={},
) : [Page<T>, BasicAction<Partial<Page<T>>>] => {
    if (typeof props==="function")
        props = props()
    if (typeof config==="function")
        config = config()
    const pageRef = useRef<Page<T>>({...defaultPage, ...props } as Page<T>)
    const confRef = useRef<Conf<T>>({...defaultConf, ...config} as Conf<T>)
    const [page,set] = useState<Page<T>>( normPage(pageRef.current) )
    //  ************************* setPage *************************  //
    const setPage = useCallback((state:BasicState<Partial<Page<T>>>) => {
        if (typeof state==="function")
            state = state(pageRef.current as Partial<Page<T>>)
        pageRef.current = {...pageRef.current, ...state}
        set( normPage(pageRef.current) )
    }, [set])
    //  ************************* useEffect *************************  //
    useEffect(() => {
        const {onChange=null} = confRef.current
        onChange && onChange(pageRef.current)
        if (page && page.pathname)
            window.history.pushState('','',
                page.pathname instanceof Array
                  ? page.pathname[0]||''
                  : page.pathname   ||'')
    }, [page])
    return [page, setPage]
}

/* Prev
export type PageType = {
    [key:string]:any,
    url  : string,
    bind?: (q?:string)=>(null | {
        onClick?:void
    })
}[]
export type UsePageProps  = BasicProps<PageType>
export type UsePageState  = BasicState<PageType>
export type UsePageAction = BasicAction<PageType>
export function cP2P (props:PageType) : PageType {
    const position = window.location.pathname.split('/').filter(v=>v)
    return props.map((prop:any)=>({
        active : prop.url===position[0],
        bind : (query:string="")=>!prop?.url ? null : {
            onClick : ()=>window.open(prop.url+query,"blank")
        },
        ...prop
    }))
}
export const usePage = (
    props:UsePageProps,
) : [PageType, UsePageAction]=> {
    if (typeof props==="function")
        props = props()
    const [page, set] = useState( cP2P(props) )
    const propsRef = useRef(props)
    const setPage = useCallback((state)=>{
        if (typeof state==="function")
            state = state(propsRef.current)
        propsRef.current = state
        set( cP2P(state) )
	}, [])
    return [page, setPage]
}
export const App = () => {
    const [page, set] = usePage([
        { url:"note", icon:{fa:"note"} },
        { url:"hook", icon:{fa:"hook"} },
    ])
    // page : [["note",{}],[]...]
    return (
        {page.map(({url,icon,bind})=>
            <Icon url={url} {...icon} {...bind()}/>
        )}
    )
}
 */
