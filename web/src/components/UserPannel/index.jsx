import './index.css';

import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import ImageIcon from '@mui/icons-material/Image';

import { GlobalContext } from '../../context/context';

import { useState, useEffect, useContext } from 'react';

// let baseURL = '';
// if (window.location.href.split(':')[0] === 'http') {
//     baseURL = 'http://localhost:5001';
// };



const UserPannel = () => {

    let { state, dispatch } = useContext(GlobalContext);

    const [responseMessage, setResponseMessage] = useState(null);
    const [responseProducts, setResponseProducts] = useState([]);
    const [load, setLoad] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);

    // const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {

        axios.get(`${state.baseURL}/products`, {
            withCredentials: true
        })
            .then((res) => {
                console.log('response "all products" =========>: ', res.data);
                setResponseProducts(res.data.data.reverse());
                console.log('responseProducts :', responseProducts);
            })
            .catch((err) => {
                console.log('Error: ', err);
            })

    }, [load])


    const search = (e) => {
        e.preventDefault();

        axios.get(`${state.baseURL}/products/${searchText}`, {
            withCredentials: true
        })
            .then((res) => {
                setSearchData([])
                setSearchData(res.data.data);
                // setSearchText('');
                e.reset();
                console.log('searchData ====>', searchData);
                console.log('response "all products" =========>: ', res.data);
            })
            .catch((err) => {
                console.log('Error: ', err);
            })

        console.log(searchData, '<<<=================');
    }


    return (
        <div>
            <h1>USER Pannel</h1>

            <form action="" on onSubmit={search}>

                <input
                    type="search"
                    placeholder='Search products'
                    value={searchText}
                    name=""
                    id=""
                    onChange={(e) => {
                        setSearchText(e.target.value)
                    }}
                />
                <button type='submit'> Search</button>
            </form>

            {
                (searchData.length) ?
                    <div className='mainSearch'>
                        <h3> Search Results :</h3>
                        <button onClick={() => {
                            setSearchData([]);
                        }}>x</button>

                        <div className="searchResult">

                            {searchData.map((eachProduct, i) => {

                                return (
                                    <div className="eachProduct" key={i}>

                                        <p> {moment(eachProduct.date).fromNow()}</p>


                                        <div>
                                            <p className="productname">{eachProduct.name}</p>
                                            <p className="productPrize">{eachProduct.price}</p>
                                            <p className="productDescription">{eachProduct.description}</p>

                                        </div>

                                    </div>
                                )
                            })}

                        </div>
                    </div>
                    : null
            }
            <div className="products">
                {
                    responseProducts.map((eachProduct, i) => {
                        // console.log('eachProduct:===>', eachProduct);

                        return (
                            <div className="eachProduct" key={i}>

                                <p> {moment(eachProduct.date).fromNow()}</p>

                                <img src={eachProduct.image} alt="" />



                                <div>
                                    <p className="productname">{eachProduct.name}</p>
                                    <p className="productPrize">{eachProduct.price}</p>
                                    <p className="productDescription">{eachProduct.description}</p>


                                </div>

                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};


export default UserPannel;