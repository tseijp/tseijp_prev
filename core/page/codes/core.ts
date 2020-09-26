export const Card =
`import {Card} from '@tsei/core'
const App = () => (
    <Card />
)`

export const Code =
`import {Code} from '@tsei/core'
const code = "hello"
const App = () => (
    <Code code={code}/>
)`

export const Grow =
`import {Grow} from '@tsei/core'
const App = () => (
    <Grow />
)`

export const Trees =
`import {Card} from '@tsei/core'
const App = () => (
    <Trees content="Hook">
        <>1</>
        <>2</>
        <>3</>
    </Trees>
)
`
export const Split =
`import {Card} from '@tsei/core'
export const Split = (
        <Target>
            <div style={{width:"100%",height:"100%",background:"rgba(255,0,0,.1)"}}/>
            <div style={{width:"100%",height:"100%",background:"rgba(0,255,0,.1)"}}/>
            <div style={{width:"100%",height:"100%",background:"rgba(0,0,255,.1)"}}/>
        </Target>
)`
