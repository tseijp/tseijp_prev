import { useCallback, useState, useRef } from 'react'
import {UseCookie, BasicAction} from '../types';
import Cookies from "js-cookie";
import {CookieAttributes} from "js-cookie";

/***
  * 😁 __useCookie__ - React Hook for Cookies based on js-cookie 🍪
  * 😲  - THIS CODE is fork of useCookie for Typescript and more 🍪
  * 🥰  - [MORE useCookie] (https://github.com/rrudol/useCookie) 🍪
 ***/
export type BasicProps <T=any> = (()=>T) | T
export type BasicState <T=any> = ((pre:T)=>T) | T
export type BasicAction<T=any> = (fn:BasicState<T>) => void
export type UseCookie<T=object|string> = (
 key : string,
 initValue ?: BasicProps<T>,
 options   ?:CookieAttributes|undefined
) => [ T, BasicAction<T> ]

export const useCookie :UseCookie<object|string> = (
        key, initValue='', options=undefined
    ) => {
    if (typeof initValue === 'function')
        initValue = initValue()
    const valueRef = useRef<object|string>(initValue||'');
    const [value, set] = useState(() => {
        return Cookies.get(key) || (()=>{
            Cookies.set(key, initValue, options);
            return initValue
        })();
    });
    const setValue:BasicAction<object|string> = useCallback((newValue) => {
        if (typeof newValue === 'function')
            newValue = newValue(valueRef.current);
        valueRef.current = newValue;
        set(newValue as any);
        Cookies.set(key, newValue, options);
    }, [key, set]);
    return [value, setValue];
}
