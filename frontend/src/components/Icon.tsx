import React, {FC, useMemo} from 'react'
import {BasedProps} from '../types'
import { useSpring, animated as a } from 'react-spring'
import { useGesture } from 'react-use-gesture'

export const Icon :FC<BasedProps> = ({
    fa="",size=50,width=500,onOpen=null, //onClose=null,
    children, className='', style={}, color='',
}) => {
    className = className + fa?` fas fa-${fa}`:""
    const [spring, set] = useSpring<any>(() => ({x:0,y:0,scale:1}))
    const bind = useGesture({
        onDrag : ({last,down,movement:[mx,my],cancel}) => {
            const mm = mx**2 + my**2;
            if (mm > width**2 && cancel) cancel()
            return (last && mm<.1 || mm>width**2/4)
              ? (set({x:0,y:0,scale:1}), onOpen &&onOpen())
              : set({x:down?mx:0,y:down?my:0,scale:0.9})
        }
    })
    const styles = useMemo<React.CSSProperties[]>(()=>[
          { borderRadius:size, fontSize:size, width:size, height:size,
            textAlign:"center", background:"#212121", padding:"0px", color, ...style },
    ], [color, style, size] )
    return (
        <a.div {...{className,children,style:{...spring,...styles[0]}}} {...bind()} />
    )
}
