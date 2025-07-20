 setInterval(function(){
    console.log('*********');
    var sk = document.getElementsByClassName('ytp-ad-skip-button');
     if(sk != undefined && sk.length > 0){
        sk[0].click();
        console.log('add sellected');
     }
 },1000)