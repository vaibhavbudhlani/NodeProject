const http=require("http");


//-----------------------SERVER------------------//
const server=http.createServer((request,response)=>{
     var url=request.url;
     var method=request.method;
    if(isStatic(url)){
        servestaticfiles(url,response);
    }
    
    else if(url=='/' && method=="GET"){
        servestaticfiles('/index.html',response);
        
    }
    else if(url=='/submitreq' && method=='POST'){
        response.write("1");
        response.end();

    }
    else if(url=='/auth' && method=='POST'){
        let data="";
        request.on("data",(chunk)=>{
            data=data+chunk;
        })
        request.on("end",()=>{
            const qs=require("querystring");
            var dataobj=qs.parse(data);
            // var dataobj=JSON.parse(data);
            
             if(checkuser(dataobj.uid)>=0){
                     response.write("Userid exist press login button now")
                     
                     response.end();
             }
             else{
                 var newuser={uid:"",password:"",lastname:"",state:""};
                 newuser.uid=dataobj.uid;
                 newuser.password=dataobj.password;
                 newuser.lastname=dataobj.lastname;
                 newuser.state=dataobj.state;
                 var users=require("./logic");
                 users.push(newuser);
                 

                 response.write("New user added to the list");
                 response.end();
             }
              
            
            
        })
        
    }
    else if (url =='/makelogin' && method == "POST") {
        uPasscheck(request, response);
    }
    else {
        response.write("Something Went Wrong");
        response.end();
    }
    
})
//-------------------FUNCTIONALITY---------------//
function checkuser(uid){
    var users=require("./logic");
    var vb=-1;
    for(let i=0;i<users.length;i++){
         if(uid==users[i].uid){
             vb=i;
             i=users.length;
             break;
         }
    }
    console.log("vb is",vb);
    return vb;
}
function checklogin(index,uid,password){
        var users=require("./logic");
        if(users[index].password==password){
            return true;
        }
        else {
            return false;
        }
}
function uPasscheck(request, response) {
    let data = '';
    var dataObj;
    request.on('data', (chunk) => {
        data += chunk;
    })
    request.on('end', () => {
        var qs=require("querystring");
         console.log("data is",data);
        var dataObj = qs.parse(data);
        const arr = require("./logic");
        var o = 0;
        console.log(dataObj);
        // var index=checkuser(dataobj.uid);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].uid == dataObj.uid) {
                console.log("ID OK");
                o = i;
                break;
            }
        }
        if (arr[o].password == dataObj.password) {
            console.log("OK password");
            response.write("Login Successful");
            response.end();
        }
        else
            response.write("User Not exist..");
        response.end();
    })
}

//--------------------------------------//
server.listen(5233,(err)=>{
    if(err){
        console.log("Server Cant be Started");
    }
    else {
        console.log("Server Started at port 5233");
    }
})
function isStatic(url){
    const extensions = ['.html','.png','.jpeg','.jpg','.css','.js'];
    const path = require("path");
    var ext = path.extname(url);
    return extensions.indexOf(ext)>=0;
}

function servestaticfiles(file,response){
    const fs=require("fs");
    const path=require("path");
    
    const fullPath = path.join(__dirname,'public'+file);
    console.log("full path is "+fullPath);
    
    const readstream=fs.createReadStream(fullPath);
    readstream.pipe(response);
    
}

