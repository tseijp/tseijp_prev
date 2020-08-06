import { useCallback, useState,  } from 'react'
import { NoteNode as NN, UseNotes } from '../types'

export const useNotes:UseNotes = (initNotes=[]) => { //TODO URL=''
    const [notes, set] = useState<NN>(initNotes)
    const setNotes = useCallback((i=-1, arr=[{ja_text:"HI"}])=>{
        const diff = arr || []
    //  TODO if (mode==='tail') animateScroll.scrollToBottom();
        if (i<0 || !notes)
            return set(pre=>[...(pre?pre:[]),...(diff?diff:[])])
        notes[i].children = [...(notes[i].children||[]), ...(arr?arr:[])]
    }, [notes])
//  const delNotes = useCallback((i:number)=>set(pre=>pre.filter(p=>p.id!==i)), [])
//  console.log(`Render useNotes notes:`,notes);
    return [notes, setNotes, ]
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


/* PREVIOUS
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
