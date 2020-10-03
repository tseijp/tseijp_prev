import React, {FC, Children} from 'react'

export type Element = FC<{bond:number}>
export const Element:Element = ({children}) => {
    // const len = (children as any)?.props?.length||0
    const bonds = Children.map(children, child => {
        return (child as any).props.bond
    })//.reduce((a,b) => a+b)
    if (!bonds || bonds.reduce((a,b)=>a+b) > 4) return null
    return (
        <mesh></mesh>
    )
}

export const H =()=> <Element bond={1} />
export const C =()=> <Element bond={4} />
export const O =()=> <Element bond={2} />
//export const OH =()=> <O><H/></O>
// export const COOH =()=> <C><O/><OH/></C>
