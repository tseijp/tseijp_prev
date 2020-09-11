import { useEffect, useCallback, useState, useRef } from 'react'
import { NoteNode, NoteFetcher, NoteConfig, URLType, BasicProps } from '../types'
import { equalPathname } from '../utils'
//import useSWR from 'swr'
//import { AxiosResponse } from 'axios'
export const useNote = (
    initURL:BasicProps<URLType|string>,
    initFetcher:NoteFetcher<NoteNode>,
    initNoteConfig:Partial<NoteConfig>={}
) : [ NoteNode, (
        url:((pre:NoteNode)=>URLType|string)|URLType|string,
        fetcher?:NoteFetcher<NoteNode>|null,
        config ?:Partial<NoteConfig>
    ) => void
] => {
    const urlRef     = useRef<URLType>()
    const fetcherRef = useRef(initFetcher)
    const isFetching = useRef<boolean>(false)
    const configRef  = useRef(initNoteConfig)
    const [note,set] = useState<NoteNode>(null) // TODO useSWR(urlRef.current,isFetching)
    //  ************************* 📋 SetNote 📋 *************************  //
    //  * setNote("/api/note", fetcher) => refresh note data from url
    //  * setNote(p=>p.next  , fetcher) => add note data from url
    //  ************************* ************** *************************  //
    const setNote = useCallback((
        updateURL,//:((pre:NoteNode)=>URLType)|URLType,
        updateFetcher=null,//UpdateNoteFetcher=null
        updateConfig ={}//:Partial<NoteConfig>={}
    ) : void => {
        // ********** FOR REF ********** //
        console.log('\tsetNote, update:',updateURL)
        if (isFetching.current)
            return
        isFetching.current = true
        if (typeof updateURL === "function")
            updateURL = updateURL(note)
        if (updateFetcher === null)
            updateFetcher = fetcherRef.current
        else
            fetcherRef.current = updateFetcher
        configRef.current = {...configRef.current, ...updateConfig}
        if (!updateURL || !updateFetcher)
            return void (isFetching.current = false)
        const preURL = urlRef.current
        if (typeof updateURL==="string")
            updateURL = new URL(updateURL)
        urlRef.current = updateURL
        // ********** FOR FETCHING ********** //
        updateFetcher(updateURL).then((res:any) => {
            console.log(`\t\t update fetting !!!`, res.results.map((p:any)=>p.id))
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
    //  ************************* 📋 useEffect 📋 *************************  //
    //  * setNote("/api/note", fetcher) => refresh note data from url
    //  * setNote(p=>p.next  , fetcher) => add note data from url
    //  ************************* ************** *************************  //
    useEffect(() => {
        if (typeof initURL==="function")initURL = initURL()
        if (typeof initURL==="string")  initURL = new URL(initURL)
        const preURL = urlRef.current
        urlRef.current = initURL
        if (equalPathname(preURL, urlRef.current))
            return
        isFetching.current = true
        fetcherRef.current(urlRef.current).then((res:any) => {
            console.log ('\t\tinit fetting !!!!', res.results.map((p:any)=>p.id))
            set(pre => res || pre)
            setTimeout(() => (isFetching.current = false), 1000)
        })
    }, [initURL])//[initURL])
    return [note, setNote]
}
