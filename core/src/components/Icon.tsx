import React, {FC, useMemo} from 'react'
import {BasedProps} from '../types'
import { useSpring, animated as a } from 'react-spring'
import { useGesture } from 'react-use-gesture'

export const Icon :FC<BasedProps> = ({
    fa="",dark=false,circ=true,size=1,onOpen=null, //onClose=null,
    children,className='',style={},...props//,color=''
}) => {
    const fontSize = useMemo(()=>size*50, [size])
    const [{xys}, set] = useSpring(() => ({xys:[0,0,0]}))
    const bind = useGesture({
        onMove : ({vxvy:[vx,vy],last}) => set({xys:[vx,vy,last?0:1]})
    })
    //  ************************* RENDER *************************  //
    const color = useMemo(()=>props.color||circ
      ? dark?"#818181":"#fff"
      : "#212121",[props.color,circ,dark])
    const styles = useMemo<React.CSSProperties[]>(() => [
          { padding:"0px",top:0,right:0,textAlign:"center",userSelect:"none",
            ...(circ?{borderRadius:fontSize,background:"#212121"}:{}),
            ...style,color,height:fontSize,width:fontSize,fontSize},
    ], [fontSize,circ,color,style] )
    return <a.div style={{
                x : xys.interpolate((x,y,s) => x*fontSize+y*s),
                y : xys.interpolate((x,y,s) => y*fontSize+x*s),
                filter : xys.interpolate((x,y,s) => [
                    `drop-shadow(${0.1+x}rem`, // -x~0.5~x
                                `${0.5+y}rem`, // -y~1.5~y
                                `${1-s/2}rem`, // 1 =hover=> 0.5
                    `rgba(0,0,0, ${0.5+s/20}))`// 0.50 =hover=> 0.55
                ].join(' ')),
                transform : xys.interpolate((x,y,s) => [
                    `perspective(${fontSize}px)`,
                    `rotateX(${-y}deg)`,//-1 ~ 1
                    `rotateY(${x}deg)` ,//-1 ~ 1
                    `scale(${1+s/10})` ,// 1 ~ 1.1
                ].join(' ')),
            ...styles[0]}}
           {...{children,className:className+fa?` fas fa-${fa}`:""}}
           {...props} {...bind()}  />
}
