import React, {
    FC, CSSProperties as CSS, //Children,
    //useMemo, useCallback, useState, useEffect, useRef
} from 'react'
import {useControl} from 'react-three-gui';
import {Card} from '../../../src'
const style:CSS = {textAlign:"center", verticalAlign:"middle", padding:"auto auto", fontSize:100}
const colors = ["white", "black", ]
const childs = ["white", "black", ]
export const HookCard:FC = () => {
    const dark  = useControl('dark' , {type: 'boolean', value: false})
    const size  = useControl('size' , {type: 'number' , value: 1, min: 0, max: 2})
    const min   = useControl('min'  , {type: 'number' , value: 0, min: 0, max: 500})
    const max   = useControl('max'  , {type: 'number' , value: 0, min: 0, max: 500})
    const color    = useControl('color'   , {type: 'select' , value: colors[0], items: colors})
    const children = useControl('children', {type: 'select' , value: childs[0], items: childs})
    return (
        <Card {...{dark,size,min,max,children}}
            style={{...style,color,margin:`${size*100}px auto ${size*100}px auto`}}/>
    )
}
export const codeCard =
`import {Card} from '@tsei/core'
const App =  => (
    <Card
        dark={false}
        size={1}
        min ={0}
        max ={0}
        color=""/>
)`
