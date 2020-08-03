import React, {FC, useEffect, useMemo} from 'react'
import {BasedProps} from '../types'
import {useSpring, animated as a} from 'react-spring'
export const Card :FC<BasedProps> = ({
        size=1, children, color="", style={}
    }) => {
    const [{fontSize, width, minHeight}, set] = useSpring(()=>({
        fontSize:size*50,width:size*500,minHeight:size*500}))
    useEffect(()=>{set({fontSize:size*50,width:size*500,minHeight:size*500})}, [size,set])
    const styles = useMemo<React.CSSProperties[]>(()=>[
        {   boxShadow:"0px 1px 50px rgba(0,0,0,0.2)",//"0 2.5rem 2rem -2rem hsl(200 50% 20% / 40%)"}
            margin:"auto auto",
            color, ...style},
    ],[color, style])
    return (
        <a.div style={{...styles[0], width, borderRadius:fontSize.to(v=>v/2), minHeight}}>
            {children}
        </a.div>
    )
}
