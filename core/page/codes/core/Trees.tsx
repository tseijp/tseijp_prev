import React, {FC} from 'react'
import {Trees as TREES, Head} from '../../../src'

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
export const Trees:FC = () => {
    return (
        <Head {...{dark:0,size:1}}>
            <TREES content="Hook">
                <>
                    <>Components</>
                    <>Card</>
                    <>Code</>
                    <>Grow</>
                </>
                <>
                    <>Containers</>
                    <>Modal</>
                    <>Notes</>
                    <>Trees</>
                </>
            </TREES>
        </Head>
    )
}
