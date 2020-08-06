import React, {FC, useState, useMemo} from 'react'
import { Head, Foot } from '../../src/components'
import { Sides, Trans } from '../../src/containers'
import { useGrid } from 'use-grid'

export const Hook :FC = () => {
    /* state */
    const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, setDark] = useGrid<boolean>({md:false, lg:true})
    const [size, setSize] = useGrid<number> ({md:1    , lg:1.5 })
    return (
    <div style={{background:dark?"#000":"#fff"}}>
        TODO
    </div>
    )
}
