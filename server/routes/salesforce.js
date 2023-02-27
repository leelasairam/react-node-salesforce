const express = require("express");
const router = express.Router();
const jsforce = require('jsforce');
const conn = new jsforce.Connection({loginUrl : 'https://login.salesforce.com'});
router.use(connection);

router.get("/home", (req, res,next) => {
    res.send({url : conn.instanceUrl});
});

router.get("/accounts", async(req, res,next) => {
    var records = [];
    let q;
    if(!req.query.key){
      q=`SELECT Id, Name, Phone, Rating FROM Account LIMIT 10`;
    }
    else{
      q=`SELECT Id, Name, Phone, Rating FROM Account WHERE Name = '${req.query.key}'  LIMIT 10`;
    }
    await conn.query(q, function(err, result) {
        if (err) {
            return console.error(err); 
        }
        console.log("total : " + result.totalSize);
        console.log("fetched : " + result.records.length);
        records = result.records;
        //console.log(records); 
    });
    res.send({acc : records});
});

router.post("/new-account", async(req,res) => {
    const acc1 = req.body;
    await conn.sobject("Account").create({ Name : acc1.name, Rating : acc1.rating, Phone : acc1.phone}, function(err, ret) {
        if (err || !ret.success) {
             return console.error(err, ret); 
        }
        console.log("Created record id : " + ret.id);
        res.send({msg : `Created record id : ${ret.id}`})
      });
});

router.patch("/edit-account", async(req,res) => {
    await conn.sobject("Account").update({ 
        Id : req.body.id,
        Name : req.body.name,
        Phone : req.body.phone,
        Rating : req.body.rating,
      }, function(err, ret) {
        if (err || !ret.success) {
             return console.error(err, ret); 
        }
        console.log('Updated Successfully : ' + ret.id);
        res.send({msg : `Updated record id : ${ret.id}`})
      });
})

router.delete("/delete-account/:id", async(req,res) => {
    try{
      conn.sobject("Account").destroy(req.params.id, function(err, ret) {
        if (err || !ret.success) {
             console.error(err, ret); 
             res.send({msg : err + ret})
        }
        else{
          console.log('Deleted Successfully : ' + ret.id);
         res.send({msg : `Deleted record id : ${ret.id}`})
        }
      });
    }
    catch(error){
      console.log("Error : "+error);
    }
})
function connection(req, res, next){
    const username = 'username';
      const password = 'password+security token';
      conn.login(username, password, function(err, userInfo) {
        if (err) { return console.error(err); }
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);
      });
      next()
} 


module.exports = router;