import React, {FC} from 'react'
import {Trees as TREES, Story, Head} from '../../../src'
const code = `
const App = () => (
    <Trees content="Hook">
        <>
            <>Components</>
            <>Card</>
            <>Code</>
            <>Grow</>
            <>Head</>
            <>Icon</>
        </>
        <>
            <>Containers</>
            <>Modal</>
            <>Notes</>
            <>Trees</>
        </>
    </Trees>
)`
export const Trees:FC = () => {
    return (
        <Story {...{code}}>
            <Head {...{dark:0,size:1}}>
                <TREES content="Hook">
                    <>
                        <>Components</>
                        <>Card</>
                        <>Code</>
                        <>Grow</>
                        <>Head</>
                        <>Icon</>
                    </>
                    <>
                        <>Containers</>
                        <>Modal</>
                        <>Notes</>
                        <>Trees</>
                    </>
                </TREES>
            </Head>
        </Story>
    )
}
