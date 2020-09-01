import {clamp,swap,defaultPages,joinPages,normPages,joinURL,normURL} from '../src/utils'
//import { mocked } from 'ts-jest/utils'
//jest.mock('./utilsStore')
describe('FOR BASIC', () => {
    it('clamp', () => {
        expect(clamp( -1,0,1)).toBe(0);
        expect(clamp(0.2,0,1)).toBe(.2);
        expect(clamp(1.5,0,1)).toBe(1);
    });
    it('swap', () => {
        expect(swap([0,1,2,3,4],0,4)).toStrictEqual([1,2,3,4,0]);
        expect(swap([0,1,2,3,4],2,3)).toStrictEqual([0,1,3,2,4]);
        expect(swap([0,1,2,3,4],4,1)).toStrictEqual([0,4,1,2,3]);
    });
})
describe('FOR USEPAGES', () => {
    it('joinPages : string', () => {
        expect(joinPages({
            ...defaultPages,
            protocol:"http://", hostname:"localhost",
            portname:"8000", pathname:"/note/"
        })).toBe("http://localhost:8000/note/")
        expect(joinPages({
            ...defaultPages,
            protocol:"https://", hostname:"localhost",
            portname:"3000", pathname:"note/3/"
        })).toBe("https://localhost:3000/note/3/")
    })
    /*
    it('joinPages return string[]', () => {
        expect(joinPages({...defaultPages,protocol:'http://'})).toStrictEqual()
    })
    */

    /*
    it('normPages', () => {
        expect(normPages(pages, pages)).toStrictEqual({})
    })
    */
})
describe('FOR JOIN URL', () => {
    const host = 'http://localhost:3000'
    it('joinURL', () => {
        expect(joinURL(`${host}/`,'note','3','/')).toBe(`${host}/note/3/`)
        expect(joinURL(host,'note/','/tseijp/')).toBe(`${host}/note/tseijp/`)
    })
    it('normURL', () => {
        expect(normURL(`${host}/note`)).toBe(`${host}/note`)
        expect(normURL((p)=>`${p}/note`, {current:`${host}`})).toBe(`${host}/note`)
        expect(normURL([`${host}/`,'note','3','/'])).toBe(`${host}/note/3/`)
        expect(normURL([host,'note/','/tseijp/'])).toBe(`${host}/note/tseijp/`)
    })
})
