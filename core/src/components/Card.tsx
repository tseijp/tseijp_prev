/***Card
  *     Ref : https://codesandbox.io/embed/rj998k4vmm
  *           https://coliss.com/articles/build-websites/operation/css/
 ***/
import React, {FC, useCallback, useMemo} from 'react'
import { BasedProps } from '../types'
import { useSpring, animated as a } from 'react-spring'
export type Card = FC<BasedProps<{
    max:null|number,
    min:null|number
}>>
export const Card:Card = ({children, size=1, style={}, ...props}) => {
    const [{xys}, set] = useSpring(()=>({xys:[0,0,0]}))
    const styleCard = useMemo(() => {
        const {dark=false,color="",max=null, min=null} = props
        const minHeight = min||size*500
        const maxHeight = max||null//size*500
        return {margin:"auto", overflow:"hidden", borderRadius:size*25,
                ...(minHeight&&{minHeight}), background : dark?"#212121":"#fff",
                ...(maxHeight&&{maxHeight}), color:color||dark?"#818181":"#000",
                width:`min(80%,${size*500}px)`, }
    }, [size, props])
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
            ...styleCard, ...style }}
           {...{...props,onMouseMove,onMouseLeave,children}}/>
        , [style,styleCard,xys,onMouseMove,onMouseLeave,children,props,size])
}
