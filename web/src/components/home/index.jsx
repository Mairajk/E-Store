
import './index.css';

import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';

import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../context/context';
import CRUD from '../CRUD';


let baseURL = '';
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
                <h1>This is Home</h1>
            }
        </div>
    )
};



export default Home;