import React, {CSSProperties as CSS,FC,Children,useEffect,useRef} from 'react'
import {useSpring, useSprings, animated as a} from 'react-spring'
import {useGesture} from 'react-use-gesture'
import {BasedProps} from '../types'
import {clamp} from '../utils'

const sign =(num=0):number=>(num < 0 &&-1)
                        ||  (num > 0 && 1)
                        ||  (num===0 && 0)
                        ||  0
const samp = <T extends any>(a:T[], l:number, d?:T):T[] => [
    ...a.slice(0,l),
    ...(l-a.length>0? Array(l-a.length).fill(d||a[0]) : [])
]
const getW = (o=[] as number[],w=0,l=0) =>
    o instanceof Array
        ? samp(o, l, -1).map((v=0) => 0
            || (w > 0 && (w <= 1 ? w : w/window.innerWidth))
            || (v > 0 && (v <= 1 ? v : v/window.innerWidth))
            || (v < 0 && -1)
            || 0
        ).map((v,_,s) => v>=0? v : 1 - [...s.filter(v=>v>0),0].reduce((a,b)=>a+b)/ s.filter(v=>v<0).length)
        : Array(l).fill(l>0?1/l:l)
const move = (
    mx=0, k=0, s=1,             // mx: in unseGesture, k: key of bind, s: sign, 0, 1 or -1
    {current:l=2},              // l: lRef
    {current:ws=[0,0]},         // ws:wRef
    mW=0, iw=window.innerWidth  // mW:minWidth in props as 100
) => (i=0) =>
    (i===k||i===k+s)
        && [k,k+s].every(v => -1<v&&v<l)
        && [k,k+s].every(v => mW/iw < ws[v]+mx*(k-v)/iw)
        ? {w:clamp(ws[i]+mx*s*(i===k?1:-1)/iw,mW/iw,(iw-ws[k]-ws[k+s]/iw))}
        : null
const styles:{[key:string]:CSS} = {
    top: {position:"relative",height:"100%",width:"100%",whiteSpace:"nowrap",},
    item:{position:"relative",height:"100%",display:"inline-block",verticalAlign:"top"},
}
export type Split = FC<BasedProps<{
    order :number[]|[], styleItem:CSS,
    width :number, minWidth :number,
    height:number, minHeight:number,
}>>
export const Split:Split = ({
    order=[], width=0, height=0, minWidth=100, minHeight=100,
    dark=false,size=1, style={}, styleItem={},...props
}) => {
    const sRef = useRef<number>(0)
    const lRef = useRef<number>((props as any)?.children?.length||1)
    const hRef = useRef<number>(height||window.innerHeight/lRef.current)
    const wRef = useRef<number[]>(getW(order, width, lRef.current))
    const [spring, setH] = useSpring(() => ({h:hRef.current}))
    const [springs, setW] = useSprings(wRef.current.length, i=>({w:wRef.current[i],z:0}))
    const bind = useGesture({
        //onHover:({args:[key]}) => setW((i=0) => i===key?{z:1}:null),
        //onMouseLeave:() => setW((_) => ({z:0})),
        onDrag:({first, last, args:[key], movement:[mx,my], direction:[dir]}) => {
            if (sRef.current===0||first) sRef.current = sign(dir)
            setH({h:clamp(hRef.current+my, minHeight, window.innerHeight)})
            sRef.current===sign(dir) && setW(move(mx,key,sign(dir),lRef,wRef,minWidth))
            if (!last) return
            wRef.current = springs.map((s:any) => s.w.animation.to || 0)
            hRef.current = spring.h.animation.to as number || 0
        }
    })
    //console.log(order, samp(order, lRef.current, -1), getW(order, width, lRef.current))
    const children = Children.map(props.children, child => child)
    useEffect(() => {
        const len = (props as any)?.children?.length||0
        if (len===lRef.current) return
        lRef.current = len
        wRef.current = [...wRef.current.map(v=>v-1/len/wRef.current.length), 1/len]
        setW((i) => ({w:wRef.current[i]}))
    },  [props, setW])
    useEffect(() => {
        wRef.current = getW(order, width, lRef.current)
        setW(i=>({w:wRef.current[i]}))
    }, [width, setW, order])
    useEffect(() => {
        hRef.current = height||window.innerHeight/lRef.current
        setH({h:hRef.current})
    }, [height, setH])
    return (
        <a.div style={{...styles.top, height:spring.h,...style}} {...props}>
            {springs.map(({w,z},key) =>
                <a.div {...bind(key)} {...{key}} style={{
                        ...styles.item, ...styleItem,
                        width:w.interpolate(v => `${100*v}%`),
                        zIndex:z.interpolate(v => ~~(v*10)) //TODO HOW TO zIndex
                    }}>
                    {(children as any)[key]}
                </a.div>
            )}
        </a.div>
    )
}
