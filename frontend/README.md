<h1 align="center">React Markdown with Material Design</h1>
<p align="center"><b>Markdown</b> for Fantastic UI Component, Grid System, and many more.</>

<p align="center">
    <img alt="build passing" src="https://img.shields.io/badge/build-👌-green.svg"/>
    <img alt="types passing" src="https://img.shields.io/badge/types-👌-yellow.svg"/>
    <img alt="demos passing" src="https://img.shields.io/badge/demos-‍👌-red.svg"/>
    <img alt="license MIT" src="https://img.shields.io/badge/license-MIT-green.svg"/>
    <img alt="npm package" src="https://img.shields.io/badge/npm_package-0.2.1-green.svg"/>
</p>

<hr>

# Table of Contents
- [Demo](#Demo)  
- [Quick started](#quick-started)  
- [Simple example](#simple-example)  
- [Available hooks](#available-hooks)  
- [Install via npm](#install-via-npm)  

# Demo
- ~[TSEI.JP/home](https://tsei.jp/)~COMING SOON
- ~[TSEI.JP/hook](https://tsei.jp/hook)~COMING SOON
- ~[TSEI.JP/note](https://tsei.jp/note)~COMING SOON

# Simple example

__containers__

```typescript
const App = () => <>
    <Sides>
        <>Home</>
        <>Hook</>
        <>Note</>
    </Sides>
    <Trans>
        <>JA</>
        <>🌛</>
        <>👶</>
    </Trans>
</>
```

<hr>

__containers__

```typescript
const App = () => <>
    <Modal>
        <>hello🥰</>
        <>login🌚</>
    </Modal>
    <Notes>
        <>notes📒</>
        <>
            <>card➊</>
            <>card➋</>
        </>
    </Notes>
    <Pills>
        <>
            <>o‍</>
            <>x</>
        </>
    </Pills>
<>
```

#Available hooks
hooks | what?  
:-----|:-----  
useGrid  | build responsive layouts of all shapes and sizes
useNotes | manage data stored in Notes  

# Install via npm
- create your project - `create-react-app myproject`
- `cd myproject`
- `npm install -S @tsei/core`
