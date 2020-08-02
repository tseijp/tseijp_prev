import React, {FC,useEffect,useCallback,useMemo} from 'react';
import { useSpring, animated as a } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import {createPortal} from 'react-dom';
import { ModalProps } from '../types';

export const Modal:FC<ModalProps> = ({
        width=500, open=false, onClose=null,//onOpen=null,size=50, 
        children, color="", style={},
    }) => {
    const [spring, set] = useSpring<any>(()=>({x:0,y:-width,scale:0}))
    const close=useCallback( (vx=0,vy=0) => {
        set({x:vx*width, y:(vy-1)*width, scale:0})
        onClose && setTimeout(()=>onClose(), vx**2+vy**2)
    }, [onClose, width, set] )
    const bind = useGesture({
        onHover : ({hovering}) => set({scale:hovering?0.9:1}),
        onDrag : ({last,down,vxvy:[vx,vy],movement:[mx,my],cancel}) => {
            if ((my<-width*.5||width*.5<my) && cancel) cancel()
            if (!last) return set({x:down?mx:0,y:down?my:0})
            return (mx**2>width**2/4||vx**2+vy**2>10) ? close(vx,vy) : set({x:0,y:0,scale:1})
        },
    })
    const root = useMemo<HTMLElement|null>(()=>document.getElementById('root'),[])
    const styles = useMemo<React.CSSProperties[]>(()=>[
          { display:"flex",justifyContent:"center",alignItems:"center",top:0,left:0,transition:"1s",
            position:"fixed",width:"100%",height:"100%",zIndex:200,color,...style},
        ], [color, style])
    useEffect(()=>{open&&set({x:0,y:0,scale:1})}, [open, set])
    return open ? createPortal(
        <div style={styles[0]} onClick={()=>onClose&&onClose()}>
            <a.div style={{position:"relative",...spring}} {...bind()}
                onClick={(e:any)=>e.stopPropagation()}>
                {children}
            </a.div>
        </div>
    , root as HTMLElement) : null
}
