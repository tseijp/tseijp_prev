import {CSSProperties} from 'react'

export interface BasedProps {
    [key:string]:any,
    size?:number, //width?:number, fontSize?:number,
    onOpen ?:null|(()=>void),
    onClose?:null|(()=>void),
    className?:string,color?:string,style?:CSSProperties
}
export interface BindsProps extends BasedProps{bind?:any,spring?:any,}
export interface ModalProps extends BasedProps{open?:boolean}


// for hooks
export type User<T=object|string> = { username:T, authtoken:T } | null
export type UseUser<T=User> = (
    getUser:()=>T|void, dependencies?:any[]
) => [ T, ()=>void ]
