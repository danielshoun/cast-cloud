import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
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

    function handleSubmit(e) {
        e.preventDefault();
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

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email
                <input
                    type='text'
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                />
            </label>
            <label>
                Username
                <input
                    type='text'
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    required
                />
            </label>
            <label>
                Password
                <input
                    type='password'
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    required
                />
            </label>
            <label>
                Confirm Password
                <input
                    type='password'
                    value={confirmPassword}
                    onChange={event => setConfirmPassword(event.target.value)}
                    required
                />
            </label>
            <button type='submit'>Sign Up</button>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
        </form>
    )
}