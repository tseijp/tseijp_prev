//import * as THREE from 'three'
import  React, {FC, //CSSProperties as CSS, FC,
        //useRef,useEffect, useState, useCallback, useLayoutEffect
        } from 'react'
import {useThree} from 'react-three-fiber'
import {Box,} from 'react-three-flex'
import {Text} from 'drei/abstractions/Text'
// import * as hooks from 'hooks'
//import {} from '../src'
import {Props} from '../types'
const styles:{[key:string]:any} = {
    top:  { dir:"row",width:"100%",height:"100%",align:"center",justify:"center"},
    text: { anchorX:"center",letterSpacing:-.05,positionZ:0.5,
            anchorY:"middle",lineHeight:1.0,}
}

export const Title:FC<Props> = ({
    children,dark=false,size=1
}) => {
    const {viewport} = useThree()
    return (
        <Box {...styles.top} centerAnchor>
            <Text {...styles.text}
                color={dark?"#818181":"#212121"}
                fontSize={size}
                maxWidth={(viewport.width/4) * 3}
                letterSpacing={0.1}>
                {children}
               <meshStandardMaterial />
            </Text>
        </Box>
    );
}
