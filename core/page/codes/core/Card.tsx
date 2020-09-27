import React, {
    FC, //CSSProperties as CSS, //Children,
    //useMemo, useCallback, useState, useEffect, useRef
} from 'react'
import {Card as Target} from '../../../src'
export const Card:FC = () => {
    return (
        <Target dark={true} size={0.5} style={{margin:"100px auto 100px auto"}}/>
    )
}
