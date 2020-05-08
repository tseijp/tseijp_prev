import React from 'react'
import {MDBContainer, MDBBtn} from 'mdbreact'

import Layout from '../components/Layout';

export default class Home extends React.Component {
    constructor () {
        super();
        this.state = {'isHome':true}
    }
    render () {
        return (
            <Layout>
                <MDBContainer>
                    <h1>TSEI.jp (COMING SOON)</h1>
                    <MDBBtn color="black" href="/note">Note</MDBBtn>
                    <MDBBtn color="black" href="/user">User</MDBBtn>
                    <MDBBtn color="black" href="/mdmd">Mdmd</MDBBtn>
                </MDBContainer>
            </Layout>
        )
    }
}
