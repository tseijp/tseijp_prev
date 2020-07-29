import React, {FC, useMemo} from 'react'
export const Head :FC<any> = ({children, size=50, style={}}) => {
    const styles = useMemo<React.CSSProperties[]>(()=>[
        {...style, fontSize:size},
    ], [size])
    return (
        <div style={styles[0]}>
            {children}
        </div>
    )
}
