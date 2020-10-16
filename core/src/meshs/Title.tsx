//import * as THREE from 'three'
import React, {FC} from 'react'
import {Text} from "drei";
// import { EffectComposer, Bloom } from "react-postprocessing";
import { useReflow} from "react-three-flex";
import {Props} from '../types'
type Anchor = number|"center"|"left"|"right"|undefined

export type Title = FC<Props<{anchorX:Anchor, anchorY:Anchor, textAlign:"center",href:string}>>
export const Title:Title = ({
    anchorX="center", anchorY="middle", textAlign="center", href="",
    size=1, space=0, maxWidth=1, children, ...props
}) => {
    const reflow = useReflow()
    const onClick = href? null: () => window.open(href)
    return (
        <Text {...props as any} {...{anchorX, anchorY, textAlign, maxWidth, onClick}}
            onSync={reflow} letterSpacing={space} fontSize={size/2} lineHeight={size/2}>
            {typeof children==="string"? children: (children as any)?.props?.children||''}
            <meshStandardMaterial />
        </Text>
    )
}
