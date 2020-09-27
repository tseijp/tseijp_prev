import React, {
    FC, //CSSProperties as CSS, //Children,
    //useMemo, useCallback, useState, useEffect, useRef
} from 'react'
import {useControl} from 'react-three-gui';
import {Code as Target} from '../../../src'
const langs = ['javascript', 'python']
const codes = [
`const f = (x) => x**2`,
`def f(x):
    return x**2`
]
export const Code:FC = () => {
    const dark  = useControl('dark'   , {type: 'boolean', value: false})
    const inline= useControl('inline' , {type: 'boolean', value: false})
    const size  = useControl('size'   , {type: 'number' , value: 1, min: 0, max: 2})
    const code     = useControl('code'    , {type: 'select', value:codes[0], items:codes})
    const language = useControl('language', {type: 'select', value:langs[0], items:langs})
    return (
        <Target {...{dark,inline,size,code,language}} />
    )
}
export const codeCode =
`import {Code} from '@tsei/core'
const codeCode = "hello"
const App =  => (
    <Code
        dark    = {false}
        inline  = {false}
        size    = {1}
        code    = {"javascript"}
        language= {"const f = (x) = x**2"}/>
)`
