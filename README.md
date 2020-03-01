# unblogio

https://unblog.io is a social blogging network. It emphasizes adfree and community centric content creation for everyone.

see: https://unblog.io/#/blog/anon767/First%20Post

## Prerequisites

1. PostgreSQL Database
2. Go (tested with 1.11.x and 1.12.x)
3. NodeJS

## Install Backend

1. Clone this repo
2. Move the backend to your $GOPATH
3. Compile it
```bash
go get
go build
```
4. Adjust the config.json
5. Create the image folder
```
mkdir data
```
6. Start the Server
```bash
./unblog ./config.json
```

## Install Frontend

1. Adjust the Server IP in vue.config.js
2. Install dependencies
```bash
npm install
```
3. Compile Frontend
```bash
npm run build
```
