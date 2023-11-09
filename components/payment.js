import Razorpay from "razorpay";
import { config } from "dotenv";
config();
const {RAZORPAY_KEY_ID,  RAZORPAY_SECRET  } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET,
});



const createOrder = async(req,res)=>{
    console.log("yha");
    try {
        const amount = req.body.amount*100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }

        razorpayInstance.orders.create(options, 
            (err, order)=>{
                if(!err){
                    res.status(200).send({
                        success:true,
                        msg:'Order Created',
                        order_id:order.id,
                        amount:amount,
                        key_id:RAZORPAY_KEY_ID,
                        product_name:req.body.option,
                        description:req.body.minutes,
                        contact:"8567345632",
                        name: "Sandeep Sharma",
                        email: "sandeep@gmail.com"
                    });
                }
                else{
                    res.status(400).send({success:false,msg:'Something went wrong!'});
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }
}


export default createOrder;