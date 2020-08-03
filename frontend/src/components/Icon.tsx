import React, {FC, useEffect, useMemo} from 'react'
import {BasedProps} from '../types'
import { useSpring, animated as a } from 'react-spring'
import { useGesture } from 'react-use-gesture'

export const Icon :FC<BasedProps> = ({
    fa="",size=1,onOpen=null, //onClose=null,
    children, className='', style={}, color='',
}) => {
    className = className + fa?` fas fa-${fa}`:""
    const [{fontSize},_set] = useSpring(()=>({fontSize:size*50}))
    useEffect(()=>{_set({fontSize:size*50})}, [size,_set])
    const [spring, set] = useSpring(() => ({x:0,y:0,scale:1}))
    const _width = 500 * size
    const bind = useGesture({
        onDrag : ({last,down,movement:[mx,my],cancel}) => {
            const mm = mx**2 + my**2;
            if (mm > _width**2 && cancel) cancel()
            return last && (mm<.1 || mm>_width**2/4)
              ? (set({x:0,y:0,scale:1}), onOpen &&onOpen())
              : set({x:down?mx:0,y:down?my:0,scale:0.9})
        }
    })
    const styles = useMemo<React.CSSProperties[]>(()=>[
          { textAlign:"center", background:"#212121", padding:"0px", color, ...style },
    ], [color, style] )
    return (
        <a.div {...{className,children,style:{fontSize,borderRadius:fontSize,width:fontSize,height:fontSize,...spring, ...styles[0]}}} {...bind()} />
    )
}
