import React, {FC, useMemo} from 'react'
import {BasedProps} from '../types'
export const Card :FC<BasedProps> = ({children, width=500, size=50, style={}}) => {
    const styles = useMemo<React.CSSProperties[]>(()=>[
        {   boxShadow:"0px 1px 50px rgba(0,0,0,0.2)",//"0 2.5rem 2rem -2rem hsl(200 50% 20% / 40%)"}
            borderRadius:`${size/2}px`,
            width, minHeight:width, margin:"auto auto", ...style},
    ],[size, width, style])
    return (
        <div style={styles[0]}>
            {children}
        </div>
    )
}
