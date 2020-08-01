import {CSSProperties} from 'react'
export interface BasedProps {
    onOpen ?:null|(()=>void),  size?:number,
    onClose?:null|(()=>void), width?:number,
    className?:string,color?:string,style?:CSSProperties
}
export interface BindsProps extends BasedProps{bind?:any,spring?:any,}
export interface ModalProps extends BasedProps{open?:boolean}
