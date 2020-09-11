import {Page, PageConfig, URLType, UserConfig} from './types'

export const clamp = (x:number, min=0, max=1) :number  => (x<min)?min:(x>max)?max:x
export const swap=(arr:number[],ind:number,row:number) => {
    const ret = [...arr.slice(0, ind), ...arr.slice(ind+1, arr.length)]
    return [...ret.slice(0, row), ...arr.slice(ind, ind+1), ...ret.slice(row)]
}
export const equalPathname = (...urls:(URLType|string)[]) =>
    urls.map(u => typeof u==="string"? new URL(u) : u)
        .map(u => joinURL(u.pathname, "/"))
        .every((u, _, self) => u===self[0])

// ************************* 👌 use-page 👌 ************************* //
export const defaultPageConfig:PageConfig = {
    onChange:null,
}
export const defaultPage = {
    id      :window.location.pathname.split('/').filter(v=>v).find((_,i)=>i===1)||"",
    isHome  :window.location.pathname.split('/').filter(v=>v).length > 1,
    isLocal :window.location.hostname==="localhost",
    protocol:window.location.protocol||"",
    hostname:window.location.hostname||"",
    portname:window.location.port    ||"",
    pathname:window.location.pathname||"",
    search  :window.location.search  ||"",
    urls    :[new URL(window.location.href)],
}
export const joinPage = <T={}>(page:Page<T>):string|string[] => {
    const {protocol,hostname,portname,pathname="",search=""} = page;
    const arr = [protocol,hostname,portname,pathname,search]
    const getp =(port:any)=>port?`:${port}`:""
    const geti =(i=0,n:any)=>n instanceof Array?(i<n.length?n[i]:n[n.length-1]):n
    if ( arr.every(v=>typeof v==="string") )
        return joinURL(`${protocol}//${hostname}${getp(portname)}/`,pathname as any, search as any)
    const maxLength = arr.map(v=>v instanceof Array?v.length:1).reduce((a,b)=>a>b?a:b)
    return [...Array(maxLength)].map((_,i) =>
        joinURL( `${geti(i,protocol)}//${geti(i,hostname)
            }${getp(geti(i,portname))}/`,geti(i,pathname),geti(i,search) )
    ) as string[]
}
export const normPage = <T extends {}={}>(page:Page<T>) => {
    const state = {...page} as any//Page<T>
    Object.entries(state).sort(([_,val]) => typeof val==="function"?1:-1)
    .forEach(([key,val]:any) => (state[key]=typeof val==="function"?val(state):val))
    const urls = joinPage<T>(state as Page<T>)
    return {...state, urls:urls instanceof Array
      ? urls.map((u:any) => typeof u==="string" ? new URL(u) : u) as URLType[]
      : [typeof urls==="string" ? new URL(urls) : urls] as URLType[] } as Page<T>
}

// ************************* 🙍‍♂️ For useUser 🙍 ************************* //
export const defaultUserConfig:UserConfig = {
    keys:['username','authtoken'],
    user:null,
    onSign:null,
    onSignin:null,
    onSignout:null
}

// ************************* 🍡 join-url 🍡 ************************* //
// * This function is fork of join-url/urljoin
// * Code : https://github.com/jfromaniello/url-join/blob/master/lib/url-join.js
// ************************* *************** ************************* //
export function joinURL (...strArray:(string|number)[]) : string { // TODO : can use number
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
    strArray = strArray.filter(str=>str!=="")
    for (var i = 0; i < strArray.length; i++) {
        let str = strArray[i];
        if (typeof str === 'number')
            str = String(str)
        if (typeof str !== 'string')
            throw new TypeError(`${str} must be a string. Received ${typeof str}`);
        if (str === '')
            continue;
        if (i > 0)
            //eslint-disable-next-line
            str = str.replace(/^[\/]+/, '');
        if (i < strArray.length - 1)
            //eslint-disable-next-line
            str = str.replace(/[\/]+$/, '');
        else
            //eslint-disable-next-line
            str = str.replace(/[\/]+$/, '/');
        resultArray.push(str);
    }
    let str = (resultArray as string[]).join('/');
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');
    let parts = str.split('?');
    str = parts.shift() + (parts.length > 0 ? '?': '') + parts.join('&');
    return str;
}
/*
export function normURL (
    url: BasicProps<NoteURL> | BasicState<NoteURL>,
    ref: NoteURL
) : string {
    if (typeof url==="string")
        return url
    if (typeof url==="function")
        return ref ? url(ref) : (url as any)()
    if (url instanceof Array)
        return joinURL(...url)
    return ''
}
*/
