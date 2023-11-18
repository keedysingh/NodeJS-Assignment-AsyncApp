import express from "express";
import fs from "fs";
const app=express();
import fetch from 'node-fetch';
import path from 'path';
const __dirname = path.resolve();
import request from 'request';
// app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


const PORT=3600;

/**
 * get employee details
 * query parameter employee id
 */
app.get("/employee/:id",(req,res)=>{
    let empId=req.params.id
   getEmployeeDetails(empId).then((data)=>{
    // console.log(data)
        res.send(data);
    })
    .catch(err=>{res.send(err); return false;});
});

var getEmployeeDetails=(empId)=>{
return new Promise((resolve,reject)=>{
    fs.readFile("./data/employee.json",(err,data)=>{
        if(err){
            console.log(err);
            reject (err);
        }
        let employeeArray=JSON.parse(data);
        let employee=employeeArray.filter((row)=>{
            // console.log(row.employeeCode)
            return row.employeeCode==empId;
        })
        // console.log(employee);
        // res.sendStatus(200);
        if(employee.length>0){
            resolve (JSON.stringify(employee))
        }else{
            reject({"message":"Invalid Employee Id"});
            return false;
        }
        
    })
})
    
}

/**
 * get project details
 * query parameter project id
 */
app.get("/project/:id",(req,res)=>{
    let prjId=req.params.id
    getProjectDetails(prjId).then((data)=>{
         res.send(data);
     })
     .catch(err=>{res.send(err)});
});/**
* get employee and project details
* 
*/
var getProjectDetails=(prjId)=>{
    return new Promise((resolve,reject)=>{
        fs.readFile("./data/project.json",(err,data)=>{
            if(err){
                console.log(err);
                reject (err);
            }
            let projectArray=JSON.parse(data);
            let project=projectArray.filter((row)=>{
                console.log(row.id)
                return row.id==prjId;
            })
            console.log(project);
            // res.sendStatus(200);
            if(project.length>0){
                resolve (JSON.stringify(project))
            }else{
                reject("Invalid Project Id");
            }
            
        })
    })
        
    }
app.get("/getemployeedetails/:empId",async(req,res)=>{
    let empId=req.params.empId
 let responce=await fetch(`http://localhost:${PORT}/employee/${empId}`)
 if(responce.statusText=='OK'){
     responce.json().then(empData=>{
        if(empData.length>0){
            empData.map(async(data)=>{
                if(data.product_id){
                    let productResponce=await fetch(`http://localhost:${PORT}/project/${data.product_id}`)
                    let productData=await productResponce.json();
                    let finalData={
                        "employee":data,
                        "project":productData
                    }
                    res.send(finalData);
                }
            })
        }else{
            res.send({'message':"Invalid Employee ID"}).sendStatus(400);
        }
     });
    // console.log(data);
 }

});

app.get("/view/employee",(req,res)=>{
    let response=request(`http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees`,(error, response, body)=>{
                        // console.log(body);
                        if(response.statusCode==200){
                            let data=JSON.parse(body)
                            res.render('employee',{data});
                        }
                    })
    
})

app.listen(PORT,(err)=>{
if (err){ console.log(err); return false};
console.log(`App running on port ${PORT}`)
})