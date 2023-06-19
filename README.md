# biteSpeedBackend

biteSpeedBackend Service

# Setup for Docker

1. Install Docker Desktop in your machine(macOS) [ref](https://docs.docker.com/desktop/install/mac-install/)
2. After installaton this command `docker --version` should give a proper version.
3. run `docker pull mysql:latest` it will pull the latest mysqlVersion.
4. run `docker run --name mysql-container -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mahesh -e MYSQL_DATABASE=biteSpeedDB -d mysql:latest` this will create an mysql:latest container named as mysql-container.  
IMPORTANT: if you change any conifg such as password or database name or port make changes in `src/database/MySql.ts`.
5. run `docker ps` to see if our mysql server is up or not. You should get a row containing our new server. If not got to the docker desktop and delete all the containers that are running and restart from step 4.
6. mysql server is up at port 3306.

# Steps to Start the service

1. Setup Docker for MySQL database.
2. Run the service locally by following next steps:  
   a. run `npm install` (it installs all the required packages). 
   b. run `npm run createTable` (it will create the table in sql server). 
   c. run `npm run start` (it will start the server at [localhost](http://localhost:3000/)). 
3. To hit the api in Postman where you can use `http://localhost:3000/identify/` endpoint.  
  - OR.   
    Curl command to hit the api:  
    `curl --location 'http://localhost:3000/identify/' \
--header 'Content-Type: application/json' \
--data-raw '{
	"email": "mcfly@hillvalley.edu",
	"phoneNumber": null
}'`

# Tools and their Versions

1. Node.js v18.15.0.
2. Docker version 20.10.16
