import { useState, useContext } from "react";
import { GlobalContext } from '../../context/context';


import { useFormik } from "formik"
import * as yup from 'yup';
import axios from 'axios';

import { TextField, Button, Grid } from '@mui/material'




let baseURL = '';
if (window.location.href.split(':')[0] === 'http') {
    baseURL = 'http://localhost:5001'
};

const Login = () => {

    let { state, dispatch } = useContext(GlobalContext);


    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        validationSchema:

            yup.object({

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

            const loginHandler = () => {

                axios.post(`${baseURL}/login`, {
                    email: values.email,
                    password: values.password
                }, {
                    withCredentials: true
                })
                    .then((res) => {

                        dispatch({
                            type: 'USER_LOGIN',
                            payload: null
                        })

                        console.log('response ===>', res);
                        // setIsLogin(true);
                    })
                    .catch((err) => {
                        console.log('error ===>', err);
                    })
            };

            loginHandler();

        }
    });

    return (

        <div className="loginDiv">

            <h1>Login</h1>
            <form onSubmit={formik.handleSubmit}>

                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >

                    <TextField
                        margin="dense"
                        variant="outlined"
                        type="email"
                        placeholder="Enter your email"
                        id="email"
                        value={formik.values.email}
                        label='Email'
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}

                    />


                    <TextField
                        margin="dense"
                        variant="outlined"
                        type="password"
                        placeholder="Enter your password"
                        id="password"
                        value={formik.values.password}
                        label='Password'
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
                    Login
                </Button>

            </form>
        </div>
    )
};


export default Login;


