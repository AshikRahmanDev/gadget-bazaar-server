const express = require('express');
const { advertiseCollection, productsCollection } = require('../utils/dbConnect');
const { ObjectId } = require('mongodb');

const router = express.Router()

// get advertise
router.get("/",async(req,res)=>{
    const query = {}
    const result= await advertiseCollection.find(query).toArray()
    res.send(result)
})

// create advertise
router.post("/create",async(req,res)=>{
    const body=req.body
    const {name,_id,discountPrice,price,picture,brand}=body
    const query = {_id: new ObjectId(_id)}
    const options = { upsert: true };
    const updateDoc = {
        $set: {
          advertise:true
        },
      };
    const advertise = {
        name,
        productId:_id,
        discountPrice,
        price,
        picture,
        brand
    }
    const products = await productsCollection.updateOne(query,updateDoc,options)
    const result = await advertiseCollection.insertOne(advertise)

    res.send(result)
})

// remove advertise
router.delete("/remove/:id",async(req,res)=>{
  const id = req.params.id
  const productQuery={_id: new ObjectId(id)}
  const advertiseQuery={productId:id}
  const options = { upsert: true };
    const updateDoc = {
        $set: {
          advertise:false
        },
      };
      const result = await advertiseCollection.deleteOne(advertiseQuery)
      const product = await productsCollection.updateOne(productQuery,updateDoc,options)
  res.send(result)
})

module.exports = router