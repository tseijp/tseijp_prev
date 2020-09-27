export const CardCode =
`import {Card} from '@tsei/core'
const App =  => (
    <Card />
)`

export const CodeCode =
`import {Code} from '@tsei/core'
const codeCode = "hello"
const App =  => (
    <Code code={code}/>
)`

export const GrowCode =
`import {Grow} from '@tsei/core'
const App =  => (
    <Grow />
)`

export const TreesCode =
`import {Card} from '@tsei/core'
const App =  => (
    <Trees content="Hook">
        <>1</>
        <>2</>
        <>3</>
    </Trees>
)
`
export const SplitCode =
`import {Card} from '@tsei/core'
export const SplitCode = (
        <Target>
            <div style={{width:"100%",height:"100%",background:"rgba(255,0,0,.1)"}}/>
            <div style={{width:"100%",height:"100%",background:"rgba(0,255,0,.1)"}}/>
            <div style={{width:"100%",height:"100%",background:"rgba(0,0,255,.1)"}}/>
        </Target>
)`
