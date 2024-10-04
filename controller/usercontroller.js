var user = require('../model/usermodel');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'languagepdf@gmail.com',
      pass: 'mmls zepq hoks rfqc'
    }
  });


var login_status=0;

exports.index = async (req,res)=>{

  

    var check_email = await user.find({email:req.body.email});

    if(check_email.length==0){
        var data = await user.create(req.body);
        var OTP = Math.floor(100000 + Math.random() * 900000);
        var mailOptions = {
            from: 'languagepdf@gmail.com',
            to: req.body.email,
            subject: 'Account Info',
            text: req.body.name+' Your Account Creation successfull for using this email address '+req.body.email+' And Your OTP is: '+OTP
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.status(200).json({
                    status:"Error",
                    error
                })
            } else {
                res.status(200).json({
                    status:"Success",
                    data
                })
            }
          });

    }else{
        res.status(200).json({
            status:"email is alredy register check your email address"
        })
    }
    
}

exports.get_data = async (req,res)=>{

    var page_no = req.query.page_no;
    var limit = 2;

    if(page_no==undefined){
        page_no=1;
    }

    var skip_data = (page_no-1) * limit;

    var data = await user.find().limit(limit).skip(skip_data);
    res.status(200).json({
        status:"Success",
        data
    })
}

exports.single_data = async (req,res)=>{
    var id = req.params.id;
    var data = await user.findById(id);
    res.status(200).json({
        status:"Success",
        data  
    })
}

exports.update_data = async (req,res)=>{
    var id = req.params.id;
    var data = await user.findByIdAndUpdate(id,req.body);
    res.status(200).json({
        status:"Success"
    })
}

exports.delete_data = async (req,res)=>{
    var id = req.params.id;
    var data = await user.findByIdAndDelete(id);
    res.status(200).json({
        status:"Success"
    })
}

exports.login = async (req,res) => {

    var data = await user.find({email:req.body.email});

    if(login_status==0)
    {
        if(data.length==1)
        {
            if(data[0].password==req.body.password){

                login_status=1
                var token = await jwt.sign({id:data[0].id},"cdmi");

                res.status(200).json({
                    status:"Login Success",
                    token
                })
            }else{
                res.status(200).json({
                    status:"Check your email and password"
                })
            }
        }else{
            res.status(200).json({
                status:"Check your email and password"
            })
        }
    }else{
        res.status(200).json({
            status:"User is alredy login"
        })
    }

}

exports.logout = (req,res) =>{
    login_status=0
    res.status(200).json({
        status:"logout success"
    })
}