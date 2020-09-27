import React, {FC} from 'react'
import {useControl} from 'react-three-gui';
import {Notes as Target} from '../../../src'
export const Notes:FC = () => {
    const dark  = useControl('dark' , {type: 'boolean', value: false})
    const size  = useControl('size' , {type: 'number' , value: 1, min: 0, max: 2})
    const depth = useControl('depth', {type: 'number' , value: 0, min: 0, max: 2})
    return (
        <Target {...{dark, size, depth:~~depth}}>
            <div style={{height:size*100,background:"rgba(255,0,0,0,1)"}}>1</div>
            <div style={{height:size*100,background:"rgba(0,0,255,0,1)"}}>2</div>
            <div style={{height:size*100,background:"rgba(0,0,255,0,1)"}}>3</div>
        </Target>
    )
}
export const codeNotes =
`import {Notes} from '@tsei/core'
const App =()=> (
    <Notes
        dark={true}
        size={1}>
        <div style={{height:size*100,background:"rgba(255,0,0,0,1)"}}>1</div>
        <div style={{height:size*100,background:"rgba(0,0,255,0,1)"}}>2</div>
        <div style={{height:size*100,background:"rgba(0,0,255,0,1)"}}>3</div>
    </Notes>
)`
