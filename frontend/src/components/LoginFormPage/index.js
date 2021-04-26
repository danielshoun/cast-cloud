import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './LoginForm.css';

export default function LoginFormPage() {
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    if(sessionUser) return (<Redirect to='/'/>)

    function handleSubmit(e) {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .catch(async (res) => {
                const data = await res.json();
                if(data && data.errors) setErrors(data.errors);
            })
    }

    return (
        <div className='logInContainer'>
            <div className='formLogoContainer'>CastCloud</div>
            <form onSubmit={handleSubmit}>
                <input
                    className='formInput'
                    type='text'
                    placeholder='Username'
                    value={credential}
                    onChange={event => setCredential(event.target.value)}
                    required
                />
                <input
                    className='formInput'
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    required
                />
                <button className='formButton buttonPrimary' type='submit'>Log In</button>
                <button className='formButton buttonSecondary'>Demo</button>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
            </form>
        </div>
    )
}