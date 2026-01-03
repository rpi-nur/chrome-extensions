var i = null;
var asin = '';


function extenRun() {

    $("[data-asin]").each(function() {
        i += 1;
        var item, sData, query, price;
        var es = $(this).attr('data-asin').trim();
        var item = $(this).attr('data-index');

        chrome.storage.sync.set({c_es: es}, function() {
            console.log('Value is set to ' + es);
          });

        if (es != '') {
            asin += '"' + $(this).attr('data-asin') + '",';
        }
        let index = asinList.indexOf(es);
        if (index > 0) {
            // $('#productTitle').prepend("<strong>There are brand issues: </strong>");
            // console.log(es);
            $("[data-index=" + item + "]").addClass('nur-border');
        }
        sData = $("[data-index=" + item + "]" + ' h2 a span').text();
        query = 'https://www.google.com/search?q=' + "site:walmart.com" + ' ' + sData.trim();
        price = $("[data-index=" + item + "]" + ' .a-price .a-price-whole').text() + $("[data-index=" + item + "]" + ' .a-price .a-price-fraction').text();

        sellLink = 'https://sellercentral.amazon.com/product-search/search?q=' +  es+'&ref_=xx_catadd_dnav_xx';
        $("[data-index=" + item + "]" + ' h2').prepend('<a href="' + sellLink + '" target="_blank"  class="sell-btn">Sell this Product</a>');




        var bsr = $("[data-index=" + item + "] .pvv-ext-wrap-BSR .pvv-ext-BSR span b").text();
        bsr = bsr.replace('#', '').replace(',', '').trim();

        // if (parseInt(bsr) < 79999) {
        //     $("[data-index=" + item + "]").addClass('hide');
        // }

        // var prim, fba, amazon, fbm = null;

        // $("[data-index=" + item + "] .myApp .pvv-ext-Prime span b").each(function() {
        //     var sellerType = $(this).text();
        //     // console.log(sellerType + ' else');
        //     // if (sellerType === 'Prime' && sellerType === 'Amazon' && sellerType === 'FBA') {
        //     if (sellerType.search("Prime") < 0) {
        //         prim = 'Prime';

        //     } else if (sellerType.search("FBA") < 0) {
        //         fba = 'FBA';

        //     } else if (sellerType.search("Amazon") < 0) {
        //         amazon = 'Amazon';

        //     } else if (sellerType.search("FBM") < 0) {
        //         fbm = 'FBM';

        //     }
        //     // if (sellerType === 'Prime' text.search("nlu") && sellerType === 'FBA' || sellerType === 'Prime' && sellerType === 'Amazon') {
        //     //     // $("[data-index=" + item + "]").addClass('nuroff');
        //     //     $("[data-index=" + item + "]").addClass('hide');
        //     // }

        //     sellerType = null;
        // });
        // console.log('FBA ' + fba);
        // console.log('FBM ' + fbm);
        // console.log('Amazon ' + amazon);

        // if (fbm === 'FBM' && amazon === 'Amazon' || fba === 'FBA' && amazon === 'Amazon' || fbm === 'FBM' && fba === 'FBA') {

        //     $("[data-index=" + item + "]").addClass('hide');
        // }
        // var z = $("[data-index=" + item + "]" + ' .xtaqv-root a.a-declarative').text();
        // console.log(z + ' -------------------------');
        // if (z != '') {
        //     $("[data-index=" + item + "]").addClass('hide');
        // }

        if (parseInt(price) < 5) {
            $("[data-index=" + item + "]" + ' h2').hide();
            $("[data-index=" + item + "]").addClass('hide');
        }
        $("[data-index=" + item + "]" + ' h2 a').addClass('h2');
        $("[data-index=" + item + "]" + ' h2').prepend('<a href="' + query + '" target="_blank"  class="nur-s">  Click to search in Walmart</a>');
    });



} 
let host = window.location.hostname;
host = host.split(".");
host = host[0];
 
$(document).ready(function() {
console.log('hi nur. how are you !!'); 
let url="http://127.0.0.1:8000/vendor/update-price?host="+host;
console.log("url: ", url);
// console.log("Sending request to:", "http://192.168.1.20:5000/vendor/get-verify-product");
fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
//   body: JSON.stringify({
 
//     "nodeTextId":"nur-demo",
//     "nodeTitle":"Nur Demo",
//     "token": "L9k4noaw0xU4zWdSN5LiMeVpkYrN0pO1cgnXWFbPTS3CRgmZP6SyYIGK4hYggBxT",
//     "date": "2025-07-17 09:51:24.000000",
//     "vendor": "amazon"
 
//   })
})
.then(response => response.json())
.then(data => {
//   console.log("✅ Success:", data);
let priceCon = data
let price = $(".regular-price .price").text();
let cleanPrice = price.replace(/[$,]/g, ''); // "5650.95"
console.log('price: *** ',cleanPrice, 'data: ',data);
// alert('price: ',cleanPrice);
})

 

 
// if(host==='amazon'){
//     $('.s-desktop-width-max.s-desktop-content').prepend('<span id="asinCopy">Copy text</span>');
//      extenRun();
   
//     $('#asinCopy').click(function() {
//         navigator.clipboard.writeText(asin);
//     });


//     var itemT = $('#productTitle').text();
//     var query = 'https://www.google.com/search?q=' + "site:walmart.com " + itemT.trim();
//     $('#title').prepend('<a href="' + query + '" target="_blank"  class="nur-s"> Go to </a>');
// }else if(host === 'walmart'){
//     // setTimeout(loadData, 3000);
// }

   

    // if ($('table.a-spacing-micro .po-brand .a-span3 .a-text-bold').text() == 'Brand') {
    //     var brandN = $('table.a-spacing-micro .po-brand .a-span9 .a-size-base').text();
    //     let index = brandList.indexOf(brandN.trim());
    //     if (index > 0) {
    //         $('#productTitle').prepend("<strong>There are brand issues: </strong>");
    //         console.log(index);
    //     }

    // }
    // itemT = itemT.trim(" ");
    // itemT = itemT.split(" ");
    // console.log(itemT);
    // brandList.forEach(myFunction);

  


});

// function myFunction(item, index) {
//     text += index + ": " + item + "<br>";
// }
const brandList = [""];
const asinList = ['', 'B078L3K652', 'B07C8FTHKD', 'B07G5PYWC3',
    'B08ZJQFNZ1', 'B078KZX1MC', 'B078KZX1MC', 'B07BPQXJMT', 'B09N9R5F48', 'B09MLP5B84', 'B09RFV6CSC', 'B01MF7NYPI'
];
// const inventory = [
//     'B084H5N1XV',
//     'B01IDZOUBI',
//     'B07D743F3J',
//     'B09TZ8FJRL',
// ];