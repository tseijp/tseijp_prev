import { useCallback, useState, useRef } from 'react'

/*
const Note = () => {

    useEffect(()=>{

    }, [])
}
*/

interface Note {
    posted_user:string,
    posted_time:number,
    ja_text  :string,
    en_text  :string,
    note_id  :number,
    id  :number,
    isAuthor?: boolean,
    isAdmin ?: boolean,
    children?: Note[]
}

export const useNotes = ({ initNotes=[] }) => {
    const [notes, set] = useState<Note[]>(initNotes)
    const head = useRef<number>(-1)
    const foot = useRef<number>(-1)
    const setNotes = useCallback((input:null|Note|Note[], id=null)=>{
        const arr = input ? input instanceof Array ? input : [input] : []
        const diff = arr.filter(c=>notes.every(p=>p.id!==c.id))
        foot.current = (id===0?notes:arr).slice(-1)[0].id
    //  TODO if (mode==='tail') animateScroll.scrollToBottom();
        return (id && id>0)
          ? ( notes[id].children = [...(notes[id].children||[]), ...arr] )
          : set( pre=>(id===null) ? arr
                 :[...(id===-1 ? diff : []), ...pre,
                   ...(id=== 0 ? diff : []),] )
    }, [notes])
    const deleteNotes = useCallback((id:number)=>{
        if ( id===head.current ) return
        set(pre=>pre.filter(p=>p.id!==id))
    }, [])
    return [notes, setNotes, deleteNotes]
}

/*Examples
set(i) : add new child note to this
del(i) : del this note and children note

const App = () => {
    const [notes, set, del] = useNotes(notes)
    return (
        <Notes {...{size,width}}
            left={(i)=><i onClick={()=>set(i)}/>}
            right={(i)=><i onClick={()=>del(i)}/>} >
            {notes.map((note,i)=>
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
/*
export const useNotes = ({initNotes=[],isHome=false}) => {
    const [notes, set] = useState<Note[]>(initNotes)
    const head = useRef<number>(-1)
    const foot = useRef<number>(-1)
    const setNotes = useCallback((input:Note[],mode='init')=>{
        const diff = input.filter(c=>notes.every(p=>p.id!==c.id))
        foot.current = isHome? -1 : (mode==='head'?notes:input).slice(-1)[0].id
        set( pre => (mode==='init')? input
             : [ ...(mode==='head' ? diff : []), ...pre,
                 ...(mode==='tail' ? diff : []),       ] )
        // TODO if (mode==='tail') animateScroll.scrollToBottom();
    }, [notes])
    const deleteNotes = useCallback((id:number)=>{
        if ( id===head.current ) return
        set(pre=>pre.filter(p=>p.id!==id))
    }, [])
    return [notes, setNotes, deleteNotes]
}
*/
