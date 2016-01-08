A pajax server support module

### install
```sh
npm install nokit-pjax -save
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
            "client/pjax.js$": "./node_modules/nokit-pjax"
        }
    }
    ...
}
```

### client
```html
...
<head>
     <script src="client/pjax.js"></script>
</head>
<a href="./index" data-pjax-container="#info">index</a> | 
<a href="./test" data-pjax-container="#info">test</a>
<br/>
<div id="info">
    index
</div>
...
```