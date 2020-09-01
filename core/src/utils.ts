import {NoteURL, Pages, BasicProps, BasicState} from './types'

export const clamp = (x:number, min=0, max=1) :number  => (x<min)?min:(x>max)?max:x
export const swap=(arr:number[],ind:number,row:number) => {
    const ret = [...arr.slice(0, ind), ...arr.slice(ind+1, arr.length)]
    return [...ret.slice(0, row), ...arr.slice(ind, ind+1), ...ret.slice(row)]
}

// ************************* 👌 use-pages 👌 ************************* //
export const defaultPages:Pages = {
    protocol:window.location.protocol||null,
    hostname:window.location.hostname||null,
    portname:window.location.port    ||null,
    pathname:window.location.pathname||null,
}
export const joinPages = (pages:Pages):string|string[]|null => {
    const {protocol,hostname,portname,pathname} = pages;
    const arr = [protocol,hostname,portname,pathname]
    const getp =(port:any)=>port?`:${port}`:""
    const geti =(i=0,n:any)=>n instanceof Array?(i<n.length?n[i]:n[n.length-1]):n
    if ( arr.every(v=>typeof v==="string") )
        return joinURL(`${protocol}//${hostname}${getp(portname)}/`,pathname as string)
    const maxLength = arr.map(v=>v instanceof Array?v.length:1).reduce((a,b)=>a>b?a:b)
    return [...Array(maxLength)].map((_,i) =>
        joinURL( `${geti(i,protocol)}//${geti(i,hostname)
            }${getp(geti(i,portname))}/`,geti(i,pathname) )
    ) as string[]
}
export const normPages = (pages:Pages|null=null) => {
    const state = {...(pages||defaultPages)} as Pages
    Object.entries(state).sort(([_,val]) => typeof val==="function"?1:-1)
    .forEach(([key,val]:any) => (state[key]=typeof val==="function"?val(state):val))
    state["url"] = joinPages(state)
    return state
}

// ************************* 🍡 join-url 🍡 ************************* //
// * This function is fork of join-url/urljoin
// * Code : https://github.com/jfromaniello/url-join/blob/master/lib/url-join.js
// ************************* *************** ************************* //
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
            throw new TypeError('url must be a string. Received ' + component);
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
