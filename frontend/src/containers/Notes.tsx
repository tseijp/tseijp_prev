import React, {FC, CSSProperties, Children,useCallback,useMemo,useEffect,useState,useRef} from 'react'
import { useSprings, animated as a } from 'react-spring'
import { useGesture, } from 'react-use-gesture'
import { clamp, swap } from '../utils'
import { NotesProps } from '../types'
export const Notes:FC<NotesProps> = ({
       grandren=null, right=null, left=null, depth=0,
       children, size=1, style={},...props
   }) => {
    const [width,fontSize] = useMemo(()=>[size*500,size*50],[size])
    const length = (children as any)?.length || 1
    const [height, setHeight] = useState<number>(width*length) //TODO height
    const [isOpen, setIsOpen] = useState<boolean[]>(Array(length).fill(false))
    const containerRef= useRef<HTMLDivElement|null>(null)
    const childHeight = useRef( Array(length).fill(width) )
    const setPosition = useCallback(() => {
        const childs  = Array.from(containerRef?.current?.children||[])
        childHeight.current = [...childs].map((c:any)=>c.clientHeight)
        setHeight(childHeight.current.reduce((a,b)=>a+b) || width*length)
    }, [width, length])
    /*------------------------- ➊ React Springs -------------------------*/
    const order = useRef<number[]>([...Array(length)].map((_:any,i:number)=>i))
    const getY = ({pre=0,arr=order.current})=>pre<1?0:arr.slice(0,pre).map(i=>childHeight.current[i]).reduce((a,b)=>a+b)
    const getF = useCallback(({i=-1,arr=order.current,pre=-1,mx=0,my=0,down=false}) => (j:number)=>(down && j===i)
        ? {x:down?mx:0,         y:getY({pre})+my, scale:0.9}
        : {x:0, y:getY({pre:arr.indexOf(j),arr}), scale:1.0},[])
    const getG =({i=-1,x=0,s=1.0})=>(j:number)=>({x:j===i?x:0,y:getY({pre:order.current.indexOf(j)}),scale:j===i?s:1})
    const open =({i=-1,x=0,s=0.9})=>{setIsOpen(p=>Object.assign([],p,{[i]:true }));setTimeout(()=>{setPosition();set(getG({i,x,s}))},1) }
    const close=({i=-1,x=0,s=1.0})=>{setIsOpen(p=>Object.assign([],p,{[i]:false}));setTimeout(()=>{setPosition();set(getG({i,x,s}))},1) }
    const [springs, set] = useSprings(length, getF({}))
    const bind = useGesture({
        onDrag:({last,down,args:[i],movement:[mx,my],vxvy:[vx,vy]/*,cancel,startTime,timeStamp*/}) => {
        //  if(timeStamp-startTime<100) cancel && cancel()
            const pre = order.current.indexOf(i)
            const row = clamp( Math.round(pre+my/width), 0, length-1 )
            const arr = swap(order.current, pre, row)
            if(!down) order.current = arr // TODO ?
            if(!last) return set( getF({i,arr,pre,mx,my,down}) )
            const x = (mx>0?1:-1) * fontSize * 2 // window.innerWidth/2 -
            if(!isOpen[i]) return (mx**2<.1||x**2/2<mx**2||vx**2+vy**2>1)?open({i,x}):close({i})
            if( isOpen[i]) return (mx**2<.1||x**2/2<mx**2||vx**2+vy**2>1)?close({i}):open({i,x})
        }
    })
    /* ------------------------- ➋ Child Render -------------------------*/
    const styles = useMemo<CSSProperties[]>( () => [
        {width,position:"relative",margin:`0 auto`,height,   ...style},///*DEV*/,background:"rgba(100,0,0,0.5)"},
        {width,position:"relative",minHeight:width,marginTop:fontSize},///*DEV*/,background:"rgba(0,100,0,0.5)"},
        {position:"absolute",top:0,left:0,right:0,margin:"auto"},///*DEV*/,background:"rgba(0,0,100,0.5)"},
        {position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",fontSize},
    ], [width,height,fontSize,style] )
    children = Children.map(children, (child) => { //toArray(children)
        const grand = Children.toArray((child as any)?.props?.children) || []//count(child.props.children) || 0
        return (grand.length>1 && depth===0) // TODO for depth > 0
            ? React.cloneElement(child as any, {children:grand[0], left:null, right:(
                <Notes {...{...props, depth:depth+1,children:grand.slice(1)}}/> )})
            : child
    })
    useEffect(()=>{ setPosition(); set(getF({})) }, [setPosition, set, getF])
    //!depth&&console.log(`Render Notes:${depth} height:${height} `);
    return (
        <div ref={containerRef} style={{...styles[0]}}>
            {springs.map( ({x,y,scale}, key) =>
                <a.div {...{key}} style={{x,y,position:"absolute"}}>
                    <a.div {...bind(key)} style={{scale,...styles[1]}}>
                        {(children as any)[key]}
                    </a.div>
                    { x.interpolate((px:number)=>px**2>0 ) &&
                    <a.div style={{height:childHeight.current[key],
                        x:x.to((px:number)=> -px+(px>0?-.5:.5)*(width)),y:0, ...styles[2],
                        scale  :x.to((px:number)=>px**2/4>size**2?1:(px>0?px:-px)/(size)),
                        width  :x.to((px:number)=>px>0?px*2:-px*2),
                        display:x.to((px:number)=>px?"inline":"none")
                    }}>
                        { right &&  <a.div style={{display:x.to((px:number)=>px>0?"inline":"none"),...styles[3]}}
                            onClick={()=>1&&(setIsOpen(p=>Object.assign([],{[key]:!p[key]})))}>
                            {right} </a.div> }
                        { left && <a.div style={{display:x.to((px:number)=>px<0?"inline":"none"),...styles[3]}}
                            onClick={()=>1&&(setIsOpen(p=>Object.assign([],{[key]:!p[key]})))}>
                            {left}</a.div> }
                    </a.div>
                    }
                    { isOpen[key] && /* TODO grand child*/
                        ( (children as any)[key].props?.right || '' )
                    }
                </a.div>
            )}
        </div>
    )
}
