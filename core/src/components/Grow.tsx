import React, {FC,useMemo} from 'react'
import {BasedProps} from '../types'
export const Grow:FC<BasedProps> = () => {
    const style = useMemo<React.CSSProperties>(()=>({
        position:"absolute",placeItems:"center",margin:"auto",
        left:0,right:0,top:0,bottom:0,width:"50vh",height:"50vh"}),[])
    return (
        <div className="spinner-grow" style={style} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    )
}
