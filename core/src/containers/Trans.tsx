import React, {FC,useCallback,useMemo,useRef} from 'react';
import {useSpring, animated as a, config, UseSpringProps} from 'react-spring'
import {useGesture} from 'react-use-gesture'
import {BasedProps} from '../types'
import {Icon} from '../components'

const styles = {
    area: {position:"fixed",top:0,right:0,height:"100%",zIndex:1},
    cont: {position:"fixed",height:`96%`,top:"2%",right:0,zIndex:1,overflowX:"hidden"},
    icon: {position:"absolute",right:0,transform:`translate(-50%,-50%)`,},
    item: {backgroundColor:"#212121",color:"#818181", display:"inline-block"},
}
export const TransArea :FC<BasedProps> = ({size=1, spring, bind}) =>
    <a.div style={{
        width: spring.r.interpolate((r:number)=>`${
            50*size*( Math.cos(r/90*Math.PI)+1.5)
        }px`),
        background: spring.scale.interpolate((s:number)=>[
            `linear-gradient(90deg`,
            `rgba(0,0,0,0)`,
            `rgba(0,0,0,${s-1}))`
        ].join(',')),
        ...styles.area}}
       {...bind()} />

export const TransContainer : FC<BasedProps> = ({children, size=1, spring, bind}) =>
    <a.div {...bind()} style={{...styles.cont,
        width:spring.r.interpolate((r=0) => `${ 50*size*(Math.cos(r/90*Math.PI)+1) }px` )}}>
        <div style={{margin:`calc(${50*size*2}px - 2%) 0px 0px 0px`}}>{children}</div>
    </a.div>

export const TransIcon : FC<BasedProps> = ({size=1, spring, bind, circ=false}) =>
    <a.div {...bind()} style={{...styles.icon, top:50*size, rotateZ:spring.r}}>
        <Icon fa="align-justify" {...{circ,size}} />
    </a.div>

export const TransItem :FC<BasedProps> = ({children, size=1}) =>
    <a.div style={{...styles.item,
        margin:`${50*size/4}px 0px`,
        borderRadius:`${50*size}px 0px  0px ${50*size}px`,}}>
        <div style={{
            height:50*size, margin:`auto ${50*size/2}px`,
            fontSize:50*size, zIndex:1, display:"flex", alignItems:"center",
        }}>{children}</div>
    </a.div>

export const Trans : FC<BasedProps> = ({children, size=1, onOpen=()=>null}={}) => {
    const opened = useRef<boolean>(false)
    const setOpened = useCallback((bool:boolean)=>1&&( (opened.current=bool), onOpen&&onOpen() ),[onOpen])
    const [spring, set] = useSpring<UseSpringProps>( () => ({x:0, y:0, r:90, scale:1,}) )
    const getr = (velocity=0) => {
        const pre  = ~~(spring.r.animation.to/90) //  Math.round( spring.r.animation.to/90 || 0 ) //
        const unit = ((opened.current?1:0) === (pre%2)?0:1) ? 0:1 //to change:1 no diff:0
        return 90 * ( pre + unit * (velocity<0?-1:1) )
    }
    const width = useMemo(()=>500*size, [size])
    const open  =(v=0)=>1&&(setOpened(true) ,set({r:getr(v),config:v!==0?config.wobbly:config.slow}))
    const close =(v=0)=>1&&(setOpened(false),set({r:getr(v),config:{...config.stiff }}))
    const onBind=({mx=0,vx=0,down=false,last=false}) => {
        if (!last) return set({r:spring.r.animation.to+(down?2*(-mx)/width:0)})
        if(!opened.current) return (mx===0||mx<-width*0.5||vx<-0.5) ?  open(-vx) : close(-vx)
        if( opened.current) return (mx===0||mx<-width*0.5||vx<-0.5||0.5<vx) ? close(-vx) :  open(-vx)
    }
    const bind = useGesture({
        onHover: ({hovering}) => set({scale:hovering?1.2:1}),
        onPinch: ({last,down,offset :[_,a]})  => onBind({down,last,vx:0,mx:a}),
        onDrag : ({last,down,vxvy:[vx,],movement:[mx,],}) => onBind({down,last,vx,mx:mx})
    })
    return (
        <div style={{position:"fixed",top:0,right:0,zIndex:100}}>
            <TransIcon      {...{size, spring, bind, }} />
            <TransArea      {...{size, spring, bind, }} />
            <TransContainer {...{size, spring, bind, }} >
            {React.Children.map(children, ((child, key:number)=>
                <TransItem {...{size/*, spring, width*/, key}} >{child}</TransItem>
            ))}
            </TransContainer>
        </div>
    )
}
