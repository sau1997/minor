//var download =require("download");
var express=require("express");
var app =express();
var parser =require('node-html-parser');
var axios =  require("axios");

var bodyparser=require("body-parser"),
    scholar = require('google-scholar'),
    HtmlDocx = require('html-docx-js'),
    fs = require('fs'),
    axios = require('axios');    
   // methodoverride=require("method-override"),
   // expresssanitizer= require("express-sanitizer"),
    request=require("request");

//app.use(expresssanitizer());

const port = process.env.PORT || 3000;
app.set("view engine","ejs");
app.use(express.static("views"));
app.use(bodyparser.urlencoded({extended:true}));
//app.use(methodoverride("_method"));

app.get("/",function(req,res){
   res.render("home");
});
 app.get("/jounral", async function(req,res,){
	var data1=[];
	var data2=[];
	//take serch input
	var mySet = new Set();
	var mySet1=new Set();
	var query=req.query.search;
	var startDate=req.query.startDate;
	var endDate=req.query.endDate;
	var url1 = `http://dblp.org/search/publ/api?q=${query}&format=json`;
	
 	

 	var data = await axios.get(url1);
 	var name=data.data.result.query;
 	// console.log(data.data.result.hits.hit);
 	for(var i=0;i<data.data.result.hits.hit.length;i++){
 		
 		 if(data.data.result.hits.hit[i].info.type=="Journal Articles"){
                            
                       if(data.data.result.hits.hit[i].info.year>= startDate && data.data.result.hits.hit[i].info.year<= endDate ){
                         	// console.log(data.data.result.hits.hit[i].info.authors.author);
                         	// console.log(data.data.result.hits.hit[i].info.venue);
                         	 var s= { title :data.data.result.hits.hit[i].info.title,
 				                        year:data.data.result.hits.hit[i].info.year,
 				                        coauth: data.data.result.hits.hit[i].info.authors.author,
 				                       venue:data.data.result.hits.hit[i].info.venue+","+data.data.result.hits.hit[i].info.pages
 			                          };
 			                  console.log(s);        
                         	await mySet.add(s);
                         }
                
              } 
   }
      
      for(var i=0;i<data.data.result.hits.hit.length;i++){
 	           if(data.data.result.hits.hit[i].info.type=="Conference and Workshop Papers"){
                       if(data.data.result.hits.hit[i].info.year>= startDate && data.data.result.hits.hit[i].info.year<= endDate ){
                             var s1= { title :data.data.result.hits.hit[i].info.title,
 				                        year:data.data.result.hits.hit[i].info.year,
 				                        coauth: data.data.result.hits.hit[i].info.authors.author,
 				                       venue:data.data.result.hits.hit[i].info.venue+","+data.data.result.hits.hit[i].info.pages
 			                          };
                         	   console.log(s1);
                           // console.log("hello journal2");
                           // console.log(data.data.result.hits.hit[i].info.authors.author);
                           // console.log(data.data.result.hits.hit[i].info.venue);
                          await mySet1.add(s1);
                         }
                     }
              }         

 	
  const hasWord = (str, word) => 
  ((s) => s.has(word))(new Set(str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/)));
 	
    var url2='https://scholar.google.com/citations?hl=en&user=O5SNE7UAAAAJ&view_op=list_works&sortby=pubdate&cstart=0&pagesize=100';

 	var dd = await axios.get(url2);
 	// console.log(dd.data)
 	var root = await parser.parse(dd.data);
 	var tb = await root.querySelector("#gsc_a_b");
 	console.log(tb.childNodes.length);
     
 for(i = 0; i < tb.childNodes.length; i++){
    if(typeof tb.childNodes[i]!=='undefined'){
      console.log(i);
    var z1=tb.childNodes[i].childNodes[0].childNodes[0].childNodes[0];//title
    var z2=tb.childNodes[i].childNodes[0].childNodes[2].childNodes[0];//Info
    var z3=tb.childNodes[i].childNodes[2].childNodes[0].childNodes[0];//year
    var z4=tb.childNodes[i].childNodes[0].childNodes[1].childNodes[0];//Co authors;

    if ((typeof z1 !== 'undefined')&& (typeof z2!== 'undefined')&& (typeof z3!== 'undefined')&&(typeof z3!== 'undefined')){
         //console.log(tb.childNodes[i].childNodes[0].childNodes[1].childNodes[0].rawText);
         var x4=tb.childNodes[i].childNodes[0].childNodes[1].childNodes[0].rawText;
         //console.log(x4);
         var x3=tb.childNodes[i].childNodes[0].childNodes[2].childNodes[0].rawText;
         if(hasWord((x3),"Conference")){
            var x1=tb.childNodes[i].childNodes[2].childNodes[0].childNodes[0].rawText;
            if(x1>=startDate&&x1<=endDate){
               //console.log(tb.childNodes[i].childNodes[0].childNodes[0].childNodes[0].rawText);
                var s2= { title :tb.childNodes[i].childNodes[0].childNodes[0].childNodes[0].rawText,
                year:x1,
                coauth: x4,
                venue:x3
              };
               await mySet1.add(s2);
            }
          }else{
              var x1=tb.childNodes[i].childNodes[2].childNodes[0].childNodes[0].rawText;
      
                if(x1>=startDate&&x1<=endDate){
                // console.log(tb.childNodes[i].childNodes[0].childNodes[0].childNodes[0].rawText);
                var s3= { title :tb.childNodes[i].childNodes[0].childNodes[0].childNodes[0].rawText,
                year:x1,
                coauth: x4,
                venue:x3
                };
                await mySet.add(s3);
              }
           }
      
       
      }
   }
  
}
 	




     
	for (let item of mySet){
		data1.push(item);
	}
	for (let item of mySet1){
		data2.push(item);
	}
	//console.log(data2);
     // console.log(mySet);
	//console.log(data1);
	res.render("journ",{name:name,data1:data1, data2:data2});
 });



app.get("/down",function(req,res){
	// var query = req.query.search;
	// var startDate=req.query.startDate;

	// var endDate=req.query.endDate;
	// console.log(startDate);
	// console.log(endDate);

	
   res.redirect('/');
   
});

app.listen(port,function(){
	console.log("server has started");  
});