import {NoteURL, Pages, BasicProps, BasicState} from './types'

export const clamp = (
    x:number, min=0, max=1
) :number  => (x<min)?min:(x>max)?max:x

export const swap=(arr:number[],ind:number,row:number) => {
    const ret = [...arr.slice(0, ind), ...arr.slice(ind+1, arr.length)]
    return [...ret.slice(0, row), ...arr.slice(ind, ind+1), ...ret.slice(row)]
}

// ************************* 👌 use-pages 👌 ************************* //
// ************************* *************** ************************* //
export const defaultPages:Pages = {
    home    :false,
    auth    :false,
    protocol:window.location.protocol||null,
    hostname:window.location.hostname||null,
    portname:window.location.port    ||null,
    pathname:window.location.pathname||null,
}
export const joinPagesURL = (
    {protocol,hostname,portname,pathname}:Pages
):string|string[] => {
    if ( [hostname,portname,pathname].every(v=>typeof v==="string") )
        return joinURL(`${protocol}//${hostname}:${portname}/`,pathname as string,"/")
    const maxLength = [protocol,hostname,portname,pathname]
        .map(v=>v instanceof Array?v.length:1).reduce((a,b)=>a>b?a:b)
    const geti =(i=0,n:any)=>n instanceof Array?(i>n.length?n[n.length-1]:n[i]):n
    return [...Array(maxLength)].map((_,i) =>
        joinURL(`${geti(i,protocol)}//${(geti(i,hostname))}:${geti(i,portname)}/`,geti(i,pathname),"/")
    ) as string[]
}
export const normPages = (init:Pages, prev:Pages|null=null) => {
    const state = {...(prev||defaultPages), ...init}
    const fns = Object.entries(init).map(([key,val])=>{
        if (typeof val==="function")
            return [key, val]
        state[key] = val
        return null
    })
    fns.filter(v=>v).forEach( ([key,val]:any) => (state[key]=val(state)) )
    state["url"] = joinPagesURL(state)
    return state
}
// ************************* 🍡 join-url 🍡 ************************* //
// * This function is fork of join-url/urljoin
// * Code : https://github.com/jfromaniello/url-join/blob/master/lib/url-join.js
// ************************* *************** ************************* //
/*export const joinURL = (url:string[]) : string =>
    Array.prototype.concat.apply([],
        url.map(u=>u.match("http")?u:u.split('/').filter(v=>v))
    ).join('/')+"/"*/
export function normURL (
    url: BasicProps<NoteURL> | BasicState<NoteURL>,
    ref:{current:string|null}={current:null}
) : string {
    if (typeof url==="string")
        return url
    if (typeof url==="function")
        return ref.current ? url(ref.current) : (url as any)()
    if (url instanceof Array)
        return joinURL(...url)
    return ''
}

export function joinURL (...strArray:string[]) : string {
    var resultArray = [];
    if (strArray.length === 0)
        return ''
    if (typeof strArray[0] !== 'string')
        throw new TypeError('Url must be a string. Received ' + strArray[0]);
    if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1)
        strArray[0] = strArray.shift() + strArray[0];
    if (strArray[0].match(/^file:\/\/\//))
        strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
    else
        strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
    for (var i = 0; i < strArray.length; i++) {
        var component = strArray[i];
        if (typeof component === 'number')
            component = String(component)
        if (typeof component !== 'string')
            throw new TypeError('Url must be a string. Received ' + component);
        if (component === '')
            continue;
        if (i > 0)
            //eslint-disable-next-line
            component = component.replace(/^[\/]+/, '');
        if (i < strArray.length - 1)
            //eslint-disable-next-line
            component = component.replace(/[\/]+$/, '');
        else
            //eslint-disable-next-line
            component = component.replace(/[\/]+$/, '/');
        resultArray.push(component);
    }
    var str = resultArray.join('/');
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');
    var parts = str.split('?');
    str = parts.shift() + (parts.length > 0 ? '?': '') + parts.join('&');
    return str;
}
