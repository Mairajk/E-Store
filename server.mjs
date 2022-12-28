
////===============>> starting  <<=============\\\\



import express from "express";
import cors from "cors";
import path from "path";
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import {
    stringToHash,
    varifyHash,
} from "bcrypt-inzi";
import mongoose from "mongoose";
import { type } from "os";
import { fileURLToPath } from "url";

const SECRET = process.env.SECRET || 'secuirity';

const ADMIN = process.env.ADMIN || 'mairajkhan597@gmail.com';


const app = express();

const port = process.env.PORT || 5001;


const mongodbURI = process.env.mongodbURI || 'mongodb+srv://MairajK:workhardin@cluster0.sihvwcq.mongodb.net/task?retryWrites=true&w=majority';


// app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', "*"],
    credentials: true
}));

///////////////////////////////// USER schema and model ///////////////

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },

});


const userModel = mongoose.model('Users', userSchema);

/////////////////////////// Product model and Schema //////////////////////////////////


let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String},
    date: { type: Date, default: Date.now }
})

const productModel = mongoose.model('products', productSchema);


//////////////////////////////////////////////////////////////////////////////


//////////////////  SIGNUP API ////////////////////////////////////

app.post('/signup', (req, res) => {

    let body = req.body;


    if (
        !body.firstName
        ||
        !body.lastName
        ||
        !body.email
        ||
        !body.password
    ) {
        res.status(400).send({

            message: `required fields missing, example request : 
            {
                firstName : 'Mairaj',
                lastName : 'Khan',
                email : 'abc@123.com',
                password : '*******'
            }`}
        );
        return;
    }

    req.body.email = req.body.email.toLowerCase();

    userModel.findOne({ email: body.email }, (err, user) => {
        if (!err) {
            console.log('user ===> ', user);

            if (user) {
                console.log('user exist already ===>', user);

                res.status(400).send({
                    message: 'this email is already exist please try a different one.'
                });
                return;
            } else {

                stringToHash(body.password).then(hashedPassword => {
                    userModel.create({
                        firstName: body.firstName,
                        lastName: body.lastName,
                        email: body.email,
                        password: hashedPassword
                    },
                        (err, user) => {
                            if (!err) {
                                console.log('user created ==> ', user);

                                (user.email === ADMIN) ?
                                    res.status(201).send({
                                        message: 'user created successfully',
                                        isAdmin: true
                                    })
                                    :
                                    res.status(201).send({
                                        message: 'user created successfully',
                                        isAdmin: false
                                    });
                            } else {
                                console.log("server error: ", err);
                                res.status(500).send({
                                    message: "server error",
                                    error: err
                                });
                            }
                        });
                });

            }
        } else {
            console.log("error ===> ", err);
            res.status(500).send({
                message: "server error",
                error: err
            });
            return;
        }
    });
});
//////////////////////////////////////////////////////////////////




//////////////////  LOGIN API ////////////////////////////////////


app.post('/login', (req, res) => {
    let body = req.body;
    body.email = body.email.toLowerCase();

    if (
        !body.password || !body.email
    ) {
        res.status(400).send({
            message: `some thing is missing in required fields `,
            example: `here is a request example :
             {
                email: "abc@123.com",
                password: "*******"
             } `
        });
        return;
    }

    userModel.findOne({ email: body.email },
        'email password firstName lastName', (err, user) => {

            if (!err) {

                console.log('user ===> ', user);

                if (user) {
                    varifyHash(body.password, user.password)
                        .then(isMatch => {
                            console.log('isMatch ===>', isMatch);
                            if (isMatch) {

                                const token = jwt.sign({
                                    id: user._id,
                                    email: body.email,
                                    iat: Math.floor(Date.now() / 1000) - 30,
                                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)

                                }, SECRET);

                                console.log('token ===> ', token);

                                res.cookie('Token', token, {
                                    maxAge: 86_400_000,
                                    httpOnly: true
                                });

                                (user.email === ADMIN) ?

                                    res.send({
                                        message: 'logedin successfully',
                                        isAdmin: true,
                                        userProfile: {
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            email: user.email,
                                            _id: user._id
                                        }
                                    })
                                    :
                                    res.send({
                                        message: 'logedin successfully',
                                        isAdmin: false,
                                        userProfile: {
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            email: user.email,
                                            _id: user._id
                                        }
                                    });
                                return;

                            } else {
                                console.log("password did not match");
                                res.status(401).send({
                                    message: "wrong password"
                                });
                                return;
                            }
                        });
                } else {
                    console.log('user not found');

                    res.status(401).send({
                        message: 'incorrect email user does not exist'
                    })
                    return;
                }

            } else {
                console.log('server error ===>', err);
                res.status(500).send({
                    message: "login failed, please try again later"
                });
                return;
            }
        });
});
///////////////////////////////////////////////////////////////////




