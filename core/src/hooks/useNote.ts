import { useEffect, useCallback, useState, useRef } from 'react'
import { None, NoteNode, NoteFetcher, NoteConfig, URLType, BasicProps } from '../types'
import { equalPathname } from '../utils'
//import useSWR from 'swr'
//import { AxiosResponse } from 'axios'
export const useNote = (
    initURL:BasicProps<URLType|string>,
    initFetcher:NoteFetcher<NoteNode>,
    initNoteConfig:Partial<NoteConfig>={}
) : [ NoteNode, (
        updateUrl:((pre:NoteNode)=>None<URLType|string>)|None<URLType|string>,
        updateFetcher?:NoteFetcher<NoteNode>|null,
        updateConfig ?:Partial<NoteConfig>
    ) => void
] => {
    if (typeof initURL==="function")initURL = initURL()
    if (typeof initURL==="string")  initURL = new URL(initURL)
    const urlRef     = useRef<URLType>()
    const fetcherRef = useRef(initFetcher)
    const isFetching = useRef<boolean>(false)
    const configRef  = useRef(initNoteConfig)
    const [note,set] = useState<NoteNode>(null) // TODO useSWR(urlRef.current,isFetching)
    //  ************************* 📋 useEffect 📋 *************************  //
    //  * setNote("/api/note", fetcher) => refresh note data from url
    //  * setNote(p=>p.next  , fetcher) => add note data from url
    //  ************************* ************** *************************  //
    useEffect(() => {
        const preURL = urlRef.current
        urlRef.current = initURL as URLType
        if (equalPathname(preURL, urlRef.current))
            return
        isFetching.current = true
        fetcherRef.current(urlRef.current).then((res:any) => {
            //console.log ('\t\tinit fetting !!!!', res.results.map((p:any)=>p.id))
            set(pre => res || pre)
            setTimeout(() => void (isFetching.current = false), 1000)
        })
    }, [initURL])//[initURL])
    //  ************************* 📋 SetNote 📋 *************************  //
    //  * setNote("/api/note", fetcher) => refresh note data from url
    //  * setNote(p=>p.next  , fetcher) => add note data from url
    //  ************************* ************** *************************  //
    const setNote = useCallback((updateURL,updateFetcher=null,updateConfig={}) => {
        // ********** FOR REF ********** //
        if (isFetching.current)
            return
        isFetching.current = true
        if (typeof updateURL === "function")
            updateURL = updateURL(note)
        if (updateFetcher === null)
            updateFetcher  = fetcherRef.current
        fetcherRef.current = updateFetcher
        configRef.current  = {...configRef.current, ...updateConfig}
        if (!updateURL || !updateFetcher)
            return void (isFetching.current = false)
        const preURL = urlRef.current
        if (typeof updateURL==="string")
            updateURL = new URL(updateURL)
        urlRef.current = updateURL
        // ********** FOR FETCHING ********** //
        updateFetcher(updateURL).then((res:any) => {
            //console.log(`\t\t update fetting !!!`, res.results.map((p:any)=>p.id))
            setTimeout(() => (isFetching.current = false), 1000)
            return (res && res.results) && set(pre => {
                if (!equalPathname(preURL, urlRef.current))
                    return res
                const {onChange=null} = configRef.current
                const diff = pre
                  ? (pre.results||[]).filter((p:any) =>
                  ! (res.results||[]).find((r:any) => r.id===p.id)
                ) : []
                onChange && onChange()
                return {...res, results:[...diff, ...res.results]}
            })
        })
    }, [note])
    return [note, setNote]
}
