import {clamp,swap,defaultPages,joinPages,normPages,joinURL} from '../src/utils'
import {Pages} from '../src/types'
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
})
describe('*************** FOR USEPAGES ***************', () => {
    describe('joinPages', () => {
        test('string', () => {
            expect(joinPages({...defaultPages,
                protocol:"http:"    , portname:"8000",
                hostname:"localhost", pathname:"/api/note/3/"
            })).toBe("http://localhost:8000/api/note/3/")
            expect(joinPages({...defaultPages,
                protocol:"https:"   , portname:"3000"    ,
                hostname:"localhost", pathname:"note/3/"
            })).toBe("https://localhost:3000/note/3/")
        })
        test('string[]', () => {
            expect(joinPages({...defaultPages,
                protocol:"http:"    , portname:["8000", "3000"],
                hostname:"localhost", pathname:["/api/note/","note"],
            })).toStrictEqual([
                "http://localhost:8000/api/note/",
                "http://localhost:3000/note"
            ])
            expect(joinPages({...defaultPages,
                protocol:"https:"   , portname:null,
                hostname:"tsei.jp"  , pathname:["api/note/3/","note/3"],
            })).toStrictEqual([
                "https://tsei.jp/api/note/3/",
                "https://tsei.jp/note/3"
            ])
        })
    })
    describe('normPages', () => {
        const base = (i:number|null=null):Pages => ({
            home:({id}:any)=>!id, id:i, search:"",
            protocol:"http://"  , portname:["8000","3000"],
            hostname:"localhost", pathname:({id}:any) =>
               [`/api/note/${id?id+'/':''}`,
                    `/note/${id?id+'/':''}`,]
        })
        describe('base', () => {
            expect( normPages({...base()}) )
               .toStrictEqual({...base(), home:true,
                pathname:["/api/note/", "/note/"],
                url:[new URL("http://localhost:8000/api/note/"),
                     new URL("http://localhost:3000/note/")]
            })
            expect( normPages({...base(90)}) )
               .toStrictEqual({...base(90), home:false,
                pathname:["/api/note/90/", "/note/90/"],
                url:[new URL("http://localhost:8000/api/note/90/"),
                     new URL("http://localhost:3000/note/90/")]
            })
        })
        const search =({c}:any)=>[c?`?c=${c}`:"", ""]
        describe('search', () => {
            expect( normPages({...base(),c:25,search}) )
             .toStrictEqual({...base(),c:25,search:[`?c=25`,""],home:true,
                pathname:["/api/note/", "/note/"],
                url:[new URL("http://localhost:8000/api/note?c=25"),
                     new URL("http://localhost:3000/note/")]
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
