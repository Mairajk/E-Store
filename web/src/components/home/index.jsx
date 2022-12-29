
import './index.css';

import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';

import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../context/context';
import CRUD from '../CRUD';
import UserPannel from '../UserPannel';


let baseURL = '/api/v1';
if (window.location.href.split(':')[0] === 'http') {
    baseURL = 'http://localhost:5001';
};


const Home = () => {

    let { state, dispatch } = useContext(GlobalContext);



    return (
        <div className="home">
            {(state.isAdmin) ?
                <CRUD />
                :
                <div>
                    <UserPannel />
                    {/* <h1>This is Home</h1> */}
                </div>
            }
        </div>
    )
};



export default Home;