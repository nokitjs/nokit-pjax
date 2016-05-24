A pajax server support module

### install
```sh
npm install nokit-pjax --save
```

### server
```js
{
    ...
    "filters":{
        "^/":"nokit-pjax"
    },
    "folders":{
        "public":{
            "^/pjax/(.*)$": "./node_modules/nokit-pjax/client"
        }
    }
    ...
}
```

### client
```html
...
<head>
     <link rel="stylesheet" href="/client/pjax.min.css" />
     <script src="/js/jquery.js"></script>
     <script src="/pjax/pjax.min.js"></script>
</head>
<a href="./index" data-pjax-container="#info">index</a> | 
<a href="./test" data-pjax-container="#info">test</a>
<br/>
<div id="info">
    index
</div>
...
```