/***Card
  *     Ref : https://codesandbox.io/embed/rj998k4vmm
  *           https://coliss.com/articles/build-websites/operation/css/
 ***/
import React, {FC, useCallback, useMemo} from 'react'
import { BasedProps } from '../types'
import { useSpring, animated as a } from 'react-spring'
//import { useGesture } from 'react-use-gesture'
export const Card :FC<BasedProps> = ({
    dark=false, size=1, children, color="", style, ...props
}) => {
    const [{xys}, set] = useSpring(()=>({xys:[0,0,0]}))
    const [fontSize, width] = useMemo(()=>[size*50,size*500],[size])
    const styles = useMemo(()=>[
          { minHeight:width, width:`min(95vw,${width}px)`,
            borderRadius:fontSize/2, fontSize, margin:"auto",
            background:dark?"#212121":"#fff",overflow:"hidden",
            color:color||dark?"#818181":"#000", ...style }
    ], [dark, color, style, fontSize, width])
    const calc = useCallback(({clientX:x, clientY:y})=>[
         (x - window.innerWidth  / 2) / width * 2, // -1 ~ 1
         (y - window.innerHeight / 2) / width * 2, // -1 ~ 1
         1], [width])
    const onMouseMove = useCallback((e) => set({xys:calc(e)}), [set,calc])
    const onMouseLeave = useCallback(() => set({xys:[0,0,0]}), [set,])
    return useMemo(()=>
        <a.div style={{
            boxShadow:xys.interpolate((x,y,s) => [
                `${0.5-x*2}rem`, //offset-x : -1.5 ~ 0.5 ~ 2.5
                `${1.5-y*2}rem`, //offset-y : -0.5 ~ 1.5 ~ 3.5
                `${1.5+s}rem`, //blur-radius   : 1.5 =hover=> 2.5
                `${s-0.5}rem`, //spread-radius :-0.5 =hover=> 0.5
                `hsl(200 50% 20% / ${15+s*5}%)`//15% =hover=> 20%
            ].join(' ')),
            transform:xys.interpolate((x,y,s) => [
                `perspective(${width}px)`,
                `rotateX(${-y}deg)`,//-1~1
                `rotateY(${x}deg)`,//-1~1
                `scale(${1+s/10})`,//1 ~ 1.1
            ].join(' ')) ,
            ...styles[0] }}
           {...{...props,onMouseMove,onMouseLeave,children}}/>
        , [styles,xys,onMouseMove,onMouseLeave,children,props,width])
}
