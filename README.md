# Project Configuration

Before running this project, you need to configure and run a few things on both client and server.

## Client Configuration

Run this command in the terminal to install packages:
```
npm install
```

### Server Hostname And Socket Configuration

Open file constants.jsx in the director: client/src/utils and edit the information as shown in the example below:

```
SERVER_HOST: The server hostname for example: "http://localhost:8080/api/v1"
SOCKET_HOST: The server socket hostname for example: "http://localhost:8080"
```

### Start The Client

Run the following command in the terminal to start the client:
```
npm run dev
```


## Server Configuration

Run this command in the terminal to install packages:
```
npm install
```

### Environment Variables Setup

Create a .env file in the server folder or rename the .env.example file to .env and input or edit information as shown in the example below:

#### General
```
NODE_ENV: The environment mode you want (e.g., development, production)
CLIENT_DOMAIN: The client-side domain
SERVER_HOST: Server hostname
SERVER_PORT: Server port
```

#### JSON Web Token (JWT) Configuration
```
JWT_ACCESS_SECRET: Secret key for JWT access tokens
JWT_ACCESS_EXPIRE_TIME: Expiration time for JWT access tokens
JWT_REFRESH_SECRET: Secret key for JWT refresh tokens
JWT_REFRESH_EXPIRE_TIME: Expiration time for JWT refresh tokens
```

#### Database Configuration

##### MySQL
```
MYSQL_USERNAME: Username for the MySQL database
MYSQL_PASSWORD: Password for the MySQL database
MYSQL_DATABASE: MySQL database name
MYSQL_HOST: Hostname for the MySQL database
MYSQL_PORT: Port for the MySQL database
```
##### MongoDB
```
MONGODB_USERNAME: Username for the MongoDB database
MONGODB_PASSWORD: Password for the MongoDB database
MONGODB_DATABASE: MongoDB database name
MONGODB_HOST: Hostname for the MongoDB database
MONGODB_PORT: Port for the MongoDB database
MONGODB_BUCKET: MongoDB bucket name
```

#### Mail Configuration
```
NODEMAILER_GOOGLE_EMAIL: Email address for sending emails via Nodemailer (Google)
NODEMAILER_APP_PASSWORD: App password for Nodemailer (Google)
```

#### Admin Account Configuration
```
ADMIN_EMAIL: Email address for the admin user
ADMIN_PASSWORD: Password for the admin user
```

#### External Services
```
CLARIFAI_API_KEY: API key for the Clarifai service
CLARIFAI_MODEL_ID: Model ID for the Clarifai service
```
#### File Size Limits
```
IMAGE_FILE_SIZE_LIMIT: Maximum allowed size for image files
AVATAR_FILE_SIZE_LIMIT: Maximum allowed size for avatar files
```

### Migrating Database

Run the following command in the terminal to migrate the database:
```
npm run migrate:up
```
To add fake data to the database (optional), run the following command in the terminal:
```
npm run seed:up:all
```
To undo all migrations (optional), run the following command in the terminal:
```
npm run migrate:down:all
```
If you only want to undo fake data (optional), run the following command in the terminal:
```
npm run seed:down:all
```
### Start The Server

Run the following command in the terminal to start the server:
```
npm run dev
```

# Preview

Below are some screenshots of the web:

&nbsp; 
![Login page](https://drive.google.com/uc?export=view&id=1SNWqOYz2JQLXLIOHsBstjblHScBhcYxn "Home page") 
&nbsp;

&nbsp;
![Detail page](https://drive.google.com/uc?export=view&id=1pvTc3MQPx9vqFxwQmCRaed7-38zjhweR "Detail page") 
&nbsp;

&nbsp;
![Admin pick page](https://drive.google.com/uc?export=view&id=1kgXDtVW1tfmsFNMA0H0Mpy1nzrR-_DYU "Admin pick page")
&nbsp;

&nbsp;
![Topic articles page](https://drive.google.com/uc?export=view&id=18RPXK3YemuL6-N3kKxcFbVj48GusWOeN "Topic articles page")
&nbsp;

&nbsp;
![Profile page](https://drive.google.com/uc?export=view&id=18RL0_8n9ebE41K1J7qpM9d0dt9HAbjIp "Profile page")
&nbsp;

&nbsp;
![Dashboard page](https://drive.google.com/uc?export=view&id=1NPaslS62dJOvJpKbqB1eCcLzGdyh06Tz "Dashboard page")
&nbsp;
