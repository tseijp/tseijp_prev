import React, {
    FC, //CSSProperties as CSS, //Children,
    //useMemo, useCallback, useState, useEffect, useRef
} from 'react'
import {Code as Target, Story} from '../../../src'
const code = `
`
export const Code:FC = () => {
    return (
        <Story {...code}>
            <Target {...{code}}/>
        </Story>
    )
}
