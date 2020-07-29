import React, {FC,useMemo} from 'react'
import {createPortal} from 'react-dom';
import {ModalProps} from '../types';

export const Modal:FC<ModalProps> = ({size=50, width=500, open, set, children}) => {
    const root = useMemo<HTMLElement|null>(()=>document.getElementById('root'),[])
    const styles = useMemo<React.CSSProperties[]>(()=>[
          { display:"flex",justifyContent:"center",alignItems:"center",top:0,left:0,zIndex:200,
            position:"fixed",width:"100%" ,height:"100%",backgroundColor:"rgba(0,0,0,0.5)"},
          { position:"fixed",width:"min(24rem,95%)",height:"auto",backgroundColor:"white",padding:"1em"},
        ], [])
    return open ? createPortal(
        <div style={styles[0]} onClick={()=>set(false)}>
            <div style={styles[1]} onClick={(e:any)=>e.stopPropagation()}>
                {children}
            </div>
        </div>
    , root as HTMLElement) : null
}
