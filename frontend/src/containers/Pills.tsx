import React, {FC,Children,CSSProperties,useMemo,useState,useRef,/*useEffect*/} from 'react'
import { useSprings, animated/*, config*/ } from 'react-spring'
//import { useGesture, } from 'react-use-gesture'

export const Pills:FC<any> = ({
    position={x:0,y:0,r:Math.PI/4}, depth=0, rate=1.414,
    size=1, isOpen=true, ...props}) => {
    const length = useMemo( () => props?.children?.length||1, [props] )
    const childPos = useRef( Array(length).fill(position) )
    const [childHub, setChildHub] = useState( Array(length).fill(false) )
    // depth>0 && console.log(`Render Pills:${depth} isOpen:${isOpen} childHub:${childHub}`);
    const fn = () => (i:number) => {
        //depth>1 && console.log(`\tfn:${depth}-${i} ${isOpen?'':'no '}open`);
        const r = position.r/2 + (Math.PI/2) * ((length-i-1)*10+1)/((length-1)*10+2)-Math.PI/8
        const x = isOpen ?  50*rate*size*Math.cos(r) : 0
        const y = isOpen ? -50*rate*size*Math.sin(r) : 0
        childPos.current[i] = {x,y:-y,r}
        return {x, y, scale:isOpen?1:0 }
    }
    const [springs, set] = useSprings( length, fn() )
    const setHub=(key=0,isopen=true)=>setChildHub(pre => Object.assign([],pre,{[key]:isopen}))
    const children = Children.map( props.children, (child,key) => {
        //depth>1 && console.log(`\tChildren useMemo:${depth}`);
        set(fn())
        return child?.props?.children
          ? React.cloneElement(child, {children:
                <Pills {...{key, isOpen:isOpen&&childHub[key],
                    depth:depth+1, position:childPos.current[key],
                    rate:rate*(1+(depth+1)*0.2),
                    fontSize:50*size/(1+(depth+1)*0.2),
                    ...child.props}}/>
            })
          : child
    })//), [props.children, isOpen, childHub, dark,depth,pso])
    const styles = useMemo<CSSProperties[]>(()=>[
        {position:"fixed",left:position.x,bottom:position.y},
        {position:"absolute",padding:"0px",zIndex:1,transform:`translate(-50%,-50%)`,}
    ], [position])
    return (
        <div style={styles[0]}>
            {springs.map((spring, key) =>
                <animated.div key={`${depth}-${key}`} style={{...spring, ...styles[1]}}
                    onClick={e=>1&&(setHub(key, !childHub[key]),e.stopPropagation())}>
                    {children[key]}
                </animated.div>
            )}
        </div>
    )
}
/* TODO 2014
    use grandChild
    <animated.div {...{key}} style={spring}>
        {children[key]?.props?.children && <Pills>
            {children[key].props.children} </Pills> }
    </animated.div>

    children[i].map(c=>c.props.children =()=> c.props.children.length
        ? <Pills>c.props.children</Pills>
        : c.props.children  )
*/
