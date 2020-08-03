import React, {FC, useEffect, useMemo} from 'react'
import {useSpring, animated as a} from 'react-spring'
export const Head :FC<any> = ({children, size=50, style={}}) => {
    const [{fontSize}, set] = useSpring<any>(()=>({fontSize:size*50}))
    useEffect(()=>{set({fontSize:size*50})}, [size,set])
    const styles = useMemo<React.CSSProperties[]>(()=>[
        {fontSize, ...style},
    ], [fontSize, style])
    return (
        <a.div style={styles[0]}>
            {children}
        </a.div>
    )
}
