const mongoose=require('mongoose');
const initData=require('C:\\Users\\realme\\Desktop\\major project\\init\\data.js');
const Listing= require('C:\\Users\\realme\\Desktop\\major project\\models\\listing.js');

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("Connected to the DB");
       
    })
    .catch((err)=>{
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB= async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68de97b5911fffbc9c14ec70",
}));
    await Listing.insertMany(initData.data);
    console.log("Data initialized successfully");
};

 initDB();
