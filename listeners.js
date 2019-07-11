



$("#myRange").bind("touchend mouseout", stopFreqSlider());
$("#myRange").bind('input', startFreqSlider());
$(document).bind("keydown", keydown(event))
$(document).bind("keyup", keyup(event))
$(".key").bind("touchend mouseup", clickEnd());
$(".key").bind("touchstart mousedown", clickStart())
