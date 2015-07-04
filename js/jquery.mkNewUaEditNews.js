/*! Copyright (c) 2014 Max Kulyaev (Максим Куляев) 1audiodesign@gmail.com
 * Licensed under the MIT License (LICENSE.txt).
 * jquery.mkNewUaEditNews
 * Version: 1.0
 */
;(function ( $, window, document, undefined ) {
    var pluginName = 'mkNewUaEditNews',
        defaults = {
        	orderType:'stripe',
        	action:'ajax',
            orderId: 0,
            ci:0,
            pi:0,
            om:0,
            os:0,
            of:0,
            audioPath: "http://media.preambula.com/newOrder.mp3"
        };
    // конструктор плагина
    function Plugin( element, options ) {
        var widget=this;
        widget.element = element;
     //   widget.metadata = widget.element.data('mkorder');
        widget._defaults = defaults; 
        widget.config = $.extend( {}, defaults, options, widget.metadata) ;       
        widget._name = pluginName;
        $.each(widget.config,function(key,val){
    	     	if(typeof val==='function'){
    		     	widget.element.one(key+'.'+widget._name,function(){return val(widget.element)});
    	     	}
  	     });
        this.init();
    }

       

    Plugin.prototype.reloadImg = function(){
        var widget=this,
        	pim='',
        	pib='',
        	pic='',
            d = new Date();
            pib="http://media.preambula.com/images/orderImages/"+widget.config.orderId+"/b.png";
            pic="http://media.preambula.com/images/orderImages/"+widget.config.orderId+"/c.png";
            pibt=pib+'?'+d.getTime();
            pict=pic+'?'+d.getTime();
            $('#orderPictureImg', widget.element).attr("src",pibt);
            $('.orderStripe').each(function(){
	            if($(this).data('mkorder').orderId==widget.config.orderId){
		            $('.imgSmall',this).attr("src",pict);
	            }
            });                 
    };//END OF Plugin.prototype.reloadImg  
      
    Plugin.prototype.imgUrl = function(e){ //Загрузить картинку по ссылке
        var widget=this,
        productImg=$.trim(widget.element.find('#obPictureLink').val().split('_.webp')[0]);
        if(!productImg.split('http://')[1] && 'Загружена локально'!=productImg){
	        productImg='http://'+productImg;
        }
        widget.element.find('#obPictureLink').val(productImg);
        if('Загружена локально'!=productImg){
            $.ajax({
                type:"POST",
                url:'../controllers/order.controller.php',
                data:{
                    orderId:widget.config.orderId,
                    imgUrl:productImg
                    }
            }).done(function(data){               
                    if('error'==data){
                        $('#mkCondition').mkCondition({color:'red',icon:'false'}); 
                    }
                    else{
                        if(''!=productImg){
                            //widget.presentImg('show');
                        }
                        else{
                            //widget.presentImg('hide');
                        }
                        widget.reloadImg(); 
                        $('#mkCondition').mkCondition({color:'green',icon:'true'});                                         
                    }      
            }).fail(function(){
                    //$(window).mkBubble(e,{content:'ошибка клиента'});
            });            
        }
                         
    };//END OF Plugin.prototype.imgUrl   
      
 
          
    Plugin.prototype.setToSumm = function(e,obj){
        var widget=this,  
        	orderToSumm= (!obj.hasClass("checked")) ? 1 : 0;
        obj.toggleClass('checked');
        $.ajax({
            type:"POST",
            url:'../controllers/order.controller.php',
            dataType:'json',
            data:{orderId:widget.config.orderId,orderToSumm:orderToSumm}
        }).done(function(data){
	            if(!data.error){	            
		            $('#mkCondition').mkCondition({color:'green',icon:'true'});
		            $('#headerLoggedWalletVal').text(data.wallet);
		            $('#headerLoggedBasketVal').text(data.basket);
	            }
	            else{
	            	if("sql" == data.error){
		            	$('#mkCondition').mkCondition({color:'red',icon:'false'});
	            	}
	            }        
 
        }).fail(function(){
                 $(window).mkBubble(e,{content:'ошибка клиента'});
        });
    };//END OF Plugin.prototype.setToSumm 
    
    
    Plugin.prototype.setProductEnsure= function(e,obj){
        var widget=this,  
        	productEnsure= (!obj.hasClass("checked")) ? 1 : 0;
        obj.toggleClass('checked');
        $.ajax({
            type:"POST",
            url:'../controllers/order.controller.php',
            dataType:'json',
            data:{orderId:widget.config.orderId,productEnsure:productEnsure}
        }).done(function(data){
	            if(!data.error){
		            $('#mkCondition').mkCondition({color:'green',icon:'true'});
		            widget.math();
		            widget.refreshOrderStripe(widget.config.orderId,data);
		         	
	            }
	            else{
		            $('#mkCondition').mkCondition({color:'red',icon:'false'});
	            }  
        }).fail(function(){
                 $(window).mkBubble(e,{content:'ошибка клиента'});
        });
    };//END OF Plugin.prototype.setProductEnsure  
    
    Plugin.prototype.setProductCheck= function(e,obj){
        var widget=this,  
        	productCheck= (!obj.hasClass("checked")) ? 1 : 0;
        obj.toggleClass('checked');
        $.ajax({
            type:"POST",
            url:'../controllers/order.controller.php',
            dataType:'json',
            data:{orderId:widget.config.orderId,productCheck:productCheck}
        }).done(function(data){
	            if(!data.error){
		            $('#mkCondition').mkCondition({color:'green',icon:'true'});
		            widget.math();
		            widget.refreshOrderStripe(widget.config.orderId,data);		         	
	            }
	            else{
		            $('#mkCondition').mkCondition({color:'red',icon:'false'});
	            }  
        }).fail(function(){
                 $(window).mkBubble(e,{content:'ошибка клиента'});
        });
    };//END OF Plugin.prototype.setProductCheck      
    
  
  
    Plugin.prototype.setHidden = function(e,obj){
        var widget=this,
        	orderHidden= (!obj.hasClass('selected')) ? 1 : 0;
        	obj.toggleClass('selected');
        $.ajax({
            type:"POST",
            url:'../controllers/order.controller.php',
            data:{orderId:widget.config.orderId,orderHidden:orderHidden}
        }).done(function(data){
                if('error'==data){
	                $('#mkCondition').mkCondition({color:'red',icon:'false'});
                }
                else{
	                $('#mkCondition').mkCondition({color:'green',icon:'true'});
                }  
        }).fail(function(){
                 $(window).mkBubble(e,{content:'ошибка клиента'});
        });
        
    };//END OF Plugin.prototype.setHidden   
       
    Plugin.prototype.orderSave = function(e){
        var prop=$('#main').data('mkprop');
            var widget=this,
                orderName=$.trim(widget.element.find('#obProductName').val()),
                productPage=$.trim(widget.element.find('#obProductLink').val()),
                productSeller=$.trim(widget.element.find('#obSellerLink').val().split('?')[0]),
                noteCustomer=$.trim(widget.element.find('#obDescription').val()),
                noteProvider=$.trim(widget.element.find('#adminMessageInput').val()),
                productPriceMain=$.trim(widget.element.find('#obProductPriceChina').val()),
                productPriceDelivery=$.trim(widget.element.find('#obDeliveryChina').val()),
                productQty=$.trim(widget.element.find('#obProductQty').val()),
                productWeight=$.trim(widget.element.find('#obProductWeight').val()),
                productPriceFinal=$.trim(widget.element.find('#obProductPriceFinal').val()); 
                productQty=(0>=productQty)?1:productQty;    
            $.ajax({
                type:"POST",
                url:'../controllers/order.controller.php',
                data:{
                    orderModify:true,
                    orderId:widget.config.orderId,
                    orderNameModify:orderName,
                    productPageModify:productPage,
                    productSellerModify:productSeller,
                    noteCustomerModify:noteCustomer,
                    noteProviderModify:noteProvider,
                    productPriceMainModify:productPriceMain,
                    productPriceDeliveryModify:productPriceDelivery,
                    productQtyModify:productQty,
                    productWeightModify:productWeight,
                    productPriceFinalModify:productPriceFinal
                    }
            }).done(function(data){       
                //widget.element.find('.orderSumm').html($.trim($('.orderBodySumm',widget.element).text()));          
                    if('error'==data){
                        $('#mkCondition').mkCondition({color:'red',icon:'false'});
                    }
                    else{
                        $('#mkCondition').mkCondition({color:'green',icon:'true'});
                        //$('.lastModified',widget.element).text(data);
                        widget.element.find('#buttonToProduct').attr({'href':productPage});
                        widget.element.find('#buttonToSeller').attr({'href':productSeller});
                        //widget.element.find('.orderName').html(orderName);
                       // getOrdersSumm(e);                                           
                    }      
            }).fail(function(){
                   $('#mkCondition').mkCondition({color:'red',icon:'false'});
            });                  
    };//END OF Plugin.prototype.orderSave    
          
    Plugin.prototype.bindAll = function(){
        var widget=this;
        $('#mainNews').unbind().bind('click',function(e){
        	//widget.getPrevNext(e,'prev',widget.config.orderId);   
        	alert('eeee');
    }); 
		$('a.file-folder').unbind().click(function(){
			$(this).parent().find('input[name="post_file"]').click();
		}); 
		
		
            $('#newsImgFolderInput').unbind().mkUpload({
                rename:'newname',//Новое имя файла
                targetPath:'/media/news/junk/',//Путь,куда кладем файл
                mkFolder:'folderName',//создаем папку в том пути,елси нужно
                image:800,//Если файл картинка и мы хотим задать размер
                //filetypes: ['jpg','png'],//Типы файлов,которые можно добавлять
                controller:'../controllers/upload.controller.php',
                serverData:function(uploadWidget){
                    if('error'!=uploadWidget.config.serverData){
	                    //callback
                    }
                    else{
                    }
               }
            });		
		
		
		
		 

    };//END OF Plugin.prototype.bindAll                                          
    Plugin.prototype.init = function () {         
        var widget=this;
        
        widget.bindAll();
	                                                                                                                        
    };//END OF INIT
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            new Plugin( $(this), options );
        });
    }
})( jQuery, window, document );
