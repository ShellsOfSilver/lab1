```
SERVER_HOSTNAME=127.0.0.1
SERVER_PORT=3000
DATABASE_URL=mongodb://127.0.0.1/nodeauth
JWTSECRET=rickandmorty
```

server start up:

1. npm install
2. mongod
3. npm start

# API Routes

## Signup
url:
```
http://localhost:3000/api/users/signup
```
method:
```
POST
```
body:
```
{
  "email": "gustavo.morales@gmail.com",
  "password": "PASSWORD"
}
```
response: 
```
{
  "success": true,
  "item": {
    "password": "PASSWORD",
    "email": "gustavo.morales@gmail.com",
  },
}
```

## Signin
url:
```
http://localhost:3000/api/users/signin
```
method:
```
POST
```
body:
```
{
  "email": "gustavo.morales@gmail.com",
  "password": "PASSWORD"
}
```