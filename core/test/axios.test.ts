//import axios from 'axios'
import {fetcher, //signin
} from "../docs/utils"

describe('*************** FETCHER ***************', () => {
    const host = "http://localhost:8000/note/"
    test('~/note/', async () => {
        const res = await fetcher("")
        expect(res.previous).toBe(null)
        expect(res.next).toBe(`${host}?cursor=*`)
    })
})
