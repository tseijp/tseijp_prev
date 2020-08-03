import React, {FC, Children, useEffect, useMemo} from 'react'
import {useSpring, animated as a} from 'react-spring'
export const Foot :FC<any> = ({children, size=1, style={}}) => {
    const [{fontSize}, set] = useSpring(()=>({fontSize:size*50}))
    useEffect(()=>{set({fontSize:size*50})}, [size,set])
    const styles = useMemo<React.CSSProperties[]>(()=>[
      { background:"#212121",minWidth:"100%", heihgt:"auto",
        position:"absolute", left:0, bottom:0, ...style},
      { position:"relative", fontSize, textAlign:"center"},
  ], [fontSize, style])
    return (
        <a.div style={{...styles[0],
            borderRadius:fontSize.to(v=>`${v/2}px ${v/2}px 0px 0px`),
            padding     :fontSize.to(v=>`0px ${v}px ${v/2}px ${v}px`),}}>
            {Children.map(children, (child)=>
                <div style={styles[1]}>{child}</div>
            )}
        </a.div>
    )
}
