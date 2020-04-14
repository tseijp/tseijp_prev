import React from 'react';
//import Radium from 'radium';
import {MDBContainer} from 'mdbreact';

import Auxil from 'hoc/Auxil';
//const Layout = (props) => (
const Layout = (props) => {
    return(
        <Auxil>
            <div>toolbar sidedrawer backdrop</div>
            <main>
                <MDBContainer>
                {props.children}
                </MDBContainer>
            </main>
        </Auxil>
    )
};

export default Layout;
