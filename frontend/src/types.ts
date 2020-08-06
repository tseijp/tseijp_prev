import {ReactChild as RN, CSSProperties} from 'react'
/// ************************* 🌌For Containers🌌 ************************* ///
export interface BasedProps {
    [key:string]:any,
    size?:number, //TODO to scale //width?:number, fontSize?:number,
    onOpen ?:null|(()=>void),
    onClose?:null|(()=>void),
    className?:string,color?:string,style?:CSSProperties
}
export interface BindsProps extends BasedProps{bind?:any,spring?:any,}
export interface ModalProps extends BasedProps{open?:boolean}
export interface NotesProps extends BasedProps{grandren?:any,right?:RN,left?:RN,depth?:number}
/// ************************* 👌For Hooks👌 ************************* ///
export type NoteElement = {
    ja_text?:string, posted_user?:string, note_id?:number, isAuthor ?: boolean,
    en_text?:string, posted_time?:number,      id?:number, isAdmin  ?: boolean,
    children ?: NoteNode
}
export type NoteNode =
  | NoteElement[]
  | []
  | null
  | undefined
export type User<T=object|string> =
  | { username:T, authtoken:T }
  | null
export type UseUser<T=User> = (
    getUser:()=>T|void, dependencies?:any[]
) => [ T, ()=>void ]
//export type SetNotes<T=NoteNode> = (i?:number,arr?:T)=>any
export type UseNotes<T=NoteNode> = (
    initNotes:T
) => [ T, (i?:number,arr?:T)=>any]
