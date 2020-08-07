import React, {FC, useEffect, useMemo} from 'react'
import {useSpring, animated as a} from 'react-spring'
import {BasedProps} from '../types'

export const Head :FC<BasedProps> = ({children, color="", dark=false,size=50, style={}}) => {
    const [{fontSize}, set] = useSpring<any>(()=>({fontSize:size*50}))
    useEffect(()=>{set({fontSize:size*50})}, [size,set])
    const styles = useMemo<React.CSSProperties[]>(()=>[
        {color:color||dark?"#818181":"#000", ...style},
    ], [color,dark, style])
    return (
        <a.div style={{...styles[0], fontSize} as any}>
            {children}
        </a.div>
    )
}