//////////////////  LOGOUT API ////////////////////////////////////

app.post('/logout', (req, res) => {
    res.cookie('Token', '', {
        maxAge: 1,
        httpOnly: true
    });

    res.send({
        message: 'Logout successfully'
    });
});
///////////////////////////////////////////////////////////////////


///////////////////////////*******************////////////////////////////////////////

app.use((req, res, next) => {

    console.log("req.cookies: ", req.cookies);

    if (!req?.cookies?.Token) {
        res.status(401).send({
            message: "include http-only credentials with every request"
        })
        return;
    }

    jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
        if (!err) {

            console.log("decodedData: ", decodedData);

            const nowDate = new Date().getTime() / 1000;

            if (decodedData.exp < nowDate) {

                res.status(401);
                res.cookie('Token', '', {
                    maxAge: 1,
                    httpOnly: true
                });
                res.send({ message: "token expired" })

            } else {

                console.log("token approved");

                req.body.token = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
});

///////////////////////////////////////////////////////////////////////////////


//////////////////// Product adding API //////////////////////////////////

app.post('/product', (req, res) => {
    const body = req.body;

    if (
        !body.name
        ||
        !body.price
        ||
        !body.description
    ) {
        res.status(400).send({
            message: 'required paramater missing'
        });
        return;
    }

    console.log(body.name);
    console.log(body.price);
    console.log(body.description);

    productModel.create({
        name: body.name,
        price: body.price,
        description: body.description,
        date: new Date().toString(),
        image: body.image
    },
        (err, saved) => {
            if (!err) {
                res.send({
                    message: 'product added successfully',
                    data: saved
                });
            } else {
                res.status(500).send({
                    message: 'server error'
                });
            };
        });
});

///////////////////////////////////////////////////////////////////////////////


//////////////////// all Products get API //////////////////////////////////

app.get('/products', (req, res) => {

    productModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: 'successfully get all products :',
                data: data
            });
        } else {
            res.status(500).send({
                message: 'server error'
            })
        }

    })

});

///////////////////////////////////////////////////////////////////////////////


//////////////////// Product Delete API //////////////////////////////////

app.delete('/product/:id', (req, res) => {
    const id = req.params.id;

    productModel.deleteOne({ _id: id }, (err, deletedProduct) => {
        if (!err) {
            if (deletedProduct.deletedCount != 0) {
                res.send({
                    message: 'product deleted successfully',
                    data: deletedProduct
                });
            } else {
                res.status(404).send({
                    message: 'product not found of this id : ',
                    request_id: id
                });
            }
        } else {
            res.status(500).send({
                message: 'server error'
            });
        }
    });
});

///////////////////////////////////////////////////////////////////////////////



//////////////////// Product Edit API //////////////////////////////////

app.put('/product/:id', async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    if (
        !body.name
        ||
        !body.price
        ||
        !body.description
    ) {
        res.status(400).send({
            message: 'required paramater missing'
        });
        return;
    }

    try {
        let data = await productModel.findByIdAndUpdate(id, {
            name: body.name,
            price: body.price,
            description: body.description,
        },
            { new: true }
        ).exec();
        console.log(' updated data :===>', data);

        res.send({
            message: 'product modified successfully',
            updated_Data: data
        })
    }
    catch (err) {
        res.status(500).send({
            message: 'server error'
        });
    }
});

///////////////////////////////////////////////////////////////////////////////



//////////////////// Product Search API //////////////////////////////////

app.get('/products/:name', (req, res) => {

    let findName = req.params.name;

    productModel.find({ name: { $regex: `${findName}` } }, (err, data) => {
        if (!err) {

            if (data.length !== 0) {

                res.send({
                    message: 'successfully get all products :',
                    data: data
                });
            } else {
                res.status(404).send({
                    message: 'product not found'
                })
            }

        } else {
            res.status(500).send({
                message: 'server error'
            })
        }
    })
});

///////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////


const __dirname = path.resolve();

app.use("/", express.static(path.join(__dirname, "./web/build")));
app.use("*", express.static(path.join(__dirname, "./web/build/index.html")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});




mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////