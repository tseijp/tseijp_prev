import { useEffect, useCallback, useState, useRef } from 'react'
import { NoteURL, NoteNode, NoteFetcher, BasicProps, BasicState} from '../types'
//import useSWR from 'swr'
//import { AxiosResponse } from 'axios'
import {joinURL} from '../utils'
export const useNotes = (
    initURL:BasicProps<NoteURL>,
    initFetcher:NoteFetcher<NoteNode>
) : [ NoteNode, (
        url:BasicState<NoteURL>,
        fetcher?:NoteFetcher<NoteNode>|null
    ) => void
] => {
    if (typeof initURL === "function")
        initURL = initURL()
    if (initURL instanceof Array)
        initURL = joinURL(...initURL)
    const urlRef     = useRef<string>(initURL)
    const fetcherRef = useRef(initFetcher)
    const isFetching = useRef(false)
    const [note,set] = useState<NoteNode>(null) // TODO useSWR(urlRef.current,isFetching)
    useEffect(() => {fetcherRef.current(urlRef.current).then((r:any)=>set(r))}, [])
    //  ************************* 📋 SetNotes 📋 *************************  //
    //  * setNotes("/api/note", fetcher) => refresh notes data from url
    //  * setNotes(p=>[p,"32"], fetcher) => add note data from url
    //  ************************* ************** *************************  //
    const setNotes = useCallback((
        updateURL:BasicState<NoteURL>,
        updateFetcher:NoteFetcher<NoteNode>|null=null//UpdateNoteFetcher=null
    ) : void => {
        // ********** FOR REF ********** //
        if (isFetching.current)
            return
        isFetching.current = true
        if (typeof updateURL === "function")
            updateURL = updateURL(urlRef.current)
        if (updateURL instanceof Array)
            updateURL = joinURL(...updateURL)
        if (updateFetcher===null)
            updateFetcher = fetcherRef.current
        else
            fetcherRef.current = updateFetcher
        const preURL = urlRef.current
        urlRef.current = updateURL
        // ********** FOR FETCHING ********** //
        updateFetcher(updateURL).then((res:any) => {
            set(pre =>  {
                return urlRef.current.split('?')[0]===preURL.split('?')[0]
                    ? [...(pre||[]).filter(p=>!res.find((r:any)=>r.id===p.id)), ...res]
                    : res
            })
            setTimeout(() => (isFetching.current = false), 1000)
        })
    }, [])
    return [ note, setNotes]
}

/* PREVIOUS
export const useNotes = ({initNotes=[],isHome=false}) => {
    const [data, set] = useState<Note[]>(initNotes)
    const head = useRef<number>(-1)
    const foot = useRef<number>(-1)
    const setNotes = useCallback((input:Note[],mode='init')=>{
        const diff = input.filter(c=>data.every(p=>p.id!==c.id))
        foot.current = isHome? -1 : (mode==='head'?data:input).slice(-1)[0].id
        set( pre => (mode==='init')? input
             : [ ...(mode==='head' ? diff : []), ...pre,
                 ...(mode==='tail' ? diff : []),       ] )
        // TODO if (mode==='tail') animateScroll.scrollToBottom();
    }, [data])
    const deleteNotes = useCallback((id:number)=>{
        if ( id===head.current ) return
        set(pre=>pre.filter(p=>p.id!==id))
    }, [])
    return [data, setNotes, deleteNotes]
}
*/
