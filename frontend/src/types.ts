import { ReactChild as RN, CSSProperties } from 'react'
import { AxiosResponse } from 'axios'
export type BasicProps<T>  = (()=>T) | T
export type BasicState<T>  = ((pre:T)=>T) | T
export type BasicAction<T> = (fn:BasicState<T>) => void
/// ************************* 🌌For Containers🌌 ************************* ///
export interface BasedProps {
    [key:string]:any,
    dark?:boolean,
    size?:number, //TODO to scale //width?:number, fontSize?:number,
    onOpen ?:null|(()=>void),
    onClose?:null|(()=>void),
    className?:string,color?:string,style?:CSSProperties
}
export interface BindsProps extends BasedProps{bind?:any,spring?:any,}
export interface ModalProps extends BasedProps{open?:boolean}
export interface NotesProps extends BasedProps{grandren?:any,right?:RN,left?:RN,depth?:number}

/// ************************* 👌For useNotes ************************* ///
export type NoteElement = {
    ja_text?:string, posted_user?:string, note_id?:number, isAuthor ?: boolean,
    en_text?:string, posted_time?:number,      id?:number, isAdmin  ?: boolean,
    children ?: NoteNode, [key:string]:any
}
export type NoteNode =
  | NoteElement[]
  | []
  | null
  | undefined
export interface UseNoteFetcher<T=NoteNode> {
    (
        url:string, headers?:any
    ) : Promise<AxiosResponse<T>>
}
export type SetNotes<T=NoteNode> = ( i:number, arr?:T ) => void // TODO 08072020
/// ************************* 👌For usePages ************************* ///
export interface PagesProps {
    url:string,
    [key:string]:any
}
export interface PagesType extends PagesProps {
    bind : null | {
        onClick:void
    }
}
export type UsePagesProps  = BasicProps<PagesType>
export type UsePagesState  = BasicState<PagesType>
export type UsePagesAction = BasicAction<PagesType>
/// ************************* 👌For useUser👌 ************************* ///
export type UserCred<T=string> = {username:T,password:T,email?:string}
export type User<T=object|string> = {
    username :T, status:string,
    authtoken:T, cred  :UserCred,
    input ?: {[key:string]:{
        value:string, name:string, type:string, label:string,
        error?:"wrong", success?:"right", autoComplete?:"on",
        group:boolean, validate:boolean,
        onChange:(e:any)=>void,
    }}
}
export interface UseUserHandler {
    [key:string]:any,
    onSign   ?:null|(()=>void),
    onSignin ?:null|(()=>void),
    onSignout?:null|(()=>void),
}
export interface UseUserConfig<T=User> {
    [key:string]:any  ,
    url     ?:string  ,
    keys    ?:string[],
    initUser?:T
}
export interface SetUserHandler {
    (
        url:string, cred:UserCred, headers?:any
    ) : void|Promise<void|{username:string, authtoken:string}>
}
