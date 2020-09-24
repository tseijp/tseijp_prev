<h1 align="center">@tsei/core</h1>
<p align="center">🌌Fantastic <b>UI</b> in next tsei.jp</p>
<p align="center">
    <img alt="build passing" src="https://img.shields.io/badge/build-👌-green.svg"/>
    <img alt="types passing" src="https://img.shields.io/badge/types-👌-yellow.svg"/>
    <img alt="demos passing" src="https://img.shields.io/badge/demos-👌-red.svg"/>
    <br>
    <img alt="license MIT" src="https://img.shields.io/badge/license-MIT-green.svg"/>
    <img alt="npm package" src="https://badge.fury.io/js/%40tsei%2Fcore.svg"/>
</p>

<hr>

# Table of Contents
- [Demo](#demo)  
- [Docs](#docs)
- [Install via npm](#install-via-npm)  
- [Available hook](#available-hook)  
- [Simple example](#simple-example)  

# Demo
- [TSEI.jp/home](https://tsei.jp/)
- [TSEI.jp/hook](https://tsei.jp/note)
- [TSEI.jp/mdmd](https://tsei.jp/mdmd)
- [TSEI.jp/note](https://tsei.jp/note)

# Docs
- [@tsei/core](https://tsei.jp/core/)
- [@tsei/mdmd](https://tsei.jp/mdmd/)
- [useGrid   ](https://tsei.jp/hook/use-grid/)

# Install via npm
- create your project - `create-react-app myproject`
- `cd myproject`
- `npm install -S @tsei/core`

#Available hook
hooks | what?  
:-----|:-----  
[useGrid](https://github.com/tseijp/use-grid) | build responsive layouts of all shapes and sizes
useNote | manage notes data and edit note
usePage | manage page transitions and restful api urls
useUser | basic function of account authentication using cookies


# Simple example
<p align="center">
    <a href="https://github.com/tseijp/tseijp/blob/master/core/src/containers/">
        <strong>CONTAINERS</strong></a>
    <a href="https://github.com/tseijp/tseijp/blob/master/core/src/components/Card.tsx">
        <img src="https://img.shields.io/badge/Card-black.svg"/></a>
    <a href="https://github.com/tseijp/tseijp/blob/master/core/src/components/Code.tsx">
        <img src="https://img.shields.io/badge/Code-black.svg"/></a>
    <a href="https://github.com/tseijp/tseijp/blob/master/core/src/components/Edit.tsx">
        <img src="https://img.shields.io/badge/Edit-black.svg"/></a>
    <a href="https://github.com/tseijp/tseijp/blob/master/core/src/components/Grow.tsx">
        <img src="https://img.shields.io/badge/Grow-black.svg"/></a>
</p>

```javascript
const App = () =>
    <>
        <Modal>
            <>hello🥰</>
            <>login🌚</>
        </Modal>
        <Trees>
            <>➊</>
            <>
                <>➋</>
                <>➋ - ➊</>
                <>➋ - ➋</>
            </>
        </Trees>
        <Notes>
            <>➊</>
            <>
                <>➋</>
                <>➋ - ➊</>
                <>➋ - ➋</>
            </>
        </Notes>
    </>
```

<hr>
<p align="center">
    <a href="https://github.com/tseijp/tseijp/blob/master/core/src/containers/">
        <strong>NAVIGATORS</strong></a>
    <a href="https://github.com/tseijp/tseijp/blob/master/core/src/components/Head.tsx">
        <img src="https://img.shields.io/badge/Head-black.svg"/></a>
    <a href="https://github.com/tseijp/tseijp/blob/master/core/src/components/Foot.tsx">
        <img src="https://img.shields.io/badge/Foot-black.svg"/></a>
    <a href="https://github.com/tseijp/tseijp/blob/master/core/src/components/Icon.tsx">
        <img src="https://img.shields.io/badge/Icon-black.svg"/></a>
</p>

```javascript
const App = () =>
    <>
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
        <Pills>
            <>
                <>o‍</>
                <>x</>
            </>
        </Pills>
    </>
```
