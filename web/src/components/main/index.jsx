import { useState, useContext, useEffect } from "react";
import { GlobalContext } from '../../context/context';
import axios from 'axios';
import Signup from "../signup";
import Login from "../login";
import { Routes, Route, Link, Navigate } from "react-router-dom";


import Home from "../home";
import About from "../about";
import Gallery from "../gallery";



let baseURL = '';
if (window.location.href.split(':')[0] === 'http') {
    baseURL = 'http://localhost:5001'
};

const Main = () => {


    let { state, dispatch } = useContext(GlobalContext);

    useEffect(() => {

        const getProfile = async () => {

            try {
                let res = await axios.get(`${baseURL}/profile`, {
                    user: state.user,
                    isAdmin: state.isAdmin
                }, {
                    withCredentials: true
                })

                console.log("res: ", res);

                dispatch({
                    type: 'USER_LOGIN'
                })

                dispatch({
                    type: 'SET_ADMIN',
                    payload: res.data.isAdmin
                });

                dispatch({
                    type: 'SET_USER',
                    payload: res.data.userProfile
                });

            } catch (error) {

                console.log("axios error: ", error);

                dispatch({
                    type: 'USER_LOGOUT'
                })
            }
        }
        getProfile();

    }, [])


    return (
        <div className="page">
            <div className="header">
                <h1>Posting App</h1>
                {
                    (state?.isLogin) ?
                        <nav>
                            <ul>
                                <li><Link to={`/`}>Home</Link></li>
                                <li><Link to={`/about`}>About</Link></li>
                                <li><Link to={`/gallery`}>Gallery</Link></li>
                                <li
                                    onClick={() => {
                                        axios.post(`${baseURL}/logout`)
                                            .then((res) => {
                                                console.log('logout respone ===>', res);
                                                dispatch({
                                                    type: 'USER_LOGOUT',
                                                    payload: null
                                                });
                                            })
                                            .catch((err) => {
                                                console.log('logout error ===>', err);
                                            })
                                    }}>
                                    <Link to={`/`}>Logout</Link></li>
                            </ul>
                        </nav>
                        :
                        <nav>
                            <ul>

                                <li>
                                    <Link to={`/signup`}>Signup</Link></li>

                                <li>
                                    <Link to={`/`}>Already have an account</Link></li>

                            </ul>

                        </nav>
                }
            </div>

            {
                (state?.isLogin) ?

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="*" element={<Navigate to={`/`} replace={true} />} />
                    </Routes>

                    :


                    <Routes>

                        <Route path="/signup" element={<Signup />} />
                        <Route path="/" element={<Login />} />
                        <Route path="*" element={<Navigate to={`/`} replace={true} />} />

                    </Routes>



            }

        </div>
    );

    // return (
    //     <div>
    //         <Signup />
    //         <Login />
    //     </div>
    // )
}


















// const Main = () => {

//     const [isLogin, setIsLogin] = useState(false);
//     const [isSignup, setIsSignup] = useState(false);
//     const [loginEmail, setLoginEmail] = useState('');
//     const [loginPassword, setLoginPassword] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastname] = useState('');
//     const [signupPassword, setSignupPassword] = useState('');
//     const [signupEmail, setSignupEmail] = useState('');

//     const loginHandler = (e) => {
//         e.preventDefault();

//         axios.post(`${baseURL}/login`, {
//             email: loginEmail,
//             password: loginPassword
//         })
//             .then((res) => {
//                 console.log('response ===>', res);
//                 setIsLogin(true);
//             })
//             .catch((err) => {
//                 console.log('error ===>', err);
//             })
//     };


//     const signupHandler = (e) => {
//         e.preventDefault();

//         axios.post(`${baseURL}/signup`, {
//             firstName: firstName,
//             lastName: lastName,
//             email: signupEmail,
//             password: signupPassword
//         })
//             .then((res) => {
//                 console.log('response ===>', res);
//                 console.log('Signup successfull');
//                 setIsSignup(false);
//                 setIsLogin(false);
//             })
//             .catch((err) => {
//                 console.log('error ===>', err);
//             })
//     };




//     return (
//         <div className="Main">

//             {
//                 (isSignup) ?
//                     <div className="signup">
//                         <h1>Signup</h1>
//                         <form action="" onSubmit={signupHandler}>

//                             <input
//                                 type="text"
//                                 name="firstName"
//                                 required
//                                 placeholder="Enter your First name"
//                                 onChange={(e) => {
//                                     setFirstName(e.target.value);
//                                 }}
//                             />


//                             <input
//                                 type="text"
//                                 name="lastName"
//                                 required
//                                 placeholder="Enter your last name"
//                                 onChange={(e) => {
//                                     setLastname(e.target.value);
//                                 }}
//                             />

//                             <input
//                                 type="email"
//                                 name="email"
//                                 required placeholder="Enter your Email"
//                                 onChange={(e) => {
//                                     setSignupEmail(e.target.value);
//                                 }}
//                             />

//                             <input
//                                 type="password"
//                                 name="password"
//                                 required
//                                 placeholder="Enter your password"
//                                 onChange={(e) => {
//                                     setSignupPassword(e.target.value);
//                                 }}
//                             />

//                             <button type="submit">Signup</button>

//                         </form>
//                         <p> Already have an account</p>

//                         <button
//                             onClick={() => {
//                                 setIsSignup(false);
//                                 setIsLogin(false);
//                             }}>Login</button>

//                     </div>

//                     :

//                     (isLogin) ?
//                         <h1>This is home</h1>
//                         :
//                         <div className="login">
//                             <h1>Login</h1>
//                             <form action="" onSubmit={loginHandler}>
//                                 <input
//                                     type="email"
//                                     required placeholder="Enter your Email"
//                                     onChange={(e) => {
//                                         setLoginEmail(e.target.value);
//                                     }}
//                                 />

//                                 <input
//                                     type="password"
//                                     required
//                                     placeholder="Enter your password"
//                                     onChange={(e) => {
//                                         setLoginPassword(e.target.value);
//                                     }}
//                                 />


//                                 <button type="submit">Login</button>

//                             </form>

//                             <p> Create an account</p>

//                             <button
//                                 onClick={() => {
//                                     setIsSignup(true);
//                                 }}>Signup</button>

//                         </div>


//             }

//         </div>
//     )
// };



export default Main; 