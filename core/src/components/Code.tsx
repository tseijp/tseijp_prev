import React, {FC, useCallback, useMemo} from "react";
import {BasedProps} from '../types'
const {atomOneLight, atomOneDark} = require('react-syntax-highlighter/dist/esm/styles/hljs');
const {Light} = require('react-syntax-highlighter');

export type Code = FC<BasedProps<{
    code:string, language:string, inline:boolean
}>>
export const Code:Code = ({
    code='', language="javascript", inline=false, dark=false, style={}, ...props//children,
}) => {
    const onDoubleClick = useCallback((_:any)=>navigator.clipboard.writeText(code),[code])
    const customStyle = useMemo(()=>{
        return {...(inline?{verticalAlign:"top",padding:0}:{}),
            display:inline?"inline-block":"fixed", position:'relative', margin:0,}
    }, [inline])
    return <Light   {...props} PreTag={inline?"span":"pre"}    useInlineStyles={true}
                    {...{customStyle, onDoubleClick, language}}showLineNumbers={!inline}
             style={{...(dark?atomOneDark:atomOneLight),...style}}>
                    {code}</Light>
}
