/*! Copyright (c) 2013 Max Kulyaev (Максим Куляев) 1audiodesign@gmail.com
 * Licensed under the MIT License (LICENSE.txt).
 * jquery.mkLogin
 * Version: 1.0
 */
;(function ( $, window, document, undefined ) {
    var pluginName = 'mkLogin',
        defaults = {
            userSalt: "preambula"
        };

    // конструктор плагина
    function Plugin( element, options ) {
        var widget=this;
        widget.element = element;
        widget.config = $.extend( {}, defaults, options) ;
        widget._defaults = defaults;
        widget._name = pluginName;
        $.each(widget.config,function(key,val){
    	     	if(typeof val==='function'){
    		     	widget.element.on(key+'.'+widget._name,function(){return val(widget)});
    	     	}
  	     });
        this.init();
    }
    //засолка
    Plugin.prototype.getSaltedHash=function(password, salt, iterationCount){
			var saltedHash = password;
			if (iterationCount < 1) iterationCount = 1;
			for (var i=0; i<iterationCount; i++)
				saltedHash = hex_md5(salt + saltedHash);
			return saltedHash;
    };//END OF getSaltedHash      
    
    
    Plugin.prototype.filled=function(){
        var widget=this,email,pass;
        email=$.trim($('#loginEmail').val());
        pass=$.trim($('#loginPass').val());
        if(''==email || ''==pass){
            return false;
        }
        else{
            return true;
        }
    };//END OF login  
     
    Plugin.prototype.sendResetPassword=function(email){
        
        var widget=this;
        $.ajax({
            type:"POST",
            url:"../controllers/user.controller.php",
            data:{resetPass:email}
        }).done(function(data){
            if('sended'==data){
                alert('На почтовый адрес высланы инструкции по смене пароля');
                
            }
            if('notExists'==data){
                var email2=prompt('Проверьте адрес. Такого пользователя не существует!',email).trim();
                
                if(''!=email2){
                   sendResetPassword(email2); 
                }                                
            }            
        }).fail(function(){
    		$(window).mkBubble(e, {
    			content: "ошибка клиента"
    		})            
        });         
        
    };//END OF endResetPassword      
    Plugin.prototype.login=function(e){
        var widget=this,email,pass;
            userEmail=$.trim($('#loginEmail').val()),
            userPass=widget.getSaltedHash($.trim($('#loginPass').val()),widget.config.userSalt,5),
            userRemember=($('#loginRemember').prop("checked")) ? 1 : 0;

            if(''!=userEmail && ''!=userPass){
                $.ajax({
                    type:"POST",
                    url:'../controllers/user.controller.php',
                    dataType:'json',
                    data:{
                        userEmail:userEmail,
                        userPass:userPass,
                        userRemember:userRemember
                        }    
                }).done(function(data){
            if(0==userRemember){
               // $('.logInField').val('');
            }                    
                    if('notExists'!=data.id){
                        logged();
                        $(window).mkBubble(e,{content:'привет!'});                        
                        //getNewOrders(e);
                        document.location.reload(true);                     
                    }
                    else{
                        alert('пользователя не существует');
                    }      
                }).fail(function(){
                        $(window).mkBubble(e,{content:'ошибка клиента'});
                });                
                                 
            }                        
    };//END OF login
    Plugin.prototype.register=function(){
        var widget=this,email,pass,emailExists;
            userEmail=$.trim($('#loginEmail').val()),
            userPass=widget.getSaltedHash($.trim($('#loginPass').val()),widget.config.userSalt,5),
            userRemember=($('#loginRemember').prop("checked")) ? 1 : 0;
            if(0==userRemember){
               // $('.logInField').val('');
            }
            if(''!=email && ''!=pass){
                $.ajax({
                    type:"POST",
                    url:'../controllers/user.controller.php',
                    dataType:'json',
                    data:{
                        registerEmail:userEmail,
                        registerPass:userPass
                        }    
                }).done(function(data){
                    if('exists'!=data.error){
                        alert("На почту выслано письмо для подтверждения. Если не видите письма, не забудьте проверить папку «СПАМ».");                  
                    }
                    else{
                        //alert("Такой пользователь уже существует! <a id='logInForgot' href='#'>Напомнить пароль?</a>");
                        emailExists=prompt("Такой пользователь уже существует! Выслать форму сброса пароля на этот адрес?",userEmail).trim();
                        if(''!=emailExists){
                            widget.sendResetPassword(emailExists);
                        }                        
                        
                    }      
                }).fail(function(){
                        $(window).mkBubble(e,{content:'ошибка клиента'});
                });                
                                 
            }          
    };//END OF register    
    
    Plugin.prototype.init = function () {
        var widget=this;
        widget.element.trigger('before.'+widget._name);
        $('#logInRegister',widget.element).hide();
        $('#logInRegisterLabel',widget.element).unbind().bind('click',function(e){
            $(this).toggleClass('selected');
            if($(this).hasClass('selected')){
                $('#rememberBlock',widget.element).hide();
            }
            else{
                $('#rememberBlock',widget.element).show();
            }
            return false; 
        }); 
        $('#logInButton',widget.element).unbind().bind('click',function(e){
            if($('#logInRegisterLabel',widget.element).hasClass('selected')){
                widget.register(e);
            }
            else{
                widget.login(e);
            }
        }); 
        $('#logInForgot',widget.element).unbind().bind('click',function(e){
            var email=prompt("Введите e-mail, под которым регисмтрировались для сброса пароля").trim();
            if(''!=email){
                widget.sendResetPassword(email);
            }
            return false;	
        });
        
        $('#changePasswordButton',widget.element).unbind().bind('click',function(e){
        	var newPass=$('#newPass',widget.element).val(),
        		newPassConfirm=$('#newPassConfirm',widget.element).val();
        	if(''==newPass || newPass!=newPassConfirm){
        			$(window).mkBubble(e,{
        				content: "Поля не заполнены или не совпадают!"
        			});
                    return false;				
        	}	
        });          
        
        
                     
        widget.element.trigger('callback.'+widget._name); 
    };//END OF INIT
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            new Plugin( $(this), options );
        });
    }
})( jQuery, window, document );