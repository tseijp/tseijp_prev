import React, {FC, useMemo} from 'react'
export const Head :FC<any> = ({children, size=50, style={}}) => {
    const styles = useMemo<React.CSSProperties[]>(()=>[
        {fontSize:size, ...style},
    ], [size, style])
    return (
        <div style={styles[0]}>
            {children}
        </div>
    )
}
