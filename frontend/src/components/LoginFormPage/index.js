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
        <form onSubmit={handleSubmit}>
            <label>
                Username/Email
                <input
                    type='text'
                    value={credential}
                    onChange={event => setCredential(event.target.value)}
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
            <button type='submit'>Log In</button>
            <ul>
                {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
        </form>
    )
}