import React, {
    CSSProperties as CSS, FC, //Children,
    useMemo, useCallback, //useState, useEffect, useRef
} from 'react'
import {useGrid} from 'use-grid'
import {Card as C} from '../../../src'
export const Card:FC = () => {
    const [dark, setDark] = useGrid <number>({md:1, lg:0  })
    const [size, setSize] = useGrid <number>({md:1, lg:1.5})
    const style = useMemo<CSS>(() => ({fontSize:size*50}), [size])
    const onClick = useCallback(() => {
        const change = (p:any) => ({md:p.lg, lg:p.md})
        setDark(change)
        setSize(change)
    }, [setDark,setSize])
    return <C {...{dark,size,style,onClick}}>Card</C>
}
