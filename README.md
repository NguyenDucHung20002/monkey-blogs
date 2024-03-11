# Website blog Hosts Monkey-Medium

## Setup Guide
- Sign up on [Google Cloud](https://console.cloud.google.com/) and visit API Keys section to get your API key and Secret key.
- similar to [Clarify](https://clarifai.com/)

### Requirements
- [Nodejs](https://nodejs.org/en/download)
- [Mongodb](https://www.mongodb.com/docs/manual/administration/install-community/)
- [MySQL](https://dev.mysql.com/downloads/installer/)

>All should be installed and make sure MongoDB and MySQL are running.

## Run the App

## Step 1: Clone the project

FontEnd
```
https://github.com/NguyenDucHung20002/monkey-medium.git monkey-medium-fontend
```
BackEnd
```
git clone -b backend --single-branch https://github.com/NguyenDucHung20002/monkey-medium.git monkey-medium-backend
```

## Step 2: Copy the .env.example file to .env file. (Only backend)
Open your favorite code editor and copy `.env.example` to `.env` file.
```
cp.env.example.env
```
## Step 3: Modify .env file(Only backend)
Add your key

Ex:

>OAUTH_GOOGLE_CLIENT_ID = "your key"

>OAUTH_GOOGLE_CLIENT_SECRET = "your key"

## Step 4: Install the dependencies (Both FE BE )
Install all the dependencies to run the project.
```
npm install
```
## Step 5: Run the App (Both FE BE )
Bingo, it's time to push the launch button.
```
npm run start
```
