import React, {
    FC, //CSSProperties as CSS, Children,
    //useMemo, useCallback, useState, useEffect, useRef
} from 'react'
import {Head as Target, Story} from '../../../src'
const code = `
`
export const Head:FC = () => {
    return (
        <Story {...code}>
            <Target />
        </Story>
    )
}
