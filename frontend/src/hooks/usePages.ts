import {useState, useCallback, useRef} from 'react'
import {PagesProps, UsePagesProps, UsePagesAction} from '../types'

export function cP2P (props:PagesProps) : PagesProps {
    return props.map((prop:any)=>({ ...prop,
        bind : (query="")=>!prop?.url ? null : ({
            onClick : ()=>window.open(prop.url+query,"blank")
        })
    }))
}
export const usePages = (
    props:UsePagesProps
) : [PagesProps, UsePagesAction]=> {
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
