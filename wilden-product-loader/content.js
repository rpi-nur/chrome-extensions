let domain = window.location.hostname; 
let thead,tdata, productInfo = '';
const info = [];
const spcTd = [];
const spcTh = [];

console.log(domain);
// getData();
if('www.wildenstore.psgdover.com' == domain || 'wildenstore.psgdover.com' == domain){
  chrome.storage.local.clear();
chrome.storage.sync.clear();
  $('footer').addClass('have-ext-btn');
  $('footer').append('<span class="copy-spc">copy</span>');


  console.log('ti ');
  var scriptData = document.querySelectorAll("script");
  
  for (a of scriptData) { 
    if('Product.PsgDoverTabs.init' == a.text.trim().slice(130, 167).trim()){
      var data = a.text.trim().slice(168);
    var tr = a.text.trim().slice(-25);
    tr = data.replace(tr,'');
    data = tr.trim().replace(');','');
  const dataObj= JSON.parse(data);
  $.each(dataObj.customFields, function( index, value ) {
    console.log( index );
    console.log( value );
    console.log( '--------------------' );
  });
   
    }
    // console.log(a.text.trim().slice(130,167));
    console.log('----');
  }
  console.log("p.innerHTML");
// $('script').click(function(){

//   console.log($(this).text());
//   console.log('ti ');

// });
// setdata();
}

if('www.pumpsandinstrumentations.com' == domain || 'pumpsandinstrumentations.com' == domain){

$('#footer, .MainFooter').addClass('have-ext-btn');
if('?step=technical'== location.search){
$('#footer, .MainFooter').append('<span class="paste technical">Technical</span>');}
// if('?step=general'== location.search){
  $('#footer, .MainFooter').append('<span class="paste general">Overview</span>');
  // }
$('#footer, .MainFooter').append('<span class="paste info">Product Info</span>');

  getData();
  
$('.info').click(function(){
  console.log(productInfo);
  $('#productEntryTitle').val(productInfo[0]);
  $('#title2').val(productInfo[1]);
  $('#productCode').val(productInfo[2]);
  $('#modelCode').val(productInfo[2]);
});

$('.general').click(function(){
  $('#tabDataX').val(productInfo[3]);
});

$('.technical').click(function(){
   $('#flControl #flControl__dataContainer>div').each(function(i,v){
    var this_row =$(this).attr('id');
     $(this).find('.col-sm-3 input').attr('value', thead[i]);
     $(this).find('.col-sm-9 input').attr('value', tdata[i]);
  });

});
}
function setdata(){
  chrome.storage.local.set({ spcTd: JSON.stringify(spcTd)}).then(() => {
    // console.log("spcTd saved");
  });
  chrome.storage.local.set({ spcTh: JSON.stringify(spcTh)}).then(() => {
    // console.log("spcTh saved");
  });
  chrome.storage.local.set({ productInfo: JSON.stringify(info) }).then(() => {
    console.log("productInfo saved");
  }); 

  getData();
}
 
function spcLoop(item, index) {
  text += index + ": " + item + "<br>"; 
}
function getData(){
  console.log("run getData()");
  chrome.storage.local.get(['spcTd'], function(td) {
    tdata = JSON.parse(td.spcTd);
    console.log(tdata);
  });

  chrome.storage.local.get(['spcTh'], function(th) {
    thead = JSON.parse(th.spcTh);
    console.log(thead);
  });
 


  chrome.storage.local.get(['productInfo'], function(info) {
    productInfo = JSON.parse(info.productInfo);
  });
  // console.log(productInfo);
}
