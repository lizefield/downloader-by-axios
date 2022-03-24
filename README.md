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
