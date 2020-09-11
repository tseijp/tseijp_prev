import { ReactChild as RC, CSSProperties } from 'react'
import { AxiosResponse } from 'axios'

export type BasicProps<T>  = (()=>T) | T
export type BasicState<T>  = ((pre:T)=>T) | T
export type BasicAction<T> = (fn:BasicState<T>) => void
export type Merge<A,B> = {[K in keyof A]:K extends keyof B ? B[K] : A[K] } & B
// ************************* 🌌 For Containers 🌌 ************************* //
export type BasedProps<T extends {}={}> = Partial<T & {
    [key:string]:any, style?:CSSProperties
    dark:boolean, onOpen :null|(()=>void), className:string,
    size:number , onClose:null|(()=>void), color:string,
}>
export type BindsProps = BasedProps<{bind?:any,spring?:any}>
export type ModalProps = BasedProps<{open:boolean}>
export type NotesProps = BasedProps<{grandren?:any,right?:RC,left?:RC,depth?:number}>

// ************************* 📅 For useNote 📅 ************************* //
export type URLType = {
    hash: string; hostname: string; search    : string;
    host: string; username: string; protocol  : string;
    href: string; password: string; toString(): string;
    port: string; pathname: string; readonly origin: string;
}
export type NoteElement = {
    ja_text :string, author_name:string, note_id:number,
    en_text :string, posted_time:number,      id:number,
    is_author: boolean, [key:string]:any,
}
export type NoteNode = null | {
    [key:string]:any,
    next    :string|null,
    previous:string|null,
    //children: TODO DEV
    results :
      | Partial<NoteElement>[]
      | null
      | undefined
}
//export type NoteURL = URLType | string | string[]
export type NoteFetcher<T=NoteNode> = (url:URLType, headers?:any) => Promise<AxiosResponse<T>>
export type NoteConfig = {onChange:() => void}

// ************************* 👌 For usePage 👌 ************************* //
export type PageConfig<T={}> = Partial<{
    [key:string]:any,
    onChange:null|((p:Page<T>)=>void),
}>
export type DefaultPage<T={}> = { // (TODO extends PageConfig
    [key:string]:any, //config:PageConfig<T>|null, //TODO : DEV
    id:string|number,search :string,urls    :URLType[]
    isHome :boolean,protocol:string,hostname:string,
    isLocal:boolean,portname:string,pathname:string,
}
export type MultiPage<T> = {
    [K in keyof T] : null|T[K]
  | ( (p:Page<T>) => null|T[K] )
}
export type Page<T extends {}={}> = Merge<DefaultPage<T>,MultiPage<T>>

// ************************* 🙍‍♂️ For useUser 🙍 ************************* //
export type Credit<T extends object|string=string> = {username:T,password:T,email?:T}
export type User<T extends object|string=string> = {
    username :T, isAuth: boolean,
    authtoken:T, input : { onChange : (e:any)=>void, autoComplete?:"on",
        group   :boolean, value:string, name:string, success ?:"right",
        validate:boolean, label:string, type:string, error?:"wrong",}[]
}
export type UserConfig<T extends object|string=string,U=User<T>> = {
    onSign   :null|((u?:U)=>void), user:null|T,
    onSignin :null|((u?:U)=>void), keys:string[],
    onSignout:null|((u?:U)=>void), [key:string]:any,
}
export type UserSignin = (
    url:URLType, credit:Credit, headers?:any
) => Promise<{username:string, authtoken:string}>
