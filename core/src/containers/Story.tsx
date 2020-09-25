import React, {FC} from 'react'
import {Code} from '../components'
import {BasedProps} from '../types'

export type Story = FC<BasedProps<{
    code:string,//style={}
}>>
export const Story:Story = ({
    children, code="", dark=false,size=1
}) => {
    return (
        <>
            {children}
            <Code {...{code,dark,size}}/>
        </>
    )
}
