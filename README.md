# Instagram Search Web App

### It isn't possible anymore to search Instagram's API by tag

So instead I've changed the code to display my own Instagram
feed, using a service called [BitSalad](http://bitsalad.co)

And here's how you can load your own media with just a few lines of JavaScript:

```html

<html>
<body>
<!--This requires a bitsalad URL (www.bitsalad.co) for your instagram feed, and append ?callback=_i to the URL.-->
<div id='instagram-feed'></div>

<script>
(function(a,b,c,d){
  var $ = b.getElementById('instagram-feed');
  a['_i'] = function(d){
    d.forEach(function(i, x){
      html = "<img src='"+i.images.standard_resolution.url+"' />";
      $.insertAdjacentHTML('beforeend', html);
    })
  };
  var e = b.createElement(c);
  e.src = d;
  e.async=1;
  var f = b.getElementsByTagName(c)[0];
  f.parentNode.insertBefore(e,f);
}(window, document, 'script','http://api.bitsalad.co/v1/feeds/9?callback=_i'))
</script>

</body>
</html>
```
