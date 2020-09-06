import { useEffect, useCallback, useState, useRef } from 'react'
import { NoteNode, NoteFetcher, NoteURL, URLType, BasicProps } from '../types'
import { equalPathname, joinURL } from '../utils'
//import useSWR from 'swr'
//import { AxiosResponse } from 'axios'
export const useNote = (
    initURL:BasicProps<NoteURL>,
    initFetcher:NoteFetcher<NoteNode>,
) : [ NoteNode, (
        url:((pre:NoteNode)=>NoteURL)|NoteURL,
        fetcher?:NoteFetcher<NoteNode>|null
    ) => void
] => {
    if (typeof initURL === "function")
        initURL = initURL()
    if (initURL instanceof Array)
        initURL = joinURL(...initURL)
    if (typeof initURL === "string")
        initURL = new URL(initURL)
    const urlRef     = useRef<URLType>(initURL)
    const fetcherRef = useRef(initFetcher)
    const isFetching = useRef(false)
    const [note,set] = useState<NoteNode>(null) // TODO useSWR(urlRef.current,isFetching)
    useEffect(() => {console.log('\t\tinit useEffect in useNote')}, [])
    useEffect(() => {
        //isFetching.current = true
        fetcherRef.current(urlRef.current).then((res:any) => {
            set(pre => pre || res)
            //setTimeout(() => (isFetching.current = false), 1000)
        })
    }, [])
    //  ************************* 📋 SetNote 📋 *************************  //
    //  * setNote("/api/note", fetcher) => refresh note data from url
    //  * setNote(p=>p.next  , fetcher) => add note data from url
    //  ************************* ************** *************************  //
    const setNote = useCallback((
        updateURL:((pre:NoteNode)=>NoteURL)|NoteURL,
        updateFetcher:NoteFetcher<NoteNode>|null=null//UpdateNoteFetcher=null
    ) : void => {
        // ********** FOR REF ********** //
        if (isFetching.current)
            return
        isFetching.current = true
        if (updateFetcher === null)
            updateFetcher = fetcherRef.current
        else
            fetcherRef.current = updateFetcher
        if (typeof updateURL === "function")
            updateURL = updateURL(note)
        if (updateURL instanceof Array)
            updateURL = joinURL(...updateURL)
        if (typeof updateURL === "string")
            updateURL = new URL(updateURL)
        if (!updateURL || !updateFetcher)
            return void (isFetching.current = false)
        const preURL = urlRef.current
        urlRef.current = updateURL
        // ********** FOR FETCHING ********** //
        updateFetcher(updateURL).then((res:any) => {
            console.log(`\t\t now fetting !!!`, res.results)
            setTimeout(() => (isFetching.current = false), 1000)
            if (!res || !res.results)
                return
            set(pre => {
                // pre && console.log(pre.next, res.next)
                if (!equalPathname(preURL, urlRef.current))
                    return res
                const diff = pre
                  ? (pre.results||[]).filter((p:any) =>
                  ! (res.results||[]).find((r:any) => r.id===p.id)
                ) : []
                return {...res, results:[...diff, ...res.results]}
            })
        })
    }, [note])
    console.log(`\tuseNote run`)
    return [note, setNote]
}

/* PREVIOUS
export const useNote = ({initNote=[],isHome=false}) => {
    const [data, set] = useState<Note[]>(initNote)
    const head = useRef<number>(-1)
    const foot = useRef<number>(-1)
    const setNote = useCallback((input:Note[],mode='init')=>{
        const diff = input.filter(c=>data.every(p=>p.id!==c.id))
        foot.current = isHome? -1 : (mode==='head'?data:input).slice(-1)[0].id
        set( pre => (mode==='init')? input
             : [ ...(mode==='head' ? diff : []), ...pre,
                 ...(mode==='tail' ? diff : []),       ] )
        // TODO if (mode==='tail') animateScroll.scrollToBottom();
    }, [data])
    const deleteNote = useCallback((id:number)=>{
        if ( id===head.current ) return
        set(pre=>pre.filter(p=>p.id!==id))
    }, [])
    return [data, setNote, deleteNote]
}
*/
