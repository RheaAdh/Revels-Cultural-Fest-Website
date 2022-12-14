const DelCard = require("../../models/DelegateCard");
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const crypto = require("crypto");
const mongoose = require("mongoose");

//Registering Order on Razorpay server
const registerOrder = async (req, res) => {
  try {
    // console.log('Entry');
    // const razorpay = new Razorpay({
    //   key_id: 'rzp_test_YwEGRlKoqLToxD',
    //   key_secret: 'HyE84sPchHUZ2mqDOyC5j97l',
    // });
    // let { delCard_id } = req.body;
    // // delCard_id = mongoose.Types.ObjectId(delCard_id);
    // let delegateCard = await DelCard.findById(delCard_id);
    // console.log(delegateCard);
    // if (!delegateCard)
    //   return res.status(400).send({
    //     success: false,
    //     msg: 'No Delegate-Card/ProShow Found',
    //   });
    // console.log('Selected Delegate Card', delegateCard);
    // console.log(req.requestUser._id);
    // // console.log("User ",)
    // let user = await User.findOne({
    //   _id: req.requestUser._id,
    //   // _id:'6228a7d17ff99d984e267927',  //For Testing
    //   delegateCards: delCard_id,
    // });
    // console.log('Found ', user);
    // if (user) {
    //   console.log('Delegate-Card/ProShow already purchased', user);
    //   return res.status(400).send({
    //     success: false,
    //     msg: 'Delegate-Card/ProShow already purchased',
    //   });
    // }
    // // TODO: Overhead razorpay charges to be added in ammout
    // const options = {
    //   amount: delegateCard.mahePrice * 100,
    //   currency: 'INR',
    //   receipt: shortid.generate(),
    //   payment_capture: true,
    // };
    // let response;
    // await razorpay.orders.create(options, (err, order) => {
    //   if (err) {
    //     console.log('Razorpay Error :', err);
    //     return res
    //       .status(500)
    //       .send({ success: false, msg: 'Razorpay Server Error' });
    //   }
    //   if (order) {
    //     response = order;
    //     console.log('Order generated : ', order);
    //   }
    // });
    // console.log(response);
    // console.log(delegateCard);
    // //New Transaction Initiated
    // let newTransaction = new Transaction({
    //   user: req.requestUser._id,
    //   // user: '6228a7d17ff99d984e267927',  //For Testing
    //   delegateCard: delegateCard._id,
    //   name: delegateCard.name,
    //   orderId: response.id,
    //   amount: response.amount / 100,
    //   isPaymentConfirmed: false,
    // });
    // await newTransaction.save();
    // console.log('New Transaction initiated', newTransaction);
    // return res.status(200).send({
    //   success: true,
    //   msg: 'Order Registered with Razorpay and New Transaction initiated',
    //   data: newTransaction,
    // });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" });
  }
};

//To verify payment has been registered
//In production razorpay webhook will hit this endpoint on money deducted by razorpay
const verifyPaymentAlternate = async (req, res) => {
  console.log(req.body);
  try {
    // confirmation to razorpay
    res.sendStatus(200);

    //Validating
    const secret = "Hj08oLHfEU";
    console.log(req.body);
    const hash = crypto.createHmac("sha256", secret);
    hash.update(JSON.stringify(req.body));
    const digest = hash.digest("hex");

    console.log(digest, req.headers["x-razorpay-signature"]);

    //If validation true confirm payment in DB
    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("Valid Request,Confirming Payment");
      let transaction = await Transaction.findOne({
        orderId: req.body.payload.payment.entity.order_id,
      });
      if (transaction) {
        (transaction.isPaymentConfirmed = true),
          (transaction.transactionData = req.body);
        await transaction.save();
        let delegateCardID = transaction.delegateCard;

        let user = await User.findOneAndUpdate(
          { _id: transaction.user },
          { $push: { delegateCard: { card_id: delegateCardID } } }
        );
        console.log("Payment Success");
      }
    } else {
      console.log(
        "Payment validation attempt from unknown source,payment not registered"
      );
    }
  } catch (err) {
    console.log(err);
    // return res
    //     .status(500)
    //     .send({ success: false, msg: 'Internal Server Error' });
  }
};

const verifyPayment = async (req, res) => {
  console.log(req.body);
  try {
    let { order_id, razorpay_payment_id, razorpay_signature } = req.body;
    //Validating
    const secret = "HyE84sPchHUZ2mqDOyC5j97l"; //Secret Key
    console.log(req.body);

    body = order_id + "|" + razorpay_payment_id;
    var expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");
    console.log("sig received ", razorpay_signature);
    console.log("sig generated ", expectedSignature);

    if (expectedSignature == razorpay_signature) {
      let transaction = await Transaction.findOne({
        orderId: order_id,
      });
      console.log("Transaction :", transaction);
      if (transaction) {
        (transaction.isPaymentConfirmed = true),
          (transaction.transactionData = {
            order_id,
            razorpay_payment_id,
          });
        await transaction.save();
        console.log("Transaction ID ", transaction.delegateCard);
        let delegateCardID = transaction.delegateCard;
        let user = await User.findOneAndUpdate(
          { _id: transaction.user },
          { $addToSet: { delegateCards: delegateCardID } }
        );
        console.log("Payment Success");
        console.log("Transaction : ", transaction);
        console.log("User : ", user);
      }
      console.log("Payment Confirmed");
      return res.status(200).send({
        success: true,
        msg: "Payement Confirmed",
        data: transaction,
      });
    }
    return res
      .status(400)
      .send({ success: false, msg: "Payment validation failed" });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      msg: "Internal Server Error",
      error,
    });
  }
};

module.exports = { verifyPayment, registerOrder, verifyPaymentAlternate };
