const http=require('http');
const fs=require('fs');
var requests = require('requests');



const homeFile=fs.readFileSync('home.html','utf-8');

//tempval-->data fetched from file
const replaceVal=(tempval,orgval)=>{
 temperature=tempval.replace("{%tempval%}",orgval.main.temp);
 temperature=temperature.replace("{%tempmin%}",orgval.main.temp_min);
temperature=temperature.replace("{%tempmax%}",orgval.main.temp_max);
 temperature=temperature.replace("{%location%}",orgval.name);
 temperature=temperature.replace("{%country%}",orgval.sys.country);
 temperature=temperature.replace("{%tempstatus%}",orgval.weather[0].main);
 return temperature;
}

const server=http.createServer((req,res)=>{
if(req.url=="/"){
    requests('https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=265efab31f07deef066f0b9c25b7a163'
    )
.on('data', function (chunk) {

    //json-->objeect-->array
   const objdata=JSON.parse(chunk);
   const arrdata=[objdata];

  // console.log(arrdata[0].main.temp);

  const realTimeData=arrdata.map((val)=>
    //to replace data from placeholder to real api data
    //data obtained in array , to convert in string join used
    replaceVal(homeFile,val)).join("");
   
  res.write(realTimeData);

})
.on('end', (err) =>{
  if (err) return console.log('connection closed due to errors', err);
 
res.end();
});

    
}
}) ;

server.listen(8000,"127.0.0.1");