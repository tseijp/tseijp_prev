# React-atom


# React-three-atom
- https://threejs.org/examples/#webgl_loader_pdb
- https://threejs.org/examples/#css3d_molecules

## Get started
`npm i -S react-three-atom`

## Simple example
__methane__
```
<C>
  <H/><H/><H/><H/>
</C>
```


__benzene__
```
<Bond>
    <C><H/></C>
    <C><H/></C>
    <C><H/></C>
    <C><H/></C>
    <C><H/></C>
    <C><H/></C>
</Bond>
```

__phenol__
```
<Bond>
    <C><H/></C>
    <C><H/></C>
    <C><H/></C>
    <C><H/></C>
    <C><H/></C>
    <C>
        <O><H/></O>
    </C>
</Bond>
```
or
```
<Bond>
    <Pheny/>
    <C><OH/></C>
</Bond>
```

## More
```
import {Atom} from 'react-three-atom'
const = Cl =()=> Atom()
```
