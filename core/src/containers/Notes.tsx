import React, {FC, CSSProperties, Children,useCallback,useMemo,useEffect,useState,useRef} from 'react'
import { useSprings, animated as a } from 'react-spring'
import { useGesture, } from 'react-use-gesture'
import { clamp, swap } from '../utils'
import { NotesProps } from '../types'
export type Notes = FC<NotesProps>
export const Notes:Notes = ({
    order=null,
    grandren=null, right=null, left=null, depth=0,
    children, size=1, style={},...props
}) => {
    const [width,fontSize] = useMemo(()=>[size*500,size*50],[size])
    const [length, setLength] = useState<number>((children as any)?.length||1)
    const [height, setHeight] = useState<number>(width*length)
    const [isOpen, setIsOpen] = useState<boolean[]>(Array(length).fill(false))
    const orderRef    = useRef<number[]>(order||[...Array(length)].map((_,i:number)=>i))
    const containerRef= useRef<HTMLDivElement|null>(null)
    const childHeight = useRef( Array(length).fill(width) )
    const setPosition = useCallback(() => {
        const childs  = Array.from(containerRef?.current?.children||[])
        childHeight.current = [...childs].map((c:any)=>c.clientHeight)
        children && setHeight(childHeight.current.reduce((a,b)=>a+b) || width*length)
    }, [width, length, children])
    useEffect(()=>{
        const newLength = (children as any)?.length||1
        setLength(newLength)
        setIsOpen(Array(newLength).fill(false))
        if (orderRef.current.length !== newLength)
            orderRef.current = order||[...Array(newLength)].map((_,i:number)=>i)
            childHeight.current = Array(newLength).fill(width)
    }, [width,order,children])
    //  *************************  ➊ React Springs  *************************  //
    const getY =({pre=0,arr=orderRef.current})=>pre<1?0:arr.slice(0,pre).map(i=>childHeight.current[i]).reduce((a,b)=>a+b)
    const getF =({i=-1,x=0,s=1.0})=>(j=0)=>({x:j===i?x:0,y:getY({pre:orderRef.current.indexOf(j)}),scale:j===i?s:1})
    const getG = useCallback(({i=-1,arr=orderRef.current,pre=-1,mx=0,my=0,down=false}) =>
        (j:number) => (down&&j===i)
            ? {scale:0.9, x:mx, y:getY({pre})+my}
            : {scale:1.0, x:0 , y:getY({pre:arr.indexOf(j),arr})}, [])
    const [springs, set] = useSprings(length, getG({}))
    const bind = useGesture({
        onDrag : ({ down,cancel,movement:[mx,my],startTime,
                    last, args:[i], vxvy:[vx,vy],timeStamp, }) => {
            if(!isOpen[i] && cancel && timeStamp-startTime<1000) cancel()
            const pre = orderRef.current.indexOf(i)
            const row = clamp( Math.round(pre+my/width), 0, length-1 )
            const arr = swap(orderRef.current, pre, row)
            if(!down) orderRef.current = arr
            if(!last) return set( getG({i,arr,pre,mx,my,down}) )
            const x = (mx<0?-1:1) * fontSize// * 2 // window.innerWidth/2 -
            const op = (mx**2<.1||x**2<mx**2*2||vx**2+vy**2>1) ? !isOpen[i] : isOpen[i]
            setIsOpen(p=>[...Object.assign([],{[i]:!p[i]})])
            setTimeout(()=>{setPosition();set(getF({i,x:op?x:0,s:op?.9:1}))},1)
        }
    })
    //  *************************  ➋ Child Render  *************************  //
    const styles = useMemo<CSSProperties[]>( () => [
        {width:`min(95vw,${width}px)`,position:"relative",margin:`auto`,...style,height     },//*DEV*/,background:"rgba(100,0,0,0.5)"},
        {width:`min(95vw,${width}px)`,position:"relative",marginTop:fontSize,minHeight:width},//*DEV*/,background:"rgba(0,100,0,0.5)"},
        {position:"absolute",top:0,left:0,right:0,margin:"auto"                             },//*DEV*/,background:"rgba(0,0,100,0.5)"},
        {position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",fontSize },
    ], [width,height,fontSize,style] )
    children = Children.map(children, (child) => {
        const grand = Children.toArray((child as any)?.props?.children) || []//count(child.props.children) || 0
        return (grand.length>1 && depth===0) // TODO for depth > 0
            ? React.cloneElement(child as any, {children:grand[0], grandren:(
                <Notes {...{...props, depth:depth+1,children:grand.slice(1)}}/> )})
            : child
    })
    useEffect(()=>{ setPosition(); set(getG({})) }, [setPosition, set, getG] )
    //!depth&&console.log(`Render Notes:${depth} height:${height} length:${length} orderRef:`,orderRef.current);
    return (
        <div ref={containerRef} style={{...styles[0]}}>
            {springs.map( ({x,y,scale}, key) =>
                <a.div {...{key}} style={{x,y,position:"absolute"}}>
                    <a.div {...bind(key)} style={{scale,...styles[1]}}>
                        {(children as any)[key]}
                    </a.div>
                    { x.interpolate((px:number)=>px**2>0 ) &&
                    <a.div style={{height:childHeight.current[key],...styles[2],
                        y:0,  x:x.to((px:number)=> -px+(px>0?-.5:.5)*(width)),
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
                        ( (children as any)[key].props?.grandren || '' )
                    }
                </a.div>
            )}
        </div>
    )
}
