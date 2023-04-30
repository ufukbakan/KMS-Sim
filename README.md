# KMS-Sim
This is a dockerized, node.js fastify server application which simulates a key management service.

## API:
- /buy/:product_id (payload credit card)
- /activate/:product_id/:key
- /key
  - /listAll
  - /extend/:key {payload credit card}
  - /delete/:key
  - /deleteAll

A credit card payload appears similar to this in body:
```
{
    "number": "1234567890123456",
    "expirationDate": "08/28",
    "CVC": 330
}
```

Also all endpoints require a authentication token in the field "token" of HTTP Header
Sample tokens:
READ_ONLY (EXPIRED) # typical user
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUkVBRF9PTkxZIiwiaWF0IjoxNjQxOTk3NjU0MjcxLCJleHAiOjE1NDczMDMyNTQuMjd9.MGwBchftGKjnwzs-SNfXfFF9DvmLmqO63K5NI9Wk34g
```

READ_ONLY # typical user
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUkVBRF9PTkxZIiwiaWF0IjoxNjQxOTk3NTAxMTQ1LCJleHAiOjE4MzEyOTk5MDEuMTQzfQ.WQtCl-u4hWOG2QBc8CUhH4iXjPVGxwtn3TYu8MVrWc4
```


READ_WRITE (EXPIRED) # administrator
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUkVBRF9XUklURSIsImlhdCI6MTY0MTk5NzY1NDI3MCwiZXhwIjoxNTQ3MzAzMjU0LjI3fQ.yITL2_Q6-kdpM6EbXbPRG0QhaPDxO4ANT7Dv0XW-Fqc
```

READ_WRITE # administrator
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUkVBRF9XUklURSIsImlhdCI6MTY0MTk5NzUwMTE0NSwiZXhwIjoxODMxMjk5OTAxLjE0M30.4ixLwkixIZOQFH1ZfScUKPFVdaoTumtD2SmYzolnAao
```
