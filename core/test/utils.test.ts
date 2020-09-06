import {clamp,swap,defaultPage,joinPage,normPage,equalPathname,joinURL} from '../src/utils'
import {Page} from '../src/types'
//import { mocked } from 'ts-jest/utils'
//jest.mock('./utilsStore')
describe('*************** FOR BASIC ***************', () => {
    test('clamp', () => {
        expect(clamp( -1,0,1)).toBe(0);
        expect(clamp(0.2,0,1)).toBe(.2);
        expect(clamp(1.5,0,1)).toBe(1);
    });
    test('swap', () => {
        expect(swap([0,1,2,3,4],0,4)).toStrictEqual([1,2,3,4,0]);
        expect(swap([0,1,2,3,4],2,3)).toStrictEqual([0,1,3,2,4]);
        expect(swap([0,1,2,3,4],4,1)).toStrictEqual([0,4,1,2,3]);
    });
    const local = "http://localhost"
    test('equalPathname', () => {
        expect(equalPathname(local, local+"/")).toBe(true)
        expect(equalPathname(local, local+"/api")).toBe(false)
        expect(equalPathname(local+"/api", local+"/api/")).toBe(true)
        expect(equalPathname(local+"/api", local+"/api/v2")).toBe(false)
        expect(equalPathname(local+"?q=0", local+"/?q=1")).toBe(true)
        expect(equalPathname(local+"?q=0", local+"?q=1/")).toBe(true)
    })
})
describe('*************** FOR USEPAGES ***************', () => {
    describe('joinPage', () => {
        test('string'  , () => {
            expect(joinPage({...defaultPage,
                protocol:"http:"    , portname:"8000",
                hostname:"localhost", pathname:"/api/note/3/"
            })).toBe("http://localhost:8000/api/note/3/")
            expect(joinPage({...defaultPage,
                protocol:"https:"   , portname:"3000"    ,
                hostname:"localhost", pathname:"note/3/"
            })).toBe("https://localhost:3000/note/3/")
        })
        test('string[]', () => {
            expect(joinPage({...defaultPage,
                protocol:"http:"    , portname:["8000", "3000"],
                hostname:"localhost", pathname:["/api/note/","note"],
            })).toStrictEqual([
                "http://localhost:8000/api/note/",
                "http://localhost:3000/note"
            ])
            expect(joinPage({...defaultPage,
                protocol:"https:"   , portname:null,
                hostname:"tsei.jp"  , pathname:["api/note/3/","note/3"],
            })).toStrictEqual([
                "https://tsei.jp/api/note/3/",
                "https://tsei.jp/note/3"
            ])
        })
    })
    describe('normPage', () => {
        const pathname =  ({id}:any) =>
           [`/api/note/${id?id+'/':''}`,
                `/note/${id?id+'/':''}`,]
        const base = (i:number|null=null) : Page => ({
            ...defaultPage,
            isHome :({id}:any)=>!id, id:i?`${i}`:"",
            isLocal:true, search:"",
            hostname:"localhost", pathname,
            protocol:"http://"  , portname:["8000","3000"],
        })
        describe('base', () => {
            expect( normPage(base()) )
               .toStrictEqual({...base(), isHome:true,
                pathname:["/api/note/", "/note/"],
                urls:[new URL("http://localhost:8000/api/note/"),
                      new URL("http://localhost:3000/note/")]
            })
            expect( normPage(base(90)) )
              .toStrictEqual({...base(90), isHome:false,
                pathname:["/api/note/90/", "/note/90/"],
                urls:[new URL("http://localhost:8000/api/note/90/"),
                      new URL("http://localhost:3000/note/90/")]
            })
        })
    })
})
describe('*************** FOR JOIN URL ***************', () => {
    const host = 'http://localhost:3000'
    describe('joinURL', () => {
        test('basic', () => {
            expect(joinURL(`${host}/`,'note','3','/')).toBe(`${host}/note/3/`)
            expect(joinURL(host,'/note/','/tseijp/')).toBe(`${host}/note/tseijp/`)
        })
        test('none', () => {
            expect(joinURL(host,'note/','','/')).toBe(`${host}/note/`)
            expect(joinURL(host,'note','','/','')).toBe(`${host}/note/`)
        })
        test('escape', () => {
            expect(joinURL(host,'note/','?q=note')).toBe(`${host}/note?q=note`)
            expect(joinURL(host,'note/','#TOC')).toBe(`${host}/note#TOC`)
        })
    })
    /* NOT USING
    describe('normURL', () => {
        test('basic', () => {
            expect(normURL(`${host}/note`)).toBe(`${host}/note`)
            expect(normURL((p)=>`${p}/note`, {current:`${host}`})).toBe(`${host}/note`)
        })
        test('array', () => {
            expect(normURL([`${host}/`,'note','3','/'])).toBe(`${host}/note/3/`)
            expect(normURL([host,'/note/','/tseijp/'])).toBe(`${host}/note/tseijp/`)
        })
    })
    */
})
