import React, {FC, useMemo} from 'react'
import {BasedProps} from '../types'

export const Head :FC<BasedProps> = ({
    children, color="", dark=false,size=50, style={}, ...props
}) => {
    style = useMemo<React.CSSProperties>(()=>(
        {//position:"relative",
        color:color||dark?"#818181":"#000",
        fontSize:size*50,
        width:`max(70vw, 100vw - ${size*200}px)`,height:"auto",
        margin:"auto",
        ///*dev*/background:"rgba(0,0,255,0.5)", 
        ...style}
    ), [color,dark,size,style])
    return <div {...{children,style,...props}}/>
}
