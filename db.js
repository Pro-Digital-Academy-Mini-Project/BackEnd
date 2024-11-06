const mongoose = require('mongoose')
// 계정. AWS계정으로 변경시. dotenv로 db_host 관리.
// 환경변수를 관리하는 파일을 사용. dotenv (npm install dotenv)
const MONGO_HOST = 'mongodb+srv://root:admin@cluster0.t4eoh.mongodb.net/'
mongoose.connect(MONGO_HOST, {
    retryWrites: true,
    w: "majority"
}).then((db) => {
    console.log("db connection");
}).catch(err => {
    console.error(err);
})

module.exports = mongoose;