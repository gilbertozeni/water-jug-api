# Water Jug API 

## Table of Contents
- [Building and running](#1-building-and-running)
- [Tools and libs](#2-tools-and-libs)
- [Project Structure](#3-project-structure)
- [Endpoints](#4-endpoints)
  - [/api/v1/water-jug/solve](#41-apiv1water-jugsolve)
      - [Examples](#411-examples)
          - [***Valid request:***](#4111-valid-request)
          - [***Invalid request:***](#4112-invalid-request)
          - [***Unprocessable values:***](#4113-unprocessable-values)
      - [Algorithm logic](#412-algorithm-logic)

## 1. Building and running

Pre-requisites: 
- Node v20.12.2

To run the ***backend*** execute:
```bash
npm start
```

To run the ***tests*** execute: 
```bash
npm test
```

To run the ***build process*** execute: 
```bash
npm run build
```

## 2. Tools and libs
The following tools where used to build this solution:

- Typescript
- NodeJS
- ExpressJS
- Inversify
- Node-Cache 
- Winston
- Morgan
- Jest


## 3. Project Structure
The project have the following structure:

```
.
└── src/
    ├── app/
    │   ├── controllers
    │   ├── middleware
    │   ├── models
    │   ├── services
    │   └── utils
    └── tests/
        ├── integration
        └── unit
```

Our `app` folder is the main source folder of the application, it contains the following directories with the following responsabilities:

- `controllers`: Application controllers and routers.
- `middleware`: Custom middlewares
- `models`: Application models
- `services`: Classes that implement the main business logic.
- `utils`: Utilitary classes

The `tests` folder contain all the integration and unit tests related to the custom components built in this project.


## 4. Endpoints

### 4.1. /api/v1/water-jug/solve
This is the main application endpoint, it implements the logic to solve the water jug riddle.

#### 4.1.1. Examples

##### 4.1.1.1. ***Valid request:***
```bash
curl -X POST http://localhost:3000/api/v1/water-jug/solve \
     -H "Content-Type: application/json" \
     -d '{
           "x_capacity": "2",
           "y_capacity": "10",
           "z_amount_wanted": "4"
         }'
```
This will produce the following output:
```json
{
  "solution":[
      {"bucketX":2,"bucketY":0,"action":"fill bucket X"},
      {"bucketX":0,"bucketY":2,"action":"transfer from bucket X to Y"},
      {"bucketX":2,"bucketY":2,"action":"fill bucket X"},
      {"bucketX":0,"bucketY":4,"action":"transfer from bucket X to Y"}
  ]
}
```

##### 4.1.1.2. ***Invalid request:***
```bash
curl -X POST http://localhost:3000/api/v1/water-jug/solve \
     -H "Content-Type: application/json" \
     -d '{
           "x_capacity": "2",
           "y_capacity": "10"
         }'
```
This will produce the following output:
```json
{
  "errors":[
    {"type":"field","msg":"z_amount_wanted is required","path":"z_amount_wanted","location":"body"},
    {"type":"field","msg":"z_amount_wanted must be an integer","path":"z_amount_wanted","location":"body"}
  ]
}
```

##### 4.1.1.3. ***Unprocessable values:***
```bash
curl -X POST http://localhost:3000/api/v1/water-jug/solve \
     -H "Content-Type: application/json" \
     -d '{
           "x_capacity": "2",
           "y_capacity": "10",
           "z_amount_wanted": "3"
         }'
```
This will produce the following output:
```json
{
  "message":"No solution"
}
```


#### 4.1.2. Algorithm logic
The algorithm used to implement the solution follows an arithmetic approach:
1. To validate if the input can be processed it's checked if the `z-amount-wanted` value is greatest than the greatest value between `x_capacity` and `y_capacity` 
2. The next validation is if the `z_amount_wanted` is divisible by the greatest common divisor found between `x_capacity` and `y_capacity`.

If both validations pass we check if the cache has a result saved to the given input, if not we start to process the inputs.

1. The algorithm follows a sequential approach until the desired state is achieved
2. The main idea is to fill the first bucket, transfer its amount to the second bucket and test if the desired amount is achieved by one of the buckets
3. If it's not it'll fill the first bucket (if it's empty) and empty the second (if it's full)
4. If the result was achieved it'll save the inputs and the result on a cache
5. To find the optimal solution we repeat the process inverting the order of the buckets. 
6. If the second option exceeds the  amount of steps of the first solution we stop the process and assume the first option is the optimal