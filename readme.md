A pajax server support module

### install
```sh
npm install nokit-pjax -save
```

### server
```js
{
    "filters":{
        "^/":"nokit-pjax"
    }
}
```

### client
```html
<a href="./index" data-pjax-container="#info">index</a> | 
<a href="./test" data-pjax-container="#info">test</a>
<br/>
<div id="info">
    index
</div>
```