import React, {CSSProperties as CSS,FC,Children,useMemo,useEffect,useRef} from 'react'
import {useSpring, useSprings, animated as a} from 'react-spring'
import {useGesture} from 'react-use-gesture'
import {BasedProps} from '../types'
import {clamp,sign,getWRate,} from '../utils'

//https://github.com/gregberge/react-merge-refs/blob/master/src/index.tsx
// export default function mergeRefs<T = any>(
//     refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>
// ): React.RefCallback<T> {
//     return (value) => {
//         refs.forEach((ref) => {
//             if (typeof ref === "function") {
//                 ref(value);
//             } else if (ref != null) {
//                 (ref as React.MutableRefObject<T | null>).current = value;
//             }
//         });
//     };
// }

const styles:{[key:string]:CSS} = {
    top: {position:"relative",overflow:"visible",height:"100%",width:"100%",whiteSpace:"nowrap",},
    item:{position:"relative",overflow:"visible",height:"100%",display:"inline-block",verticalAlign:"top"},
}
export const move = (
    mx=0, k=0, s=1,            // mx: in unseGesture, k: key of bind, s: sign, 0, 1 or -1
    {current:l=2},             // l: lRef
    {current:ws=[0,0]},        // ws:wRef
    mW=0, iw=window.innerWidth // mW:minWidth in props as 100
) => (i=0) => (i===k||i===k+s)
    && [k,k+s].every(v => -1<v&&v<l)
    ?  [k,k+s].every(v => mx*(k-v) <= 0 || mW/iw < ws[v]+mx*(k-v)/iw)
        ?  {w:clamp(ws[i]+mx*s*(i===k?1:-1)/iw, mW/iw, (iw-ws[k]-ws[k+s]/iw))}
        :  null
    : [k,k+s].some(v => v===0 || v===l-1)
        ?  {w:clamp(ws[i]-mx*s*(i===k?1:-1)/iw, mW/iw, (iw-ws[k]-ws[k+s]/iw))}
        :  null

export type Split = FC<BasedProps<{
    order :number[]|[], styleItem:CSS,
    min:number, width:number, height:number,
}>>
export const Split:Split = ({
    order=[], width=0, height=0, min=100,
    dark=false,size=1, style={}, styleItem={}, ...props
}) => {
    const sRef = useRef<number>(0)
    const lRef = useRef<number>((props as any)?.children?.length||1)
    const hRef = useRef<number>(height||window.innerHeight/lRef.current)
    const wRef = useRef<number[]>(getWRate(order, lRef.current, width,))
    const [spring,  setH] = useSpring(() => ({h:hRef.current}))
    const [springs, setW] = useSprings(wRef.current.length, i=>({w:wRef.current[i],z:0}))
    const bind = useGesture({
        onDrag:({first, last, args:[key], movement:[mx,my], direction:[dir]}) => {
            if (sRef.current===0||first) sRef.current = sign(dir)
            setH({h:clamp(hRef.current+my, min, window.innerHeight)})
            sRef.current===sign(dir) && setW(move(mx,key,sign(dir),lRef,wRef,min))
            if (!last) return
            wRef.current = springs.map((s:any) => s.w.animation.to || 0)
            hRef.current = spring.h.animation.to as number || 0
        }
    }, {drag:{lockDirection :true}})
    //console.log(order, samp(order, lRef.current, -1), getW(order, width, lRef.current))
    const children = useMemo(() => Children.map(props.children, c=>c), [props.children])
    useEffect(() => {
        const len = (props as any)?.children?.length||0
        if (len===lRef.current) return
        lRef.current = len
        wRef.current = [...wRef.current.map(v=>v-1/len/wRef.current.length), 1/len]
        setW((i) => ({w:wRef.current[i]}))
    },  [props, setW])
    useEffect(() => {
        wRef.current = getWRate(order,lRef.current,width)
        setW(i=>({w:wRef.current[i]}))
    }, [width, setW, order])
    useEffect(() => {
        hRef.current = height||window.innerHeight/lRef.current
        setH({h:hRef.current})
    }, [height, setH])
    return (
        <a.div style={{...styles.top, height:spring.h,...style}} {...props}>
            {springs.map(({w},key) =>
                <a.div {...bind(key)} {...{key}} style={{
                        ...styles.item, ...styleItem,
                        width:w.interpolate(v => `${100*v}%`),
                        //zIndex:z.interpolate(v => ~~(v*10))
                    }}>
                    {(children as any)[key]}
                </a.div>
            )}
        </a.div>
    )
}
