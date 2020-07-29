import React, {FC, useMemo} from 'react'
export const Case :FC<any> = ({children, size=50, style={}}) => {
    const styles = useMemo<React.CSSProperties[]>(()=>[
        {position:"relative",transition:"1s", minHeight:"100vw", padding:size*2, ...style},
    ], [size])
    return (
        <div style={styles[0]}>
            {children}
        </div>
    )
}
