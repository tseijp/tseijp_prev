import React, {useState, useEffect, useMemo} from 'react';
import {MDBBtn, MDBIcon} from 'mdbreact';
//import PropTypes from 'prop-types';

const Pill = (props) => {
    const {className,color,children, rate, open, } = props;
    const [xs, setxs] = useState(window.matchMedia("(                    max-width:576px)").matches);
    const [md, setmd] = useState(window.matchMedia("(min-width:576px and max-width:768px)").matches);
    const [lg, setlg] = useState(window.matchMedia("(min-width:768px)"                    ).matches);
    const size = useMemo(()=>{
        if(props.xs&&(xs||(!md&&!lg)))
            return props.xs;
        if (props.md&&(md||(!xs&&!lg)))
            return props.md;
        if (props.lg&&(lg&&(!xs&&!md)))
            return props.lg;
        return props.size;
    }, [xs,md,lg,props.xs,props.md,props.lg,props.size]);
    const getarr =e=>e?(e instanceof Array?e:[e]):[]
    const [isOpen, setIsOpen] = useState(false)
    const dis = (props.dis||props.d)*rate;
    const rad = props.isOpen?(props.rad||props.r)*rate:0
    const pos = props.pos||{x:props.x, y:props.y, theta:0}
    const depth = props.depth + 1;
    useEffect(()=>{
        window.matchMedia("(                    max-width:576px)").addListener(e=>setxs(e.matches));
        window.matchMedia("(min-width:576px and max-width:768px)").addListener(e=>setmd(e.matches));
        window.matchMedia("(min-width:768px                    )").addListener(e=>setlg(e.matches));
    },[])
    useEffect(()=>{
        if(props.isOpen===false)
            setIsOpen(false)
    },[props.isOpen])
    const childrenPos = useMemo(()=>{
        const length = children instanceof Array?children.length:1
        if (!isOpen)
            return [...Array(length)].fill(pos);
        return [...Array(length)].map((v,i)=>{
            const theta = (2*i+1)*Math.PI/(4*length) + pos.theta/4;
            const posX = pos.x + rate*dis*Math.cos(theta);
            const posY = pos.y + rate*dis*Math.sin(theta);
            return {x:posX, y:posY, theta}
        })
    },[isOpen, children, pos, rate, dis]);
    const style = useMemo(()=>({
        fontSize:`${rad*size}px`,borderRadius:`${rad*2*size}px`, width:`${2*rad*size}px`,height:`${2*rad*size}px`,
        transition:"0.75s", textAlign:"center", padding:"0 0",position:"fixed",
        bottom:`${pos.x*size}px`, left:`${pos.y*size}px`, ...props.style, zIndex:100-depth+""
    }),[depth, pos, rad, size, props.style]);
    const {onClick,onDoubleClick} = props;
    const iconstate = props.fab?{fab:true,icon:props.fab}:{icon:props.icon}
    const btntoggle = {[open]:()=>setIsOpen(!isOpen)}
    const btnstate = {onClick, onDoubleClick, ...btntoggle, className, color, style,};
    //console.log(`depth:${depth} bottom:${pos.x}px left:${pos.y}px`);
    return (
        <>
            <MDBBtn {...btnstate}><MDBIcon {...iconstate}/></MDBBtn>
            {props.children && getarr(props.children).map((child,i)=>
                <Pill key={i} {...{...child.props,pos:childrenPos[i],dis,rate,rad,size,open,depth,isOpen}}/>
            )}
        </>
    )
}
Pill.defaultProps = {
    color:"elegant",
    className:"",
    style:{},
    open:"onMouseEnter",
    isOpen:true,
    icon:"",
    /***value***/
    depth:0,
    size:50,
    rate:0.75,
    /***for system***/
    rad:null,
    dis:null,
    pos:null,
    /***init***/
    d  :6,
    x  :0.25,
    y  :0.25,
    r  :1,
    xs :25,
    md :50,
}

export default Pill;
