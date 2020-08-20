import { useEffect, useCallback, useState, useRef } from 'react'
import { NoteURL, NoteNode, NoteFetcher, BasicProps, BasicState} from '../types'
//import useSWR from 'swr'
//import { AxiosResponse } from 'axios'
import {normalizeURL} from '../utils'
export const useNotes = (
    initURL:BasicProps<NoteURL>,//InitNoteURL,
    initFetcher:NoteFetcher<NoteNode>//InitNoteFetcher
) : [NoteNode, (
        url:BasicState<NoteURL>,
        fetcher?:NoteFetcher<NoteNode>|null
    )=>void] => {
    if (typeof initURL==="function")
        initURL = initURL()
    if (initURL instanceof Array)
        initURL = normalizeURL(...initURL)
    const [note, set] = useState<NoteNode>(null)
    const urlRef = useRef<string>(initURL)
    const fetcherRef = useRef(initFetcher)
    useEffect(()=>{
        initFetcher(initURL as string).then((res:any)=>set(res))
    }, [initFetcher,initURL] )
    // ************************* 📋 SetNotes 📋 ************************* //
    // * setNotes("/note", fetcher)     => refresh notes data of url
    // * setNotes(p=>[p,"32"], fetcher) => add note data of url
    // ************************* ************** ************************* //
    const setNotes = useCallback( (
        updateURL:BasicState<NoteURL>,//UpdateNoteURL,
        updateFetcher:NoteFetcher<NoteNode>|null=null//UpdateNoteFetcher=null
    ) : void => {
        if (typeof updateURL==="function")
            updateURL = updateURL(urlRef.current)
        if (updateURL instanceof Array)
            updateURL = normalizeURL(...updateURL)
        if (updateFetcher===null)
            updateFetcher = fetcherRef.current
        else
            fetcherRef.current = updateFetcher
        updateFetcher(updateURL as string).then((res:any) => {
            if (updateURL===urlRef.current)
                return set(p=>[...(p||[]), ...(res||[])])
            set(res||[])
            urlRef.current = updateURL as string
        })
    }, [])
    return [ note, setNotes]
}

/*Examples
set(i) : add new child note to this
del(i) : del this note and children note

const App = () => {
    const [data, set, del] = useNotes(data)
    return (
        <Notes {...{size,width}}
            left={(i)=><i onClick={()=>set(i)}/>}
            right={(i)=><i onClick={()=>del(i)}/>} >
            {data.map((note,i)=>
                <div>
                    <div>{note}</div>
                    {note.isAuthor && <input value={note} />}
                    note.children.map((child,i)=>{
                        <div key={i}>child</div>
                    })
                </div>)}
        </Notes>
 )
}
*/


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
