import React, {FC, /*useState, useMemo*/} from 'react'
import { Card, Notes } from '../src'
import { useGrid } from 'use-grid'
export const Hook :FC = () => {
    //const [lang, setLang] = useState<string>(window?.navigator?.language||'ja')
    const [dark, ] = useGrid<boolean>({md:true, lg:false})
    //const [size, setSize] = useGrid<number> ({md:1    , lg:1.5 })
    return (
        <div style={{
            transition:"1s",background:dark?"#000":"#f1f1f1",
            minHeight:"100%",padding:1*100}}>
            <Notes {...{size:1}}>
            {Object.entries({a:1,b:2,c:3}).map(([key,num]) =>
                <div key={key} style={{fontSize:"1.2rem"}}>
                    <Card {...{dark,size:1}}>
                        {num}
                    </Card>
                </div>
            )}
            </Notes>
        </div>
    )
}
