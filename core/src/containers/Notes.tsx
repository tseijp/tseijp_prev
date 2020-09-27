import React, {ReactChild as RC, FC, CSSProperties as CSS, Children,useCallback,useMemo,useEffect,useState,useRef} from 'react'
import {useSprings, animated as a} from 'react-spring'
import {useGesture,} from 'react-use-gesture'
import {clamp, swap} from '../utils'
import {BasedProps} from '../types'

export type Notes = FC<BasedProps<{
    grandren:any,right:RC,left:RC,depth:number
    width:number, height:number
}>>
export const Notes:Notes = ({
    order=null, grandren=null,
    right=null, left=null, depth=0,
    size=1, style={}, ...props
}) => {
    const [length, setLength] = useState<number>((props?.children as any)?.length||1)
    const [height, setHeight] = useState<number>(props.height || size*500*length)
    const [isOpen, setIsOpen] = useState<boolean[]>(Array(length).fill(false))
    const orderRef    = useRef<number[]>(order||[...Array(length)].map((_,i:number)=>i))
    const childHeight = useRef( Array(length).fill(size*500) )
    const containerRef= useRef<HTMLDivElement|null>(null)
    const setPosition = useCallback(() => {
        if (props.height) return setHeight(props.height)
        const childs  = Array.from(containerRef?.current?.children||[])
        childHeight.current = [...childs].map((c:any)=>c.clientHeight||0)
        props?.children && setHeight([...childHeight.current,0].reduce((a,b)=>a+b) || size*500*length)
    }, [size, length, props])
    useEffect(()=>{
        const newLength = (props?.children as any)?.length||1
        setLength(newLength)
        setIsOpen(Array(newLength).fill(false))
        if (orderRef.current.length !== newLength)
            orderRef.current = order||[...Array(newLength)].map((_,i:number)=>i)
            childHeight.current = Array(newLength).fill(size*500)
    }, [size,order,props])
    //  *************************  ➊ React Springs  *************************  //
    const getY =({pre=0,arr=orderRef.current})=>pre<1?0:[...arr.slice(0,pre).map(i=>childHeight.current[i]),0].reduce((a,b)=>a+b)
    const getF =({i=-1,x=0,s=1.0})=>(j=0)=>({x:j===i?x:0,y:getY({pre:orderRef.current.indexOf(j)}),scale:j===i?s:1})
    const getG = useCallback(({i=-1,arr=orderRef.current,pre=-1,mx=0,my=0,down=false}) =>
        (j:number) => (down&&j===i)
            ? {scale:0.9, x:mx, y:getY({pre})+my}
            : {scale:1.0, x:0 , y:getY({pre:arr.indexOf(j),arr})}, [])
    const [springs, set] = useSprings(length, getG({}))
    const bind = useGesture({
        onClick:()=>setTimeout(()=>{setPosition();set(getG({})) },1),
        onDrag : ({ down,cancel,movement:[mx,my],startTime,
                    last, args:[i], vxvy:[vx,vy],timeStamp, }) => {
            if(cancel && timeStamp-startTime<1) cancel()
            const pre = orderRef.current.indexOf(i)
            const row = clamp( Math.round(pre+my/size*500), 0, length-1 )
            const arr = swap(orderRef.current, pre, row)
            if(!down) orderRef.current = arr
            if(!last) return set( getG({i,arr,pre,mx,my,down}) )
            const x = (mx<0?-1:1) * size*50// * 2 // window.innerWidth/2 -
            const op = (mx**2<.1||x**2<mx**2*2||vx**2+vy**2>1) ? !isOpen[i] : isOpen[i]
            setIsOpen(p=>[...Object.assign([],{[i]:!p[i]})])
            setTimeout(()=>{setPosition();set(getF({i,s:op?1:1}))},1)//TODO: s is .9?
        }
    })//, {eventOptions:{passive:true,pointer:false}}
    //  *************************  ➋ Child Render  *************************  //
    const styles = useMemo<CSS[]>( () => [
        {position:"relative",width:"100%",margin:`auto`,height },///*DEV*/,background:"rgba(100,0,0,0.5)"},
        {position:"relative",width:"100%"/*,marginTop:size*50*/},///*DEV*/,background:"rgba(0,100,0,0.5)"},
        {position:"absolute",top:0,left:0,right:0,margin:"auto"},///*DEV*/,background:"rgba(0,0,100,0.5)"},
        {position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",fontSize:size*50 },
    ], [size,height] )
    const children = Children.map(props.children, (child) => {
        const grand = Children.toArray((child as any)?.props?.children) || []//count(child.props.children) || 0
        return (grand.length>1 && depth===0) // TODO for depth > 0
            ? React.cloneElement(child as any, {children:grand[0], grandren:(
                <Notes {...{...props, depth:depth+1,children:grand.slice(1)}}/> )})
            : child
    })
    useEffect(bind as any, [bind])
    useEffect(()=>{ setPosition(); set(getG({})) }, [setPosition, set, getG] )
    return (
        <div ref={containerRef} style={{...styles[0],...style}}>
            {springs.map( ({x,y,scale}, key) =>
                <a.div {...{key}} {...bind(key)}// ref={domTargets.current[key]}
                    style={{x,y,position:"absolute",width:"100%"}}>
                    <a.div style={{scale,...styles[1]}}>
                        {(children as any)[key]}
                    </a.div>
                    { x.interpolate((px:number)=>px**2>0 ) &&
                    <a.div style={{height:childHeight.current[key],...styles[2],
                        y:0,  x:x.to((px:number)=> -px+(px>0?-.5:.5)*(size*500)),
                        scale  :x.to((px:number)=>px**2/4>size**2?1:(px>0?px:-px)/(size)),
                        width  :x.to((px:number)=>px>0?px*2:-px*2),
                        display:x.to((px:number)=>px?"inline":"none")
                    }}>
                        { right&& <a.div style={{display:x.to((px:number)=>px>0?"inline":"none"),...styles[3]}}>
                        { right } </a.div> }
                        { left && <a.div style={{display:x.to((px:number)=>px<0?"inline":"none"),...styles[3]}}>
                        { left  } </a.div> }
                    </a.div>
                    }
                    { isOpen[key] && /* TODO grand child*/
                        ( (children as any)[key]?.props?.grandren || '' )
                    }
                </a.div>
            )}
        </div>
    )
}
