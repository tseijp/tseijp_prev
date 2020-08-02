import React, {FC, useMemo} from 'react'
import {BasedProps} from '../types'
export const Card :FC<BasedProps> = ({
        width=500, size=50, children, color="", style={}
    }) => {
    const styles = useMemo<React.CSSProperties[]>(()=>[
        {   boxShadow:"0px 1px 50px rgba(0,0,0,0.2)",//"0 2.5rem 2rem -2rem hsl(200 50% 20% / 40%)"}
            borderRadius:`${size/2}px`,
            width, minHeight:width, margin:"auto auto",
            color, ...style},
    ],[size, width, color, style])
    return (
        <div style={styles[0]}>
            {children}
        </div>
    )
}
