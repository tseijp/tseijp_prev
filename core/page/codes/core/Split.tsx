import React, {FC} from 'react'
import {useControl} from 'react-three-gui';
import {Split as Target} from '../../../src'

export const Split:FC = () => {
    const dark  = useControl('dark'  , {type: 'boolean', value: false})
    const size  = useControl('size'  , {type: 'number' , value: 1, min: 0, max: 2})
    const min   = useControl('min'   , {type: 'number' , value:.5, min: 0, max: 1})
    const width = useControl('width' , {type: 'number' , value: 0, min: 0, max: 1})
    const height= useControl('height', {type: 'number' , value: 0, min: 0, max: 1})
    return (
        <div style={{height:"50vh"}}>
            <Target {...{dark,size,min,width,height}}>
                <div style={{width:"100%",height:"100%",background:"rgba(255,0,0,.1)"}}/>
                <div style={{width:"100%",height:"100%",background:"rgba(0,255,0,.1)"}}/>
                <div style={{width:"100%",height:"100%",background:"rgba(0,0,255,.1)"}}/>
            </Target>
        </div>
    )
}
export const codeSplit =
`import {Split} from '@tsei/core'
export const Split = (
        <Target
            dark  ={false}
            size  ={1}
            min   ={}
            width ={0}
            height={0}>
            <div style={{width:"100%",height:"100%",background:"rgba(255,0,0,.1)"}}/>
            <div style={{width:"100%",height:"100%",background:"rgba(0,255,0,.1)"}}/>
            <div style={{width:"100%",height:"100%",background:"rgba(0,0,255,.1)"}}/>
        </Target>
)`
