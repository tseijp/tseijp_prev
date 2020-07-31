import React, {FC, Children, useMemo} from 'react'
export const Foot :FC<any> = ({children, size=50, style={}}) => {
    const styles = useMemo<React.CSSProperties[]>(()=>[
      { background:"#212121",minWidth:"100%", heihgt:"auto",borderRadius:`${size/2}px ${size/2}px 0px 0px`,
        position:"absolute", left:0, bottom:0, padding:`0px ${size}px ${size/2}px ${size}px`, ...style},
      { position:"relative", fontSize:size, textAlign:"center"},
  ], [size, style])
    return (
        <div style={styles[0]}>
            {Children.map(children, (child)=>
                <div style={styles[1]}>{child}</div>
            )}
        </div>
    )
}
