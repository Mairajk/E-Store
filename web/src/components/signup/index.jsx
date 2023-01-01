import { useFormik } from "formik"
import * as yup from 'yup';
import axios from 'axios';

import { useState, useContext } from "react";
import { GlobalContext } from '../../context/context';


import { TextField, Button, Grid } from '@mui/material'

// let baseURL = '/api/v1';
// if (window.location.href.split(':')[0] === 'http') {
//     baseURL = 'http://localhost:5001'
// };

const Signup = () => {

    const [message, setMessage] = useState('');

    let { state, dispatch } = useContext(GlobalContext);


    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },

        validationSchema:

            yup.object({

                firstName: yup
                    .string('Enter your first name')
                    .required('first name is required')
                    .min(3, "please enter atleast 3 characters ")
                    .max(20, "please enter within 20 characters "),

                lastName: yup
                    .string('Enter your last name')
                    .required('last name is required')
                    .min(3, "please enter atleast 3 characters ")
                    .max(20, "please enter within 20 characters "),

                email: yup
                    .string('Enter your email')
                    .required('Email is required')
                    .email("Enter a valid Email ")
                    .min(3, "please enter more then 3 characters ")
                    .max(25, "please enter within 20 characters "),

                password: yup
                    .string("Please enter your Password")
                    .required("Password is required")
                    .min(8, "Minimum 8 characters"),

            }),

        onSubmit: (values) => {
            console.log("values : ", values);

            const signupHandler = () => {

                axios.post(`${state.baseURL}/signup`, {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password
                }, {
                    withCredentials: true
                })
                    .then((res) => {
                        console.log('response ===>', res);
                        console.log('Signup successfull');
                        // setIsSignup(false);
                        dispatch({
                            type: 'USER_LOGIN',
                            payload: null
                        })

                        dispatch({
                            type: 'SET_USER',
                            payload: res.data.userProfile
                        });

                    })
                    .catch((err) => {
                        console.log('error ===>', err);
                        setMessage(err?.response?.data?.message);
                    })
            };

            signupHandler();
        }
    });

    return (

        <div className="signupDiv">

            <h1>Signup</h1>

            <form onSubmit={formik.handleSubmit}>

                <h3 className="errMessage">{message}</h3>

                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >

                    <TextField
                        margin="dense"
                        variant="outlined"
                        type="text"
                        id="firstName"
                        value={formik.values.firstName}
                        placeholder="Enter you first name :"
                        onChange={formik.handleChange}
                        label='First Name'
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}

                    />


                    <TextField
                        margin="dense"
                        variant="outlined"
                        type="text"
                        id="lastName"
                        value={formik.values.lastName}
                        placeholder="Enter you last name :"
                        onChange={formik.handleChange}
                        label='Last Name '
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}

                    />


                    <TextField
                        margin="dense"
                        variant="outlined"
                        type="email"
                        id="email"
                        value={formik.values.email}
                        label='Email'
                        placeholder="Enter your Email :"
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}

                    />


                    <TextField
                        margin="dense"
                        variant="outlined"
                        type="password"
                        id="password"
                        value={formik.values.password}
                        label='Password'
                        placeholder="Enter your password :"
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />

                </Grid>

                <Button
                    // fullWidth
                    color="primary"
                    variant="contained"
                    type="submit"
                    margin="dense"
                    sx={{ mt: 2 }}
                >
                    Signup
                </Button>

            </form>
        </div>
    )
};


export default Signup;







