import React, {CSSProperties as CSS, FC, useMemo} from 'react'
import {BasedProps} from '../types'

export type Head = FC<BasedProps>
export const Head:Head = ({
    children, color="", dark=false,size=50, style={}, ...props
}) => {
    style = useMemo<CSS>(()=>({
        fontSize:size*50,
        color:color||dark?"#818181":"#000",
        width:`max(70vw, 100vw - ${size*200}px)`,
        height:"auto",
        margin:"auto",
        ...style
    }), [color,dark,size,style])
    return <div {...{children,style,...props}}/>
}
