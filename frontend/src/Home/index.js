import React from 'react'
import {MDBBtn} from 'mdbreact'

import Layout from '../components/Layout';

export default class Home extends React.Component {
    constructor () {
        super();
        this.state = {'isHome':true}
    }
    render () {
        return (
            <Layout>
                <MDBBtn color="black" href="/note">Note</MDBBtn>
                <MDBBtn color="black" href="/user">User</MDBBtn>
            </Layout>
        )
    }
}
