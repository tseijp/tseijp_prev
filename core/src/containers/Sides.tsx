import React, {FC,CSSProperties,useCallback,useMemo,useRef} from 'react';
import { useSpring, animated as a, config } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { BindsProps, BasedProps } from'../types'
import { Icon } from '../components'

export const SidesArea :FC<BindsProps> = ({spring, bind, size=1}) => {
    const width = spring.x.to((x:number)=>x>1?"100%":`${size*50/2}px`)
    const background = spring.scale.to((s:number)=>{
        const rate  = spring.x.animation.to/window.innerWidth //0 ~ 0.5
        return `linear-gradient(90deg,rgba(0,0,0,${rate+s-1}),rgba(0,0,0,0))`
    })
    const style = {position:"fixed",top:0,left:0,height:"100%",zIndex:1,overflow:"hidden"}
    return <a.div style={{...style,width,background}} {...bind()} />
}

export const SidesContainer : FC<BindsProps> = ({size=1, spring, children}) => {
    const styles = useMemo<CSSProperties[]>(()=>[
      { margin:`${50*size}px 0px 0px 0px`, position:"absolute",},
      { position:"fixed",top:"2%",left:0,zIndex:1,overflow:"hidden",
        borderRadius:`0px ${50*size}px ${50*size}px 0px`,
        height:`96%`, backgroundColor:"#212121" }
    ], [size])
    return (
        <a.div style={{...styles[1],width:spring.x.interpolate((x:number)=>x>0?x:0)}}>
            <div style={styles[0]}>{children}</div>
        </a.div>
    )
}

export const SidesIcon : FC<BindsProps> = ({spring, bind, circ=false, size=1}) => {
    return (
        <a.div {...bind()} style={{
            position:"absolute",top:size*50,left:size*50,
            transform:`translate(-50%,-50%)`,...spring}}>
            <Icon fa="align-left" {...{circ,size}} />
        </a.div>
    )
}

export const SidesItem :FC<BindsProps> = ({children, size=1}) => {
    return <a.div {...{children, style:{
        //x:spring.x.interpolate((x,y,s)=>(x-width)), // BAD DESIGN
        padding:"10px 10px 10px 32px",color:"#818181",
        display:"block",transition:"0.75s",fontSize:50*size}}} />
}

export const Sides : FC<BasedProps> = ({children, width=window.innerWidth/2, size=1, onOpen=()=>null}={}) => {
    const opened = useRef<boolean>(false)
    const setOpened = useCallback((bool=true)=>1&&( (opened.current=bool), onOpen&&onOpen() ),[onOpen])
    const [spring, set] = useSpring( () => ({x:0,y:0,scale:1}) )
    const open  =(velocity=0)=>1&&(setOpened(true),set({x:width,y:0,config:velocity!==0?config.wobbly:config.slow}))
    const close =(velocity=0)=>1&&(setOpened(false),set({x:0    ,y:0,config:{...config.stiff,velocity }}))
    const bind = useGesture({
        onHover : ({hovering}) => set({scale:hovering?1.2:1}),
        onDrag : ({last,down,vxvy:[vx,],movement:[mx,my],cancel}) => {
            if ((my<-width*.5||width*.5<my) && cancel) cancel()
            if (!last) return set({x:(opened.current?width:0)+(down?mx:0),y:down?my:0})
            if(!opened.current) return (mx===0||mx> width*0.5||vx> 0.5) ? open(vx) : close(vx)
            if( opened.current) return (mx===0||mx<-width*0.5||vx<-0.5) ? close(vx): open(vx)
        },
    })
    return (
        <div style={{position:"fixed", top:0,left:0,zIndex:100}}>
            <SidesIcon   {...{size, spring, bind, }} />
            <SidesArea     {...{size, spring, bind, }} />
            <SidesContainer{...{size, spring, bind, }}>
            {React.Children.map(children, ((child, key)=>
                <SidesItem {...{size, key}}>{child}</SidesItem>
            ))}
            </SidesContainer>
        </div>
    )
}
