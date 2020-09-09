import React from 'react'
import {Page} from '../src/types'
import {useNote, usePage, useUser} from '../src/hooks'
import '@testing-library/jest-dom/extend-expect'
import {render,fireEvent} from '@testing-library/react'

// ************************* 📅 For useNote 📅 ************************* //
const testFetcher = () => null
const TestNote = () => {
    const [note, set] = [[],0]//useNote("", ()=>null)
    return (
        <>
            {note && note.map(n=> {
                <div>{n}</div>
            })}
        </>
    )
}
describe('useNote', () => {
    test('base', async () => {
        const { getByText, findByText } = render(<TestNote />)
    })
})

// ************************* 👌 use-page 👌 ************************* //
type TestPage = {pathname:string}
const testPage:Partial<Page<TestPage>> = {
    protocol:"http:"   , portname:"3000", search:"",
    hostname:"localhost", pathname:({id})=>`/${id&&id+"/"}`, id:""}
const TestPage = () =>  {
    const [page, set] = usePage<TestPage>(testPage)
    return <button onClick={()=>set({id:2})}>{page.urls[0].href}</button>
}
describe('usePage', () => {
    test("base", async () => {
        const { getByRole, findByText } = render(<TestPage />)
        await findByText('http://localhost:3000/')
        fireEvent.click(getByRole('button'))
        await findByText('http://localhost:3000/2/')
    })
})
// ************************* 🙍‍♂️ For useUser 🙍 ************************* //

const testUserData = {username:"anonimous", authtoken:"*"}
const testUserFetcher = () => {}
const TestUser = () =>  {
    // const [page, setPage] = usePage<TestPage>(testPage)
    // const [note, setNote] = useNote(page.urls[1], testFetcher)
    // const [user, setUser] = useUser(page.urls[2], testSignin)
    return (
        <div>
        </div>
    )
}
