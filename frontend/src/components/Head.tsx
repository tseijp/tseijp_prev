import React, {FC, useMemo} from 'react'
import {BasedProps} from '../types'

export const Head :FC<BasedProps> = ({
    children, color="", dark=false,size=50, style={}, ...props
}) => {
    style = useMemo<React.CSSProperties>(()=>(
        {color:color||dark?"#818181":"#000",fontSize:size*50,...style}
    ), [color,dark,size,style])
    return <div {...{children,style,...props}}/>
}
