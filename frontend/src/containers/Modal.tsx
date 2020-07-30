import React, {FC, useCallback, useMemo, useRef} from 'react'
import { useSpring, animated as a, config } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import {createPortal} from 'react-dom';
import { ModalProps } from '../types';

export const Modal:FC<ModalProps> = ({size=50, width=500, state, children}) => {
    const [isOpen, setIsOpen] = useMemo(()=>state, [state])
    const [spring, set] = useSpring<any>(()=>({x:0,y:0,scale:1}))
    const close=(vx=0,vy=0)=>set({x:vx*width,y:vy*width,scale:0.8,config:{...config.stiff,velocity:vx+vy }})
    /*TODO
    const bind = useGesture({
        onDrag:({last,down,vxvy:[vx,vy],movement:[mx,my],cancel}) => {
            if ((my<-width*.5||width*.5<my) && cancel) cancel()
            if (!last) return set({x:down?mx:0,y:down?my:0,scale:0.9})
            (mx===0||mx**2+my**2>width**2/4||vx**2+vy**2>0.5)&&close(vx,vy)
        },
    })*/
    const root = useMemo<HTMLElement|null>(()=>document.getElementById('root'),[])
    const styles = useMemo<React.CSSProperties[]>(()=>[
          { display:"flex",justifyContent:"center",alignItems:"center",top:0,left:0,zIndex:200,
            position:"fixed",width:"100%" ,height:"100%",backgroundColor:"rgba(0,0,0,0.5)"},
          { position:"fixed",width:`min(${~~width}px,95%)`,minHeight:`min(${width}px, 95%)`,
            backgroundColor:"white",padding:"1em", borderRadius:`${size/2}px`},
        ], [width])
    return isOpen ? createPortal(
        <div style={styles[0]} onClick={()=>setIsOpen(false)}>
            <a.div style={{...spring, ...styles[1]}} //{...bind()}
                onClick={(e:any)=>e.stopPropagation()}>
                {children}
            </a.div>
        </div>
    , root as HTMLElement) : null
}
