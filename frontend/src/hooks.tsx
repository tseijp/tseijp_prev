import { useEffect, useCallback, useMemo, useState, useRef } from 'react'
//import {animateScroll} from 'react-scroll';

/*
const Note = () => {

    useEffect(()=>{

    }, [])
}
*/

interface Note {
    post_user:string,
    post_time:number,
    ja_text  :string,
    en_text  :string,
    note_id  :number,
    id  :number,
}

export const useNotes = ({isHome=false}) => {
    const [notes, set] = useState<Note[]>([])
    const head = useRef<number>(-1)
    const foot = useRef<number>(-1)
    const user = useRef<number>(-1)

    const getNotes = useCallback((id=-1)=>{
        return
    }, [])

    const postNotes = useCallback((id=-1, body:any)=>{
        return
    }, [])

    const setNotes = useCallback((input:Note[],mode='init')=>{
        const diff = input.filter(c=>notes.every(p=>p.id!==c.id))
        foot.current = isHome? -1 : (mode==='head'?notes:input).slice(-1)[0].id
        set( pre => (mode==='init')? input
             : [ ...(mode==='head' ? diff : []), ...pre,
                 ...(mode==='tail' ? diff : []),       ] )
        //if (mode==='tail')
        //    return animateScroll.scrollToBottom();
    }, [notes])

    const deleteNotes = useCallback((id:number)=>{
        if ( id===head.current )
            return getNotes()
        set(pre=>pre.filter(p=>p.id!==id))
    }, [])

    useEffect( () => getNotes(), [])

    const bind = useMemo(()=>({/*getNotes, postNotes, */setNotes, deleteNotes}),[])
    return bind
}
