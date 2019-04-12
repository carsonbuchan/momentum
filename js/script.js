$(document).ready(function() { 

setuplink = document.querySelector("#clock");
timetextlink = document.querySelector("#timetext");
timelink = document.querySelector("#showtime");
getnamelink = document.querySelector("#getname");
getfocuslink = document.querySelector("#focus");


var picdesc, piccity, piccountry;
  

var focuslist = [];
var focusstatus = [];
focusstatus[0]="NEW";
  

$('#focus').hide();
$('#showtime').hide();
$('#timetext').hide();
  
let username, myfocus,long,lat,city,wicon,wtemp,wcounter=0,wmax=3600,myquote,author;

getLocation();
getWeather();
getRandomBackground();  
getQuote(); 

//Storage
if (localStorage.username)
    {
      $('#clock').hide();
      username=localStorage.getItem('username');
      myfocus=localStorage.getItem('myfocus');
      focuslist[0]=myfocus;
      focusstatus[0]="OK";
       makemefocus();
    }
    else{        
      $( "#getname" ).keypress(function( event ) {
      if ( event.which == 13 ) {
              event.preventDefault();
              username=document.getElementById("getname").value;
          
              localStorage.setItem("username", username);
              $('#clock').hide();
              $('#focus').show();
      }
      });  
      }
              
//get focus
if ((localStorage.focus != "") && (username != "")){
      $('#getfocus').focus();
      $( "#getfocus" ).keypress(function( event ) {
      if ( event.which == 13 ) {
              event.preventDefault();
              myfocus=document.getElementById("getfocus").value;

              localStorage.setItem("myfocus", myfocus);

              focuslist[0]=myfocus;
              focusstatus[0]="OK";
              $('#clock').hide();
              $('#focus').show();
              makemefocus();
      }
      });  
}
   
//delete focus item
$("#displayfocus").on("click", "#del", function () {
          i=0;
          focuslist.splice(i,1);
          localStorage.removeItem('myfocus');
          focusstatus[i]="NEW";
          myfocus = undefined;
          $('#focus').show();
          $('#getfocus').focus();
          $('#showtime').hide();
          $('#showtext').hide();
          $('#displayfocus').hide();
  
          $("#getfocus").keypress(function( event ) {
              if ( event.which == 13 ) {
              event.preventDefault();
              myfocus=document.getElementById("getfocus").value;
              localStorage.setItem("myfocus", myfocus);
              focuslist[0]=myfocus;
              focusstatus[0]="OK";
              $('#displayfocus').show();          
      }
      });          
         
});  
   

//focus items
function makemefocus()
{
  var max=focuslist.length, i, done, del;

  $("#displayfocus").empty().append("TODAY'S FOCUS:");
  for (i=0; i<=0; i++){

      temp = focuslist[i];
      $('#displayfocus').append("<br><i id='done' class='has-text-white far fa-square'></i> " +temp+ " <i id='del' class='has-text-white fas fa-times-circle'></i>");
      focusstatus[i]=="OK";
    }
}

//date and time
function maketime(){
  var h,m,s,c;
  var timeis= new Date();
  h=addZero(timeis.getHours());	
  if (h < 4 || h > 18){
      c="Good evening, "+ username;
    }
  else if (h >=5 && h<=12){
    c="Good morning, "+ username;
  }
  else{
      c="Good afternoon, "+ username;
    }
  
  timetextlink.innerHTML =c;
  if (h>12){
      h=h-12;
    }
  m=addZero(timeis.getMinutes());	
  timeis = h + ":" + m;
  return timeis;
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

//Time Update Every Second
setInterval(function(){ 
    var temp;
    if ((username != undefined) && (myfocus != undefined)){
        $('#focus').hide();
        $('#clock').hide();
        temp=maketime();
        timelink.innerHTML =temp;
        $('#timetext').show();
        $('#showtime').show();
        makemefocus();
        wcounter++;
    }
    
      if (wcounter>=wmax){
        weatherUpdate();
      }
    }, 1000);

//Get background
  function getRandomBackground(){
    var app_id = 'fba66b053360b9beaf303f316ad8fa7d7dc5fa90d114ff42b89a9adca3538be2'
    var url = 'https://api.unsplash.com/photos/random?client_id=' + app_id;    
    $.ajax({
    url: url,
    dataType: 'json',
    success: function(json) {
    var src = json.urls.regular;
    piccountry = json.user.location;
    $('#piclocation').append("Photo location:<br>"+piccountry);  
    $('#selector').css('background-image','url('+src+')').css('background-size','cover');
      }
    });
  }

//Get Long+lat 
function getLocation(){
  let data;
  $.ajax({
  type: 'GET',
  url: 'https://api.ipgeolocation.io/ipgeo?apiKey=3e330fcaf50d4fcb95021e547ddbd1b0',
  data: data,
  async: false,
  beforeSend: function (xhr) {
    if (xhr && xhr.overrideMimeType) {
      xhr.overrideMimeType('application/json;charset=utf-8');
    }
  },
  dataType: 'json',
  success: function (data) {
    long = data.longitude;
    lat = data.latitude;
    city = data.city;
  }
});
}

function weatherUpdate(){
     wcounter=0;
     getWeather();
     getRandomBackground();
     getQuote();
  } 
  
function getWeather(){
  let data,temp;
  temp= "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon="+long+"&units=metric&APPID=2d5e1ba217d5e059868832f1a326fc44";
  $.ajax({
  type: 'GET',
  async: false,
  url: ''+temp,
  data: data,
  beforeSend: function (xhr) {
    if (xhr && xhr.overrideMimeType) {
      xhr.overrideMimeType('application/json;charset=utf-8');
    }
  },
  dataType: 'json',
  success: function (data) {
    wtemp = data.main.temp;
    wtemp = Math.round(wtemp);
    wicon = data.weather[0].icon;
  }
});
   $('#weather').empty().append(""+city+"<br><img src='http://openweathermap.org/img/w/"+wicon+".png'>"+wtemp+"&deg;C");          
}  

//Get quote
function getQuote(){
  let data;
  temp= "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1";
  $.ajax({
  type: 'GET',
  url: ''+temp,
  data: data,
  async: false,
  beforeSend: function (xhr) {
    if (xhr && xhr.overrideMimeType) {
      xhr.overrideMimeType('application/json;charset=utf-8');
    }
  },
  dataType: 'json',
  success: function (data) {
    myquote = data[0].content;
    author = data[0].title;
  }
});
   $('#quote').empty().append(""+myquote+" -"+author);          
}    
});

