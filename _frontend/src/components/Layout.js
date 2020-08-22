import React from 'react';
import Radium from 'radium';
import {MDBContainer} from 'mdbreact';
import Side  from '../components/Side';
import Trans from '../components/Trans';
//const Layout = (props) => (
class Layout extends React.Component {
    render() {
        const p = this.props;
        const media =d=>'@media '+Object.entries(d).map(v=>`(${v[0]}-width:${v[1]}px)`).join(' and ')
        const styles = {
            container:{
                [media({        max:576})]:{margin:"50px 5px 50px 5px",},
                [media({min:576,max:768})]:{margin:"50px 50px 50px 50px",},
                [media({min:768        })]:{margin:"75px 75px 75px 75px",},},
        };
        return(
            <>
                <Side isAuth={p.isAuth}/>
                <Trans toJa={this.props.toJa} toEn={this.props.toEn}/>
                <main style={p.isMargin?styles.container:{}}>
                    <MDBContainer>
                    {this.props.children}
                    </MDBContainer>
                </main>
            </>
        )
    }
};

export default Radium(Layout);
