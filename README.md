# Download by Axios

## setup

- `npm i`  
- create `.env` from `.env.sample`  

## exec

```
node download.js <Target URL> <Hostname> <Uuid>
```

`Hostname` is part of URL.  
`Uuid` is unique ID each pages.  

## exec (save to aws s3)

```
aws-vault exec <Profile> -- node download.js <Target URL> <Hostname> <Uuid>
```

`Profile` is your aws profile.  

## exec (forever)

- [forever](https://github.com/foreversd/forever)

create `.forever/config.json`  

```
npm install forever -g
forever start .forever/config.json
```

```
forever list
forever stop <index>
```

## exec (pm2)

```
npm install pm2 -g
pm2 start -i 0 api.js --name download-api
```

```
pm2 logs
pm2 flush
```

```
pm2 list
pm2 delete download-api
```
