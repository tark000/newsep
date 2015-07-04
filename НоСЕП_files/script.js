$(document).ready(function(){
    var currentPosition = 0;
    var slideWidth = 800;
    var numOfItems = 6;
    var slides = $('#items .item');
    var numberOfSlides = Math.ceil(slides.length / numOfItems ) +1;


    $('#items').css('overflow', 'hidden');

    newwith = (slideWidth) * ( numberOfSlides ) + 150 ;

    slides.parent()
        .wrapAll('<div id="slideInner"></div>')

        .css({
            'float' : 'left',
            'width' : newwith
        });

    manageControls(currentPosition);


    $('.control')
        .bind('click', function(){
            currentPosition = ($(this).attr('id')=='rightControl') ? currentPosition+1 : currentPosition-1;
            manageControls(currentPosition);
            $('#slideInner').animate({
                'marginLeft' : slideWidth*(-currentPosition)
            });
        });


    function manageControls(position){
        if(position==0){ 
            $('#leftControl > div').hide();  
        } else{ 
            $('#leftControl > div').show(); 
        }
        if(position==numberOfSlides-1){ 
            $('#rightControl > div').hide();  
        } else{ 
            $('#rightControl > div').show();
        }
    }
    
    
    

if($("#cbp-contentslider").length){
    $( '#cbp-contentslider' ).cbpContentSlider();

}	

				

var dates = $("#from, #to").datepicker({
  //defaultDate: "+1w",
  maxDate: 0,
  dateFormat: "dd/mm/yy",
  changeMonth: true,
  numberOfMonths: 1,
  onSelect: function(selectedDate){
    var option = this.id == "from" ? "minDate" : "maxDate",
    instance = $( this ).data( "datepicker" ),
    date = $.datepicker.parseDate(
      instance.settings.dateFormat || $.datepicker._defaults.dateFormat,
      selectedDate, instance.settings);
    dates.not(this).datepicker("option", option, date);
    //get_news_period();
  }
});		
   
    
});

function get_news_period(){
  var from = $("#from").val(), to = $("#to").val();
  if(from!='' && to!=''){
    action = "get_newsperiod";
  }else  action = "get_newsdefault";
  $.ajax({
        type: "post",
        url: "/controllers/site.controller.php",
        data: {from:from, to:to, action: action}
    }).done(function(obj){
        $('#colnews').html(obj); 
    });
  
}
function clearDate(){
    $("#from, #to").val('');
    get_news_period();
}
