import React, {FC, useEffect, useMemo} from 'react'
import {BasedProps} from '../types'
import { useSpring, animated as a } from 'react-spring'
import { useGesture } from 'react-use-gesture'

export const Icon :FC<BasedProps> = ({
    fa="",dark=false,size=1,onOpen=null, //onClose=null,
    children, className='', style={}, color='', ...props
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
          { textAlign:"center", background:"#212121", padding:"0px", top:0,right:0,
            color:color||dark?"#818181":"#fff", ...style },
    ], [color, dark,style] )
    return (
        <a.div {...bind()} {...props} {...{className,children}}
            style={{ ...spring, fontSize, borderRadius:fontSize,
                     ...styles[0], width:fontSize, height:fontSize}}  />
    )
}
