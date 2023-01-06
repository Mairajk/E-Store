import { useState, useContext, useEffect } from "react";
import { GlobalContext } from '../../context/context';
import axios from 'axios';
import Signup from "../signup";
import Login from "../login";
import { Routes, Route, Link, Navigate } from "react-router-dom";


import Home from "../home";
import About from "../about";
import Gallery from "../gallery";

//============================================================================
import * as React from 'react';
import { styled } from '@mui/system';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
//============================================================================

///================ Styling ===================================


const blue = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#80BFFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
    800: '#004C99',
    900: '#003A75',
};

const grey = {
    50: '#f6f8fa',
    100: '#eaeef2',
    200: '#d0d7de',
    300: '#afb8c1',
    400: '#8c959f',
    500: '#6e7781',
    600: '#57606a',
    700: '#424a53',
    800: '#32383f',
    900: '#24292f',
};

const Tab = styled(TabUnstyled)`
    font-family: IBM Plex Sans, sans-serif;
    color: #fff;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: transparent;
    width: 100%;
    padding: 10px 12px;
    margin: 6px 6px;
    border: none;
    border-radius: 7px;
    display: flex;
    justify-content: center;
  
    &:hover {
      background-color: ${blue[400]};
    }
  
    &:focus {
      color: #fff;
      outline: 3px solid ${blue[200]};
    }
  
    &.${tabUnstyledClasses.selected} {
      background-color: #fff;
      color: ${blue[600]};
    }
  
    &.${buttonUnstyledClasses.disabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

const TabPanel = styled(TabPanelUnstyled)(
    ({ theme }) => `
    width: 100%;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    padding: 20px 12px;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    border-radius: 12px;
    opacity: 0.6;
    `,
);

const TabsList = styled(TabsListUnstyled)(
    ({ theme }) => `
    min-width: 400px;
    background-color: ${blue[500]};
    border-radius: 12px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: space-between;
    box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
    `,
);

////=====================================================





// let baseURL = '/api/v1';
// if (window.location.href.split(':')[0] === 'http') {
//     baseURL = 'http://localhost:5001'
// };

const Main = () => {

    let { state, dispatch } = useContext(GlobalContext);

    useEffect(() => {

        const getProfile = async () => {

            try {
                let res = await axios.get(`${state.baseURL}/profile`,
                    // {},
                    {
                        withCredentials: true
                    })

                console.log("useEffect ===>: ", res);

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

                // dispatch({
                //     type: 'USER_LOGOUT'
                // })
            }
        }
        getProfile();

    }, [])


    // return (
    //     <div className="page">
    //         <div className="header">
    //             <h1>Posting App</h1>
    //             {
    //                 (state?.isLogin) ?
    //                     <nav>
    //                         <ul>
    //                             <li><Link to={`/`}>Home</Link></li>
    //                             <li><Link to={`/about`}>About</Link></li>
    //                             <li><Link to={`/gallery`}>Gallery</Link></li>
    //                             <li
    //                                 onClick={() => {
    //                                     axios.post(`${state.baseURL}/logout`, {}, {
    //                                         withCredentials: true
    //                                     })
    //                                         .then((res) => {
    //                                             console.log('logout respone ===>', res);
    //                                             dispatch({
    //                                                 type: 'USER_LOGOUT',
    //                                                 payload: null
    //                                             });
    //                                         })
    //                                         .catch((err) => {
    //                                             console.log('logout error ===>', err);
    //                                         })
    //                                 }}>
    //                                 <Link to={`/`}>Logout</Link></li>
    //                         </ul>
    //                     </nav>
    //                     :
    //                     <nav>
    //                         <ul>

    //                             <li>
    //                                 <Link to={`/signup`}>Signup</Link></li>

    //                             <li>
    //                                 <Link to={`/`}>Already have an account</Link></li>

    //                         </ul>

    //                     </nav>
    //             }
    //         </div>

    //         {
    //             (state?.isLogin) ?

    //                 <Routes>
    //                     <Route path="/" element={<Home />} />
    //                     <Route path="/about" element={<About />} />
    //                     <Route path="/gallery" element={<Gallery />} />
    //                     <Route path="*" element={<Navigate to={`/`} replace={true} />} />
    //                 </Routes>

    //                 :


    //                 <Routes>

    //                     <Route path="/signup" element={<Signup />} />
    //                     <Route path="/" element={<Login />} />
    //                     <Route path="*" element={<Navigate to={`/`} replace={true} />} />

    //                 </Routes>



    //         }

    //     </div>
    // );

    // return (
    //     <div>
    //         <Signup />
    //         <Login />
    //     </div>
    // )


    return (
        <TabsUnstyled defaultValue={0}>
            <TabsList>
                <Tab>Home</Tab>
                <Tab>About</Tab>
                <Tab>Gallery</Tab>
            </TabsList>
            <TabPanel value={0}><Home /></TabPanel>
            <TabPanel value={1}><About /></TabPanel>
            <TabPanel value={2}><Gallery /></TabPanel>
        </TabsUnstyled>

    )
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