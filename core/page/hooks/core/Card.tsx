import React, {
    FC, //CSSProperties as CSS, //Children,
    //useMemo, useCallback, useState, useEffect, useRef
} from 'react'
import {Card as Target, Story} from '../../../src'
const code = `
`
export const Card:FC = () => {
    return (
        <Story {...code}>
            <Target />
        </Story>
    )
}
