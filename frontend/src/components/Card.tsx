import React, {FC, useMemo} from 'react'
import {BasedProps} from '../types'
//import {useSpring, animated as a} from 'react-spring'
export const Card :FC<BasedProps> = ({
        dark=false, size=1, children, color="", style={}
    }) => {
    const [fontSize, width] = useMemo(()=>[size*50,size*500],[size])
    const styles = useMemo<React.CSSProperties[]>(()=>[
          { boxShadow:"0px 1px 50px rgba(0,0,0,0.2)",//"0 2.5rem 2rem -2rem hsl(200 50% 20% / 40%)"}
            minHeight:width, width, maxWidth:"95vw", margin:"auto auto",
            borderRadius:fontSize/2, fontSize,
            background:dark?"#212121":"#fff",
             color:color||dark?"#818181":"#000",padding:size/2,...style},
    ], [dark, color, size, style, fontSize, width])
    return <div {...{style:styles[0], children}} />
}
