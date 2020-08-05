<h1 align="center">@tsei/core</h1>
<p align="center">🌌Fantastic <b>UI</b> in next tsei.jp</p>
<p align="center">
    <img alt="build passing" src="https://img.shields.io/badge/build-👌-green.svg"/>
    <img alt="types passing" src="https://img.shields.io/badge/types-👌-yellow.svg"/>
    <img alt="demos passing" src="https://img.shields.io/badge/demos-👌-red.svg"/>
    <br>
    <img alt="license MIT" src="https://img.shields.io/badge/license-MIT-green.svg"/>
    <img alt="npm package" src="https://img.shields.io/badge/npm_package-0.3.0-green.svg"/>
</p>

<hr>

# Table of Contents
- [Demo](#Demo)  
- [Install via npm](#install-via-npm)  
- [Available hook](#available-hook)  
- [Simple example](#simple-example)  

# Demo
- ~[TSEI.JP/home](https://tsei.jp/)~COMING SOON
- ~[TSEI.JP/note](https://tsei.jp/note)~COMING SOON

# Install via npm
- create your project - `create-react-app myproject`
- `cd myproject`
- `npm install -S @tsei/core`


#Available hook
hooks | what?  
:-----|:-----  
useGrid  | build responsive layouts of all shapes and sizes from [useGrid](https://github.com/tseijp/use-grid)
useUser  | basic function of account authentication using cookies
useNotes | manage data stored in Notes  
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
