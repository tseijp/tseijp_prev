/***Card
  *     Ref : https://codesandbox.io/embed/rj998k4vmm
  *           https://coliss.com/articles/build-websites/operation/css/
 ***/
import React, {FC, useCallback, useMemo} from 'react'
import { BasedProps } from '../types'
import { useSpring, animated as a } from 'react-spring'
//import { useGesture } from 'react-use-gesture'
export const Card :FC<BasedProps> = ({
    dark=false, size=1, children, color="",
    minHeight=null, maxHeight=null, ...props
}) => {
    const [{xys}, set] = useSpring(()=>({xys:[0,0,0]}))
    const style = useMemo(() => {
        const [width,fontSize] = [`min(80vw,${size*500}px)`,size*50]
        const min = minHeight||size*500
        const max = maxHeight||null//size*500
        return {margin:"auto", overflow:"hidden", borderRadius:fontSize/2,
                background : dark?"#212121":"#fff", minHeight:min, fontSize,
                color:color||dark?"#818181":"#000", maxHeight:max, width, ...props.style}
    }, [dark, color, size, props.style, maxHeight, minHeight])
    const calc = useCallback(({clientX:x, clientY:y})=>[
       (x - window.innerWidth  / 2) / size / 250, // -1 ~ 1
       (y - window.innerHeight / 2) / size / 250, // -1 ~ 1
        1], [size])
    const onMouseMove = useCallback((e) => set({xys:calc(e)}), [set,calc])
    const onMouseLeave = useCallback(() => set({xys:[0,0,0]}), [set,])
    return useMemo(()=>
        <a.div style={{
            boxShadow:xys.interpolate((x,y,s) => [
                `${0.5-x*2}rem`,//offset-x     : -1.5 ~ 0.5 ~ 2.5
                `${1.5-y*2}rem`,//offset-y     : -0.5 ~ 1.5 ~ 3.5
                `${1.5 + s}rem`,//blur-radius  : 1.5 =hover=> 2.5
                `${s - 0.5}rem`,//spread-radius:-0.5 =hover=> 0.5
                `hsl(200 50% 20% / ${15+s*5}%)`].join(' ')),
            transform:xys.interpolate((x,y,s) => [
                `perspective(${size*50}px)`,
                `rotateX(${-y/10}deg)`,//-0.1 ~ 0.1
                `rotateY(${ x/10}deg)`,//-0.1 ~ 0.1
                `scale(${1+s/10})` ,].join(' ')),
            ...style }}
           {...{...props,onMouseMove,onMouseLeave,children}}/>
        , [style,xys,onMouseMove,onMouseLeave,children,props,size])
}
