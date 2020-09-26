import React, {FC} from 'react'
import {Trees as TREES, Head} from '../../../src'

export const Trees:FC = () => {
    return (
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
    )
}
