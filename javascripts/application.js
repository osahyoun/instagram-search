// Instantiate an empty object.
var Instagram = {};

// Small object for holding important configuration data.
Instagram.Config = {
  clientID: 'a307c0d0dada4b77b974766d71b72e0e',
  apiHost: 'https://api.instagram.com'
};

// Quick and dirty templating solution.
Instagram.Template = {};
Instagram.Template.Views = {

  "photo": "<div class='photo'>" +
            "<a href='{url}' target='_blank'><img class='main' src='{photo}' width='250' height='250' style='display:none;' onload='Instagram.App.showPhoto(this);' /></a>" +
            "<img class='avatar' width='40' height='40' src='{avatar}' style='' onload='' />" +
            "<span class='heart'><strong>{count}</strong></span>" +
          "</div>"
};

Instagram.Template.generate = function(template, data){
  var re, resource;
  
  template = Instagram.Template.Views[template];
  for(var attribute in data){
    re = new RegExp("{" + attribute + "}","g");
    template = template.replace(re, data[attribute]);
  }
  return template;
};

// ************************
// ** Main Application Code
// ************************
(function(){
  
  function init(){
    bindEventHandlers();
  }
  
  function toTemplate(photo){
    photo = {
      count: photo.likes.count,
      avatar: photo.user.profile_picture,
      photo: photo.images.low_resolution.url,
      url: photo.link
    };
    
    return Instagram.Template.generate('photo', photo);
  }  
  
  function toScreen(photos){
    var photos_html = '';

    $('.paginate a').attr('data-max-tag-id', photos.pagination.next_max_id)
                    .fadeIn();
    
    $.each(photos.data, function(index, photo){
      photos_html += toTemplate(photo);
    });

    $('div#photos-wrap').append(photos_html);
  }
  

  function generateResource(tag){
    var config = Instagram.Config, url;
    
    if(typeof tag === 'undefined'){
      throw new Error("Resource requires a tag. Try searching for cats!");
    } else {
      // Make sure tag is a string, trim any trailing/leading whitespace and take only the first 
      // word, if there are multiple.
      tag = String(tag).trim().split(" ")[0];
    }

    url = config.apiHost + "/v1/tags/" + tag + "/media/recent?callback=?&client_id=" + config.clientID;

    return function(max_id){
      var next_page;
      if(typeof max_id === 'string' && max_id.trim() !== '') {
        next_page = url + "&max_id=" + max_id;
      }
      return next_page || url;
    };
  }
  
  function paginate(max_id){    
    $.getJSON(generateUrl(tag), toScreen);
  }

  function search(tag){
    resource = generateResource(tag);
    $('.paginate a').hide();
    $('#photos-wrap *').remove();
    fetchPhotos();
  }

  function fetchPhotos(max_id){
    $.getJSON(resource(max_id), toScreen);
  }

  function bindEventHandlers(){
    $('body').on('click', '.paginate a.btn', function(){
      var tagID = $(this).attr('data-max-tag-id');
      fetchPhotos(tagID);
      return false;
    });
    
    // Bind an event handler to the `click` event on the form's button
    $('form#search button').on('click', function(){
      // Extract the value of the search input text field.
      var tag = $('input.search-tag').val();

      // Invoke `search`, passing `tag`.
      search(tag);

      // Stop event propagation.
      return false;
    });
    
  }

  function showPhoto(p){
    $(p).fadeIn();
  }

  Instagram.App = {
    search: search,
    showPhoto: showPhoto,
    init: init
  };
})();

$(function(){
  Instagram.App.init();
  
  // Start with a search on cats; we all love cats.
  Instagram.App.search('cats');  
});

