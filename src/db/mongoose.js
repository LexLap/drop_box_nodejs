const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// });

let MONGODB_URL = `mongodb+srv://user:Bezeqint1@cluster0.okpxi.mongodb.net/drop-box-aws?retryWrites=true&w=majority`

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
})
