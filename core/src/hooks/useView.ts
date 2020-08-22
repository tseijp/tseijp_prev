import {useEffect} from 'react';
export const useView = (fn:()=>void, refs:[]) => {
    // TODO
    useEffect(()=>{
        fn()
    }, [refs])
}

/* SIMOPLE EXAMPLE
const App = () => {
    const [background, set] = useState('white')
    const ref1 = useRef()
    const ref2 = useView(()=>{
        setTimeout(()=>set('black'))  // in to view
        return ()=>set('white')      // out of view
    }, [ref1] )
    return (
        <div style={{background}}>
            <div ref={ref1} style={{height:"100%",top:0}}>
                😎Hello
            </div>
            <div ref={ref2} style={{heigth:"100%",top:"200%"}}>
                🙄
            </div>
        </div>
    )
}

*/
