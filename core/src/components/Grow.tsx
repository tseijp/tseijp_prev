import React, {FC,useMemo, useRef} from 'react'
import {BasedProps} from '../types'
import {useView} from 'use-grid'
export const Grow:FC<BasedProps> = ({
    onView=null, role="status",
    size=50, style={}, className="spinner-grow", ...props
}) => {
    const ref = useRef(null)
    useView(ref, onView)
    const styles = useMemo<React.CSSProperties[]>(()=>[
       {position:"relative",display:"grid",margin:"auto", background:"rgba(0,0,255,0.5)",
        width:size*50,height:size*50,...style},
       {placeItems:"center"}
    ], [size,style])
    return (
        <div  {...props} {...{ref, role, style:styles[0]}} >
            <span className="sr-only">Loading...</span>
        </div>
    )
}
