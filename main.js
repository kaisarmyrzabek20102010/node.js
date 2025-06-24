const express= require('express')
const app = express()

app.use(express.json())

const cars = []

app.post('/addCar',(req,res)=>{
  const {brand,model,year,price} = req.body

  cars.push({id:cars.length+1,brand,model,year,price})
  res.json(cars);
})


app.get('/',(req,res)=>{
  res.json(cars)
})

//what is this under 
//this is  
const tempCars = []
app.get('/car',(req,res)=>{
  const {price} = req.query;

  for(let i = 0;i<cars.length;i++){
    if(price<=cars[i].price){
      tempCars.push(cars[i]);
    }
  }
  res.json(tempCars);
})


app.get('/car/:id',(req,res)=>{
  const {id} = req.params;
  res.json(cars[id-1])
})


app.listen(3000,()=>{
  console.log("server uryp tur")
})
