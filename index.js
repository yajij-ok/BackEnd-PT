const express = require ('express');
const app = express()
const dbConnect = require('./config/config');
const authRouter = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const productRouter = require('./routes/productRoute');
const morgan = require('morgan');
const categoryRoute = require('./routes/categoryRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require('./routes/couponRoute');
const colorRoute = require('./routes/colorRoute');
const enqRoute = require('./routes/enqRoute');
const cors = require("cors")

const dotenv = require("dotenv").config()

const PORT = process.env.PORT || 5000;
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());
app.use(cors())

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/category', categoryRoute)
app.use('/api/brand', brandRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/color', colorRoute)
app.use('/api/enquiry', enqRoute)




app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(notFound)
app.use(errorHandler);



app.get("/api", (req, res) => {
  res.json({ message: "Backend is alive!" });
});

app.listen(PORT, async ()=>{
    console.log(`Server is running in PORT ${PORT}`);
    await dbConnect();
})
