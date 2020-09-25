import React, {
    FC, //CSSProperties as CSS, Children,
    //useMemo, useCallback, useState, useEffect, useRef
} from 'react'
import {Grow as Target, Story} from '../../../src'
const code = `
`
export const Grow:FC = () => {
    return (
        <Story {...code}>
            <Target />
        </Story>
    )
}
