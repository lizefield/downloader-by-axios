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
