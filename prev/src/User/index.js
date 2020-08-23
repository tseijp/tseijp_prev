import axios from 'axios';
import React from 'react';
import {MDBInput, MDBBtn, MDBAlert} from 'mdbreact'
import {withCookies} from 'react-cookie';
import Layout from '../components/Layout';

class User extends React.Component {
    url = window.location.origin.match('localhost')?"http://localhost:8000/":"https://tsei.jp/"
    constructor (props) {
        super()
        const username = props.cookies.get('username');
        const authtoken = props.cookies.get('authtoken');
        const isAuth = authtoken? true:false;
        this.state = {
            isAuth, isSignIn:true, isAlert:false,
            headers  : {'Content-Type':'application/json'},
            credentials : { username:username||'', password:'', email   :'', }
        }
    }
    inputChange = (e) => {
        let cred = {...this.state.credentials}
        cred[e.target.name] = e.target.value;
        this.setState({credentials : cred})
    }
    signout = () => {
        this.props.cookies.remove('authtoken', {path:"/"});
        window.location.href = "/note"
    }
    signin = () => {
        const url = this.url + (this.state.isSignIn?"auth/":"api/user/")
        const headers = this.state.headers
        axios.post(url, this.state.credentials, {headers}).then(res=>{
            if ((res.status===200||res.status===201) && res.data.token){
                this.props.cookies.set('authtoken', res.data.token, {path:"/"});
                this.props.cookies.set('username' , this.state.credentials.username, {path:"/"});
                window.location.href = "/note"
            }//console.log(res);
        }).catch(e=>{
            window.location.href = "/user"
            this.setState({isAlert:true});
        })
    }
    render () {
        const styles = {
            Login :{margin:"auto auto", padding:"50px 50px", textAlign:"center",
                    boxShadow:"0 10px 15px rgba(0,0,0,0.5)", },
            Form:{width:"75%", margin:"auto auto"},
            Head:{fontSize:"50px"},
            Span:{fontSize:"25px", margin:"auto 25px"},
            //Para:{fontSize:"50px", margin:"25px auto", textAlign:"center"},
            Btn:{borderRadius:"30px", padding:"15px 16px"},
            Button:{width:"100%", margin:"15px auto"},
        }
        const s = this.state;
        return (
            <Layout>
                <div style={styles.Login}>
                {!s.isAuth &&
                    <form>
                        <h1 style={styles.Head}>
                            {s.isSignIn?"Sign in":"Sign up"}
                            <span style={styles.Span}>or</span>
                            <MDBBtn color="dark" style={styles.Btn}
                                onClick={()=>this.setState({isSignIn:!this.state.isSignIn})}>
                                {s.isSignIn?"signup":"signin"}</MDBBtn>
                            <MDBBtn color="dark" style={styles.Btn}
                                onClick={()=>{window.location.href = "/"}}>
                                <i className="fas fa-home" /></MDBBtn>
                            <MDBBtn color="dark" style={styles.Btn}
                                onClick={()=>{window.location.href = "/note"}}>
                                <i className="fas fa-sticky-note" /></MDBBtn>
                            </h1>
                        <div className="grey-text text-left" style={styles.Form}>
                            {!s.isSignIn && <MDBInput label="Type your email" icon="envelope"
                                group type="email" validate error="wrong" success="right"
                                name="email" onChange={this.inputChange}/> }
                            <MDBInput label="Type your username" icon="user" value={s.credentials.username}
                                group type="text" validate error="wrong" success="right"
                                name="username" onChange={this.inputChange}/>
                            <MDBInput label="Type your password" icon="lock" value={s.credentials.password}
                                group type="password" validate
                                name="password" onChange={this.inputChange}
                                autoComplete="on" />
                        </div>
                        {s.isAlert && <MDBAlert color="danger">Bad Request</MDBAlert>}
                        {!s.isAlert && <MDBBtn color="dark" style={styles.Button}
                            onClick={this.signin}>
                            {s.isSignIn?"SIGNIN":"SIGNUP"}</MDBBtn>}
                        <MDBBtn color="dark" style={styles.Btn}>OR</MDBBtn>
                        <MDBBtn color="dark" style={styles.Button}>Signup with Google</MDBBtn>
                    </form>
                }{s.isAuth &&
                    <MDBBtn color="danger" onClick={this.signout}>Logout</MDBBtn>
                }
                </div>
            </Layout>
        )
    }
}
export default withCookies(User);