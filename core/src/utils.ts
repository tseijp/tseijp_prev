export const clamp = (x:number, min=0, max=1) :number  => (x<min)?min:(x>max)?max:x

export const swap=(arr:number[],ind:number,row:number) => {
    const ret = [...arr.slice(0, ind), ...arr.slice(ind+1, arr.length)]
    return [...ret.slice(0, row), ...arr.slice(ind, ind+1), ...ret.slice(row)]
}
// ************************* 🍡 join-url 🍡 ************************* //
// * This function is fork of join-url/urljoin
// * Code : https://github.com/jfromaniello/url-join/blob/master/lib/url-join.js
// ************************* *************** ************************* //
/*export const joinURL = (url:string[]) : string =>
    Array.prototype.concat.apply([],
        url.map(u=>u.match("http")?u:u.split('/').filter(v=>v))
    ).join('/')+"/"*/
export function normURL (...strArray:string[]) {
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
