import React, {FC} from 'react'
import {Split as Target} from '../../../src'

export const Split:FC = () => {
    return (
        <Target>
            <div style={{width:"100%",height:"100%",background:"rgba(255,0,0,.1)"}}/>
            <div style={{width:"100%",height:"100%",background:"rgba(0,255,0,.1)"}}/>
            <div style={{width:"100%",height:"100%",background:"rgba(0,0,255,.1)"}}/>
        </Target>
    )
}
