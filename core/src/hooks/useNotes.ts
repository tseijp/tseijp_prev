import { useEffect, useCallback, useState, useRef } from 'react'
import { NoteURL, NoteNode, NoteFetcher, BasicProps, BasicState} from '../types'
//import useSWR from 'swr'
//import { AxiosResponse } from 'axios'
import {normURL} from '../utils'
export const useNotes = (
    initURL:BasicProps<NoteURL>,
    initFetcher:NoteFetcher<NoteNode>
) : [ NoteNode, (
        url:BasicState<NoteURL>,
        fetcher?:NoteFetcher<NoteNode>|null
    ) => void
] => {
    const urlRef = useRef<string>(normURL(initURL))
    const isFetching = useRef(false)
    const fetcherRef = useRef(initFetcher)
    const [note, set] = useState<NoteNode>(null) //TODO useSWR(urlRef.current,isFetching)
    useEffect(() => {fetcherRef.current(urlRef.current).then((r:any)=>set(r))}, [])
    //  ************************* 📋 SetNotes 📋 *************************  //
    //  * setNotes("/api/note", fetcher) => refresh notes data from url
    //  * setNotes(p=>[p,"32"], fetcher) => add note data from url
    //  ************************* ************** *************************  //
    const setNotes = useCallback((
        updateURL:BasicState<NoteURL>,//UpdateNoteURL,
        updateFetcher:NoteFetcher<NoteNode>|null=null//UpdateNoteFetcher=null
    ) : void => {
        // ********** FOR DoS ********** //
        if (isFetching.current)
            return
        isFetching.current = true
        // ********** FOR REF ********** //
        if (updateFetcher===null)
            updateFetcher = fetcherRef.current
        else
            fetcherRef.current = updateFetcher
        // ********** FOR FETCHING ********** //
        // * ERROR if set("note/") in note/90 //
        updateURL = normURL(updateURL, urlRef)
        updateFetcher(updateURL).then((res:any) => {
            set(/*pre =>  updateURL===urlRef.current
                ? [...(pre||[]).filter(p=>!res.find((r:any)=>r.id===p.id)), ...res]
                : */res
            )
            urlRef.current = updateURL as string
            setTimeout(()=>(isFetching.current=false), 1000)
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
