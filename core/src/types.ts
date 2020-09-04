import { ReactChild as RC, CSSProperties } from 'react'
import { AxiosResponse } from 'axios'
export type BasicProps<T>  = (()=>T) | T
export type BasicState<T>  = ((pre:T)=>T) | T
export type BasicAction<T> = (fn:BasicState<T>) => void
// ************************* 🌌 For Containers 🌌 ************************* //
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
export interface NotesProps extends BasedProps{grandren?:any,right?:RC,left?:RC,depth?:number}

// ************************* 👌 For useNotes 👌 ************************* //
export type NoteElement = {
    ja_text ?:string, posted_user?:string, note_id?:number, isAuthor ?: boolean,
    en_text ?:string, posted_time?:number,      id?:number, isAdmin  ?: boolean,
    children?:NoteNode, [key:string]:any
}
export type NoteNode =
  | NoteElement[]
  | null
  | undefined
export type NoteURL = string | string[]
export type NoteFetcher<T=NoteNode> = {
    (
        url:string, headers?:any
    ) : Promise<AxiosResponse<T>>
}
// ************************* 👌 For usePages 👌 ************************* //
export interface URL {
    hash: string; hostname: string; search: string;
    host: string; username: string; protocol: string;
    href: string; password: string; toString(): string;
    port: string; pathname: string; readonly origin: string;
}
export type RefedPages<T=any> = T    |((p:Pages)=>T)
export type MultiPages<T=any> = T|T[]|((p:Pages)=>T|T[])
export interface PagesConfig<T=any> {
    [key:string]:any,
    onChange?:null|((p:Pages<T>)=>void),
}
export interface Pages<T=any> extends PagesConfig{ // (TODO : how T spread in Pages)
    [key:string]:any,
//  config  ?:PagesConfig<T>|null,
//  ...T (TODO : how T spread in Pages)
    protocol?:MultiPages<string|null>,// e.g. "https:"
    hostname?:MultiPages<string|null>,// e.g. "localhost"
    portname?:MultiPages<string|null>,// e.g. "3000"   or ["3000"(npm), "8000"(django)]
    pathname?:MultiPages<string|null>,// e.g. "/note/" or ["/note/", "/api/note/"]
    search  ?:MultiPages<string|null>,// e.g. "/note/" or ["/note/", "/api/note/"]
    url     ?:URL|URL[]        ,// e.g. null or ["http://localhost:3000/"]
//    id      ?:string|number|null
}
// ************************* 👌 For useUser 👌 ************************* //
export type UserCredit<T=string> = {username:T,password:T,email?:string}
export type User<T=object|string> = {
    username :T, status:string,
    authtoken:T, credit:UserCredit,
    input ?: {[key:string]:{
        value:string, name:string, type:string, label:string,
        error?:"wrong", success?:"right", autoComplete?:"on",
        group:boolean, validate:boolean,
        onChange:(e:any)=>void,
    }}
}
export interface UserProps {
    [key:string]:any,
    onSign   ?:null|(()=>void),
    onSignin ?:null|(()=>void),
    onSignout?:null|(()=>void),
}
export interface UserConfig<T=User> {
    [key:string]:any  ,
    url     ?:string  ,
    keys    ?:string[],
    initUser?:T
}
export interface UserHandler {
    (
        url:string, credit:UserCredit, headers?:any
    ) : void|Promise<void|{username:string, authtoken:string}>
}
