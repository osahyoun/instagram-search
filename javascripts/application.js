(function(){

  var showPhoto = function(photo) {
    var html = Tlite.find($('#photo-template').html(), photo);
    $('div#photos-wrap').append(html);
  };

  var process = function(photos){
    photos.forEach(showPhoto);
  };

  var run = function() {
    var url = "http://api.bitsalad.co/v1/feeds/9?callback=?"
    $.getJSON(url, process);
  };

  run();
}());
