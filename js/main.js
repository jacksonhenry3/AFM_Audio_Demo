$(document).keydown(function(event){

  charachter = String.fromCharCode(event.keyCode).toLowerCase()
  if (charachter == "½") {
    charachter = "-"
  }
    $(".key:contains(" + charachter+")").css("box-shadow", "0px 0px 0px #222");
    $(".key:contains(" +charachter+")").css("background", "rgba(255, 255, 255, .7)");
    $(".key:contains(" +charachter+")").css("top", "2px");
    $(".key:contains(" +charachter+")").css("left", "2px");

});

$(document).keyup(function(event){
  charachter = String.fromCharCode(event.keyCode).toLowerCase()
  if (charachter == "½") {
    charachter = "-"
  }
    $(".key:contains(" + charachter+")").css("box-shadow", "2px 2px 5px #222");
    $(".key:contains(" + charachter+")").css("background", "rgba(255, 255, 255, 0.5)");
    $(".key:contains(" +charachter+")").css("top", "0px");
    $(".key:contains(" +charachter+")").css("left", "0px");

});




$(".key").bind("touchstart mousedown",function(){

  charachter = this.innerHTML
    $(".key:contains(" + charachter+")").css("box-shadow", "0px 0px 0px #222");
    $(".key:contains(" +charachter+")").css("background", "rgba(255, 255, 255, .7)");
    $(".key:contains(" +charachter+")").css("top", "2px");
    $(".key:contains(" +charachter+")").css("left", "2px");

});


$(".key").bind("touchend mouseup",function(){

  charachter = this.innerHTML
  $(".key:contains(" + charachter+")").css("box-shadow", "2px 2px 5px #222");
  $(".key:contains(" + charachter+")").css("background", "rgba(255, 255, 255, 0.5)");
  $(".key:contains(" +charachter+")").css("top", "0px");
  $(".key:contains(" +charachter+")").css("left", "0px");
});
