import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import {signin, authenticate, isAuthenticated} from '../auth'

const Signin = () => {
    const [values, setValues] = useState({
        email: 'paulo@gmail.com',
        password: 'Password1',
        error: '',
        loading: false,
        redirectToReferrer: false
    });

    const {email, password, loading, error, redirectToReferrer} = values;
    const {user} = isAuthenticated()

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value});
    }

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({...values, error: false, loading: true})
        signin({email, password})
        .then(data => {
            if(data.error) {
                setValues({...values, error: data.error, loading: false})
            }else {
                authenticate(data, () => {
                    setValues({
                        ...values,
                        redirectToReferrer: true
                    })
                })
            }
        });
    }

    const signInForm = () => (
        <form>
            <div className="form-group">
                <label className="tex-muted">Email</label>
                <input onChange={handleChange('email')} type="email" className="form-control" value={email}/>
            </div>
            <div className="form-group">
                <label className="tex-muted">Password</label>
                <input onChange={handleChange('password')} type="password" className="form-control" value={password}/>
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
    );

    const showLoading = () => (
        loading && (
            <div className="alert alert-info">
                <h2>Loading...</h2>
            </div>
        )
    )

    const redirectUser = () => {
        if(redirectToReferrer){
            if(user && user.role === 1){
                return <Redirect to="/admin/dashboard"/>
            }else {
                return <Redirect to="/user/dashboard"/>
            }
        }
        if(isAuthenticated()) {
            return <Redirect to="/"/>
        }
    }

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? "" : 'none'}}>
            {error}
        </div>
    )

    return (
        <Layout title="Signin Page" description="Signin into My Store" className="container col-md-8 offset-md-2">
            {showLoading()}
            {showError()}
            {signInForm()}
            {redirectUser()}
        </Layout>
    );
}


export default Signin;