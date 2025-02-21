import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { useState } from 'react';
import background from '../../assets/background.jpg';
import { auth } from '../../Components/firebaseConfig'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Cookies from 'js-cookie';

const LoginForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
  

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const handleTermsChange = (e) => {
        setAgreeTerms(e.target.checked);
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                if (email === 'usersaffairs@gmail.com' && password === 'AI12345678') {
                    navigate('/admin');
                    alert("Admin Logged in Successfully");
                }
                 else {
                    const userCredential = await auth.signInWithEmailAndPassword(email, password);
                    login({ name: userCredential.user.displayName || email, email });
                    alert("Logged in Successfully");
                    navigate('/');
                }
            } else {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                await userCredential.user.updateProfile({ displayName: name });
                login({ name, email });
                alert("Account Created Successfully");
                navigate('/');
            }
        } catch (error) {
            if (isLogin) {
                if (error.code === 'auth/user-not-found') {
                    alert('No user found with this email.');
                } else if (error.code === 'auth/wrong-password') {
                    alert('Incorrect password.');
                } else {
                    alert(error.message);
                }
            } else {
                alert(error.message);
            }
        }
    };

    const handleReset = () => {
        navigate("/reset");
    }

    return (
        <div className='loginpage'>
            <img src={background} className='background fade-in' alt="" />
            <div className='wrapper'>
                {isLogin ? (
                    <form onSubmit={submit}>
                        <h1>Log In</h1>
                        <div className="input-box">
                            <input
                                type="email"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <MdOutlineEmail className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <FaLock className='icon' />
                        </div>
                        <div className="remember-forgot">
                           
                            <a href="#" onClick={handleReset}>Forgot password?</a>
                        </div>
                        <button type='submit'>Login</button>
                        <div className="register-link">
                            <p>Don't have an account? <a href="#" onClick={toggleForm}>Register</a></p>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={submit}>
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                value={name}
                                placeholder='Username'
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <FaUser className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                value={email}
                                placeholder='Email'
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <MdOutlineEmail className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                value={password}
                                placeholder='Password'
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <FaLock className='icon' />
                        </div>
                        <div className="remember-forgot">
                            <label><input type="checkbox" onChange={handleTermsChange}/>I agree to the terms & conditions</label>
                        </div>
                        {agreeTerms && ( 
                            <button type='submit'>Register</button>
                        )}
                        <div className="register-link">
                            <p>Already have an account? <a href="#" onClick={toggleForm}>Log In</a></p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default LoginForm;