import './index.css';

import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import ImageIcon from '@mui/icons-material/Image';

import { useState, useEffect } from 'react';

let baseURL = '';
if (window.location.href.split(':')[0] === 'http') {
    baseURL = 'http://localhost:5001';
};



const CRUD = () => {

    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [responseProducts, setResponseProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [load, setLoad] = useState(false);
    const [editingData, setEditingData] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchData, setSearchData] = useState([]);

    // const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {

        axios.get(`${baseURL}/products`, {
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

    const deleteProduct = (id) => {

        console.log(' This is deleteProduct');
        console.log(id);

        axios.delete(`${baseURL}/product/${id}`, {
            withCredentials: true
        })
            .then((res) => {
                console.log('delete response =====>', res);
                setLoad(!load);
            })
            .catch((err) => {
                console.log('delete Error =====>', err);
            })
    }

    const editProduct = (product) => {
        setIsEditing(!isEditing);
        setEditingData(product);

        updateFormik.setFieldValue('productName', product.name);
        updateFormik.setFieldValue('price', product.price);
        updateFormik.setFieldValue('description', product.description);
    }

    const formik = useFormik({
        initialValues: {
            productName: "",
            price: "",
            description: "",
            image: null
        },

        validationSchema:

            yup.object({

                productName: yup
                    .string('Enter your price')
                    .required('Price is required')
                    .min(3, "please enter more then 3 characters ")
                    .max(20, "please enter within 20 characters "),

                price: yup
                    .string('Enter price of product')
                    .required('Price is required')
                    // .number("Enter a valid Price in numbers")
                    .min(1, "please enter more then 3 characters ")
                    .max(20, "please enter within 20 characters "),

                description: yup
                    .string("Please enter your description")
                    .required("description is required")
                    .min(8, "Minimum 8 characters")
                    .max(150, "Minimum 8 characters"),


            }),

        onSubmit: (values) => {
            console.log("values : ", values);
            console.log("Hello");

            const cloudinaryData = new FormData();
            cloudinaryData.append("file", values.image);
            cloudinaryData.append("upload_preset", "profilePicDemo");
            cloudinaryData.append("cloud_name", "dzy6qrpp5");
            console.log(cloudinaryData);
            axios.post(`https://api.cloudinary.com/v1_1/dzy6qrpp5/image/upload`,
                cloudinaryData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })

                .then(res => {


                    axios.post(`${baseURL}/product`, {
                        name: values.productName,
                        price: values.price,
                        description: values.description,
                        image: res?.data?.url
                    }, {
                        withCredentials: true
                    })
                        .then((response) => {
                            // console.log(`response : ${response}`);///// return [object Object]
                            console.log('`response : `', response.data);
                            console.log(`data added`);
                            setResponseMessage(response.data.message)
                            setIsAdding(false);
                            setTimeout(() => {
                                setResponseMessage(null)
                            }, 10000);
                            setLoad(!load);

                            // console.log('responseProducts:====> ' ,responseProducts);
                        })
                        .catch((err) => {
                            console.log(`Error : ===>`, err);
                        })
                })
                .catch(err => {
                    console.log(err);
                })

        }
    });

    const updateFormik = useFormik({
        initialValues: {
            productName: editingData.editName,
            price: editingData.editPrice,
            description: editingData.editDescription,
            image: null
        },

        validationSchema:

            yup.object({

                productName: yup
                    .string('Enter your price')
                    .required('Price is required')
                    .min(3, "please enter more then 3 characters ")
                    .max(20, "please enter within 20 characters "),

                price: yup
                    .string('Enter price of product')
                    .required('Price is required')
                    // .number("Enter a valid Price in numbers")
                    .min(1, "please enter more then 3 characters ")
                    .max(20, "please enter within 20 characters "),

                description: yup
                    .string("Please enter your description")
                    .required("description is required")
                    .min(8, "Minimum 8 characters")
                    .max(150, "Minimum 8 characters"),


            }),

        onSubmit: (updateValues) => {


            console.log("updateValues : ======>>>  ", updateValues);
            console.log("this is editing handler");
            setIsEditing(false);

            console.log(' This is update Product');
            console.log(editingData._id);

            axios.put(`${baseURL}/product/${editingData._id}`, {
                name: updateValues.productName,
                price: updateValues.price,
                description: updateValues.description
            }, {
                withCredentials: true
            })
                .then((res) => {
                    console.log('edit response =====>', res);
                    setLoad(!load);
                })
                .catch((err) => {
                    console.log('edit Error =====>', err);
                })
        }
    });

    const search = (e) => {
        e.preventDefault();

        axios.get(`${baseURL}/products/${searchText}`, {
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
            <h1>CRUD Operation With Express and React</h1>

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

            <button
                className='addBtn'
                onClick={() => {
                    setIsAdding(true);
                }}>
                Add Product
            </button>

            <div className="addingForm">
                {
                    (isAdding) ?

                        <form onSubmit={formik.handleSubmit}>
                            <div className="inputDiv">
                                <label htmlFor="productName">Product name : </label>

                                <label htmlFor="image">
                                    <input id="image" name="image" type="file"
                                        onChange={(e) => {
                                            formik.setFieldValue("image", e.currentTarget.files[0]);
                                        }} />
                                    <ImageIcon />
                                </label>

                                <input
                                    type="text"
                                    id="productName"
                                    value={formik.values.productName}
                                    placeholder="Enter you name :"
                                    onChange={formik.handleChange}
                                />
                                {(formik.touched.productName && Boolean(formik.errors.productName)) ?
                                    <p className="inputError">{formik.errors.productName}</p> : <p className="inputError"></p>}
                            </div>

                            <div className="inputDiv">
                                <label htmlFor="price">Price : </label>
                                <input
                                    type="number"
                                    id="price"
                                    value={formik.values.price}
                                    placeholder="Enter your Price :"
                                    onChange={formik.handleChange}
                                />
                                {(formik.touched.price && Boolean(formik.errors.price)) ?
                                    <p className="inputError">{formik.errors.price}</p> : <p className="inputError"></p>}
                            </div>

                            <div className="inputDiv">
                                <label htmlFor="description">Description : </label>
                                <input
                                    type="text"
                                    id="description"
                                    value={formik.values.description}
                                    placeholder="Enter your description :"
                                    onChange={formik.handleChange}
                                />
                                {(formik.touched.description && Boolean(formik.errors.description)) ?
                                    <p className="inputError">{formik.errors.description}</p> : <p className="inputError"></p>}
                            </div>


                            <button type="submit">Save</button>
                        </form>
                        : null

                }
                <h3>{responseMessage}</h3>
            </div>

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

                                        {
                                            (isEditing && eachProduct._id === editingData._id) ?

                                                <div className="editingProduct">
                                                    <form onSubmit={updateFormik.handleSubmit}>
                                                        <div className="inputDiv">
                                                            <label htmlFor="productName">Product name : </label>
                                                            <input
                                                                type="text"
                                                                id="productName"
                                                                value={updateFormik.values.productName}
                                                                // value={eachProduct.name}
                                                                placeholder="Enter you name :"
                                                                onChange={updateFormik.handleChange}
                                                            />
                                                            {(updateFormik.touched.productName && Boolean(updateFormik.errors.productName)) ?
                                                                <p className="inputError">{updateFormik.errors.productName}</p> : <p className="inputError"></p>}
                                                        </div>

                                                        <div className="inputDiv">
                                                            <label htmlFor="price">Price : </label>
                                                            <input
                                                                type="number"
                                                                id="price"
                                                                value={updateFormik.values.price}
                                                                // value={eachProduct.price}
                                                                placeholder="Enter your Price :"
                                                                onChange={updateFormik.handleChange}
                                                            />
                                                            {(updateFormik.touched.price && Boolean(updateFormik.errors.price)) ?
                                                                <p className="inputError">{updateFormik.errors.price}</p> : <p className="inputError"></p>}
                                                        </div>

                                                        <div className="inputDiv">
                                                            <label htmlFor="description">Description : </label>
                                                            <input
                                                                type="text"
                                                                id="description"
                                                                value={updateFormik.values.description}
                                                                // value={eachProduct.description}
                                                                placeholder="Enter your description :"
                                                                onChange={updateFormik.handleChange}
                                                            />
                                                            {(updateFormik.touched.description && Boolean(updateFormik.errors.description)) ?
                                                                <p className="inputError">{updateFormik.errors.description}</p> : <p className="inputError"></p>}
                                                        </div>


                                                        <button type="submit" >Save</button>
                                                    </form>
                                                    <button onClick={() => {
                                                        setIsEditing(false);
                                                    }}>Cancel</button>
                                                </div>
                                                :
                                                <div>
                                                    <p className="productname">{eachProduct.name}</p>
                                                    <p className="productPrize">{eachProduct.price}</p>
                                                    <p className="productDescription">{eachProduct.description}</p>

                                                    <button
                                                        className="editing"
                                                        onClick={() => {
                                                            // setIsEditing(true);
                                                            // setEditingId(eachProduct.id)
                                                            editProduct(eachProduct);
                                                            console.log('editingData ===> ', editingData);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button className="delete"
                                                        onClick={() => {
                                                            deleteProduct(eachProduct._id);
                                                        }}>
                                                        Delete
                                                    </button>
                                                </div>
                                        }
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

                                {/* {
                                    setInterval(() => {
                                        return (
                                            <p> {moment(eachProduct.date).fromNow()}</p>
                                        )
                                    }, 1000)
                                } */}

                                <img src={eachProduct.image} alt="" />

                                {
                                    (isEditing && eachProduct._id === editingData._id) ?

                                        <div className="editingProduct">
                                            <form onSubmit={updateFormik.handleSubmit}>
                                                <div className="inputDiv">
                                                    <label htmlFor="productName">Product name : </label>
                                                    <input
                                                        type="text"
                                                        id="productName"
                                                        value={updateFormik.values.productName}
                                                        // value={eachProduct.name}
                                                        placeholder="Enter you name :"
                                                        onChange={updateFormik.handleChange}
                                                    />
                                                    {(updateFormik.touched.productName && Boolean(updateFormik.errors.productName)) ?
                                                        <p className="inputError">{updateFormik.errors.productName}</p> : <p className="inputError"></p>}
                                                </div>

                                                <div className="inputDiv">
                                                    <label htmlFor="price">Price : </label>
                                                    <input
                                                        type="number"
                                                        id="price"
                                                        value={updateFormik.values.price}
                                                        // value={eachProduct.price}
                                                        placeholder="Enter your Price :"
                                                        onChange={updateFormik.handleChange}
                                                    />
                                                    {(updateFormik.touched.price && Boolean(updateFormik.errors.price)) ?
                                                        <p className="inputError">{updateFormik.errors.price}</p> : <p className="inputError"></p>}
                                                </div>

                                                <div className="inputDiv">
                                                    <label htmlFor="description">Description : </label>
                                                    <input
                                                        type="text"
                                                        id="description"
                                                        value={updateFormik.values.description}
                                                        // value={eachProduct.description}
                                                        placeholder="Enter your description :"
                                                        onChange={updateFormik.handleChange}
                                                    />
                                                    {(updateFormik.touched.description && Boolean(updateFormik.errors.description)) ?
                                                        <p className="inputError">{updateFormik.errors.description}</p> : <p className="inputError"></p>}
                                                </div>


                                                <button type="submit" >Save</button>
                                            </form>
                                            <button onClick={() => {
                                                setIsEditing(false);
                                            }}>Cancel</button>
                                        </div>

                                        :

                                        <div>
                                            <p className="productname">{eachProduct.name}</p>
                                            <p className="productPrize">{eachProduct.price}</p>
                                            <p className="productDescription">{eachProduct.description}</p>

                                            <button
                                                className="editing"
                                                onClick={() => {
                                                    // setIsEditing(true);
                                                    // setEditingId(eachProduct.id)
                                                    editProduct(eachProduct);
                                                    console.log('editingData ===> ', editingData);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button className="delete"
                                                onClick={() => {
                                                    deleteProduct(eachProduct._id);
                                                }}>
                                                Delete
                                            </button>
                                        </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
};


export default CRUD;