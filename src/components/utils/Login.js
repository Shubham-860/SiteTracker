import React, {useContext, useState} from 'react';
import axios from 'axios';
import User from '../../context/user';
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom";

const Login = ({update}) => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    });
    const [user, setUser] = useContext(User);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setUserInfo({...userInfo, [e.target.name]: e.target.value});
    };
    if (user.login) {
        navigate('/SiteRegistration')
    }

    const onSubmitHandle = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:8081/login', userInfo)
            .then((response) => {
                if (response.data !== 'No records found') {
                    const userCredentials = {...response.data[0], login: true};
                    setUser(userCredentials);
                    Cookies.set('loginCredentials', JSON.stringify(userCredentials)); // Store login credentials in a cookie
                    update(userCredentials);
                    // console.log(userCredentials)
                    navigate('/SiteRegistration')
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div
            className="d-flex align-items-center"
            style={{minHeight: '100vh', backgroundColor: 'rgba(210,210,210,0.53)'}}
        >
            <form className={'container col-md-4 border border-2 p-5 rounded-4 shadow bg-white'}>
                <h2 className={'text-center'}>Log In</h2>
                <div className="mb-3">
                    <label>Email address</label>
                    <input
                        name={'email'}
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={userInfo.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        name={'password'}
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={userInfo.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-outline-info" onClick={onSubmitHandle}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
