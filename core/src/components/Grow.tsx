import React, {FC,useEffect, useMemo, useRef} from 'react'
import {BasedProps} from '../types'
import {useView} from 'use-grid'
export const Grow:FC<BasedProps> = ({
    onView=null, role="status",
    size=1, className="spinner-grow", ...props
}) => {
    const fn = useRef()
    const ref = useRef(null)
    useEffect(()=>{fn.current = onView}, [onView])
    useView(ref, (e:any) => 1
        && e.isIntersecting
        && typeof fn.current==="function"
        && (fn.current as any)())
    const style = useMemo<React.CSSProperties>(()=>({
        position:"relative",display:"grid",margin:`${size*50}px auto 0 auto`,
        width:size*250,height:size*250,...(props.style||{})
    }), [size, props.style])
    return <div  {...props} {...{ref,role,className,style}} />
}
