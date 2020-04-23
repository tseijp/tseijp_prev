import React from 'react';
import {MDBInput, MDBBtn} from 'mdbreact'
import {withCookies} from 'react-cookie';
import Layout from './Layout'

class User extends React.Component {
    url = "http://127.0.0.1:8000/"
    state = {
        isSignIn : true,
        headers  : {'Content-Type':'application/json'},
        credentials : { username:'', password:'', email   :'', }
    }
    inputChange = (e) => {
        let cred = {...this.state.credentials}
        cred[e.target.name] = e.target.value;
        this.setState({credentials : cred})
    }
    signin = () => {
        const url = `${this.url}auth/`
        const body = JSON.stringify(this.state.credentials)
        fetch(url, {method:'POST', ...this.state.headers, body})
        .then(r=>r.json()).then(res=>{
            this.props.cookies.set('authtoken', res.token);
            window.location.href = "/note"
        })
        .catch(e=>console.log(e))
    }
    signup = () => {
        const url = `${this.url}api/users/`
        const headers = {'Content-Type':'application/json'}
        const body = JSON.stringify(this.state.credentials)/*
        fetch(url, {method:'POST', headers, body})
        .then(r=>r.json()).then(res=>{
            this.props.cookies.set('authtoken', res.token);
            window.location.href = "/note"
        })
        .catch(e=>console.log(e))*/
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
                    <form>
                        <h1 style={styles.Head}>
                            {s.isSignIn?"Sign in":"Sign up"}
                            <span style={styles.Span}>or</span>
                            <MDBBtn color="dark" style={styles.Btn}
                                onClick={()=>this.setState({isSignIn:!this.state.isSignIn})}>
                                {s.isSignIn?"signup":"signin"}</MDBBtn>
                            <MDBBtn color="dark" style={styles.Btn}
                                onClick={()=>{window.location.href = "/note"}}>
                                <i className="fas fa-home" /></MDBBtn>
                            </h1>
                        <div className="grey-text text-left" style={styles.Form}>
                            {!s.isSignIn && <MDBInput label="Type your email" icon="envelope"
                                group type="email" validate error="wrong" success="right"
                                name="email" onChange={this.inputChange}/> }
                            <MDBInput label="Type your username" icon="user"
                                group type="text" validate error="wrong" success="right"
                                name="username" onChange={this.inputChange}/>
                            <MDBInput label="Type your password" icon="lock"
                                group type="password" validate
                                name="password" onChange={this.inputChange}/>
                        </div>
                    </form>
                    <MDBBtn color="dark" style={styles.Button}
                        onClick={s.isSignIn?this.signin:this.signup}>
                        {s.isSignIn?"SIGNIN":"SIGNUP"}</MDBBtn>
                    <MDBBtn color="dark" style={styles.Btn}>OR</MDBBtn>
                    <MDBBtn color="dark" style={styles.Button}>Signup with Google</MDBBtn>
                </div>
            </Layout>
        )
    }
}
export default withCookies(User);
