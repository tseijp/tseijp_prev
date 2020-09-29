import React, {FC} from 'react'
import {useControl} from 'react-three-gui';
import {Trees as TREES, Head} from '../../../src'
const items = ['0', '1', '2', '3']
export const Trees:FC = () => {
    const dark     = useControl('dark'     , {type: 'boolean', value: false})
    const open     = useControl('open'     , {type: 'boolean', value: true })
    const visible  = useControl('visible'  , {type: 'boolean', value: true })
    const immediate= useControl('immediate', {type: 'boolean', value: true })
    const canHide  = useControl('canHide'  , {type: 'boolean', value: false})
    const depth    = useControl('depth'    , {type: 'number' , value: 0, min: 0, max: 2})
    const root     = useControl('root'     , {type: 'number' , value: 1, min: 0, max: 2})
    const size     = useControl('size'     , {type: 'number' , value: 1, min: 0, max: 2})
    const icon     = useControl('icon'     , {type: 'select' , value: 'Close' , items:['Minus','Plus','Close']})
    const content  = useControl('content'  , {type: 'select' , value: items[0], items})
    return (
        <Head {...{dark,open,visible,immediate,canHide,depth,root,size,icon,content}}>
            <TREES>
                <>
                    <>1</>
                    <>1 - 1</>
                    <>1 - 2</>
                </>
                <>
                    <>2</>
                    <>2 - 1</>
                    <>2 - 2</>
                </>
            </TREES>
        </Head>
    )
}
export const codeTrees =
`import {Trees} from '@tsei/core'
const App = () => (
    <Trees
        dark = {false}
        open = {true}
        visible = {true}
        immediate = {true}
        canHide = {false}
        depth = {0}
        root = {1}
        size = {1}
        icon = {"Close"}
        content={"0"}>
        <>
            <>1</>
            <>1 - 1</>
            <>1 - 2</>
        </>
        <>
            <>2</>
            <>2 - 1</>
            <>2 - 2</>
        </>
    </Trees>
)
`

// const bind = (background="") => ({
//     style: {background},
//     onClick: () => console.log('HI')
// })
// export const Trees:FC = () => {
//     return (
//         <Head {...{dark:0,size:1}}>
//             <TREES content="Hook">
//                 <>
//                     <span {...bind("rgba(255,0,0,.1)")}>Components</span>
//                     <span {...bind("rgba(0,255,0,.1)")}>Card</span>
//                     <span {...bind("rgba(0,0,255,.1)")}>Modal</span>
//                 </>
//                 <span {...bind("rgba(0,0,0,.1)")}>_</span>
//             </TREES>
//         </Head>
//     )
// }