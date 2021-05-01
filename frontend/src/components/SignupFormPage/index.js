import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

export default function SignupFormPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    if(sessionUser) return (<Redirect to='/'/>)

    function handleSubmit(type) {
        if(type === 'demo') {
            return dispatch(sessionActions.login({ credential: 'demo-user', password: 'password' }))
                .catch(async (res) => {
                    const data = await res.json();
                    if(data && data.errors) setErrors(data.errors);
                })
        } else {
            if(password === confirmPassword) {
                setErrors([]);
                return dispatch(sessionActions.signup({ email, username, password }))
                    .catch(async (res) => {
                        const data = await res.json();
                        if(data && data.errors) setErrors(data.errors);
                    })
            }
            return setErrors(['Passwords do not match.'])
        }
    }

    return (
        <div className='signUpContainer'>
            <div className='formLogoContainer'>CastCloud</div>
            <form>
                <input
                    className='formInput'
                    type='text'
                    placeholder='Email'
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                />
                <input
                    className='formInput'
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={event => setUsername(event.target.value)}
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
                <input
                    className='formInput'
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={event => setConfirmPassword(event.target.value)}
                    required
                />
                <button className='formButton buttonPrimary' onClick={() => handleSubmit('normal')}>Sign Up</button>
                <button className='formButton buttonSecondary' onClick={() => handleSubmit('demo')}>Demo</button>
                <Link className='formLink' to='/login'>Already registered? Go to login.</Link>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
            </form>
        </div>
    )
}