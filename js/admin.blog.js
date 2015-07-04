$('.file-folder').click(function(){
    $(this).next('input').click(); 
    return false; 
});

function myPostHendler(data,url,elem){
    if(typeof data != 'undefined'){
    jsonObj = JSON.parse(data);
    if(jsonObj.size==true){
        elem.parent().find('img').attr('src',url+jsonObj.img + "?" + new Date().getTime());//;
        elem.parent().find('.dellphoto').removeClass('hide');
    }else{ alert('Image is small. Shoose larger image.')}
    }
}
function myPostHendler3(data,url,rename){
    if(rename=='file'){
        var jsonObj=[],
    elem=$('#blogsMainFileFolderInput'),
    time = new Date().getTime();
    if(data){
    jsonObj = jQuery.parseJSON(''+data+'');
    if(jsonObj.size==true){
        elem.parent().find('img').attr('src',"/assets/img/document.jpg");//;
        elem.parent().find('p').text(jsonObj.img);
        elem.parent().find('.dellphoto').removeClass('hide');
    $('input[name="blogsFile"]').val(jsonObj.img);
    }else{ alert('File is not loading.')}
    }//alert(elem.parent().find('img').attr('src'));
    }
}
function addmyurl(){
    var s=prompt('Вставьте Goole Docs ссылку вида https://docs.google.com/file/d/0B2rGB-XEklUmXzVQdHJBWDlnTjA/edit');
    if(s){
        var regV = /^https:\/\/docs\.google\.com\/file\/d\//gi;     // шаблон
        var result = s.match(regV);  // поиск шаблона в юрл
    if(result){
    $('#projectsMainFileUrlInput').val(s); 
    $('.file-url').hide();
    //$('.column-3 .file-folder').hide();
    $('#forUrlsmall').html(s+" <span onclick='dellmyurl()'> X</span>");
    }else alert("Строка не соответсвует шаблону https://docs.google.com/file/d/********** ");
    };
};
function dellmyurl(){
    $('.file-url').show();
    //$('.column-3 .file-folder').show();
    $('#forUrlsmall').html('');
    $('#projectsMainFileUrlInput').val(''); 
}
function saveBlog(){
    var inp = $('input[name="post_title"]');
    if(inp.val()==''){
    inp.css('backgroundColor',"#FFFDC2");
    setTimeout(function(){
      inp.css('backgroundColor',"#FFF");
    },800)
    }else{
        $('#add_post').submit();
    }
    return false;
}
function dellImgMain(id){
    if(confirm("Удалить фото?")){
    $.ajax({
        type:"POST",
        url:'../controllers/dellposts.controller.php',
        data:{BlogsImgMainId: id}
    }).done(function(data){
        if('error'!=data){
        $('#blogsImgFolderInput').parent().find('img').attr('src',"/assets/img/default.jpg");
        $('#blogsImgFolderInput').parent().find('.dellphoto').addClass('hide');
        }
        
    }).fail(function(){
        //$(window).mkBubble(e,{content:'ошибка клиента'});
    });
    }
    return false;
}
function dellFile(id){
    if(confirm("Удалить файл?")){
    $.ajax({
        type:"POST",
        url:'../controllers/dellposts.controller.php',
        data:{BlogsFileId: id}
    }).done(function(data){
        if('error'!=data){
        $('#blogsMainFileFolderInput').parent().find('img').attr('src',"/assets/img/default-document.jpg");
        $('#blogsMainFileFolderInput').parent().find('.dellphoto').addClass('hide');
         $('#blogsMainFileFolderInput').parent().find('p').text(' ');
         $('input[name="blogsFile"]').val('');
        }
    }).fail(function(){
        //$(window).mkBubble(e,{content:'ошибка клиента'});
    });
    }
    return false;
}