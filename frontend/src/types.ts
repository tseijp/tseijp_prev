import {CSSProperties} from 'react'
export interface BasedProps {
    width?:number,size?:number,
    className?:string,color?:string,style?:CSSProperties
}
export interface BindsProps extends BasedProps{bind?:any,spring?:any,}
export interface SidesProps extends BasedProps{onOpen?:()=>void,}
export interface TransProps extends BasedProps{onOpen?:()=>void,}
export interface NotesProps extends BasedProps{}
export interface ModalProps extends BasedProps{open:boolean, set:(b:boolean)=>void}
