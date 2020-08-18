import { useEffect, useCallback, useState } from 'react'
import { NoteNode, UseNoteFetcher } from '../types'
//import useSWR from 'swr'
//import { AxiosResponse } from 'axios'
export const useNotes = (
    url:string, initialFetcher:UseNoteFetcher
) => {
    const [data, setData] = useState<NoteNode>(null)
    useEffect(()=>{
        initialFetcher && initialFetcher(url).then((res:any)=>setData(res))
    }, [url, initialFetcher])

    const setNotes = useCallback( (i=-1, updateFetcher:UseNoteFetcher) => {
    //  TODO if (mode==='tail') animateScroll.scrollToBottom();
        //if (i<0 || !data)
        //    return set(pre=>[...(pre?pre:[]),...diff])
        //data[i].children = [...(data[i].children||[]), ...(arr?arr:[])]
    }, [])
//  console.log(`Render useNotes data:`,data);
    console.log(data);
    return [ data||null, setNotes]
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
