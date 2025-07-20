let host = window.location.hostname;
host = host.split(".");
host = host[1];
console.log('path Name is '+ host );
let path = location.pathname;
path = path.split("/");
const d = new Date();
var pageId= 1;

//     chrome.storage.sync.clear();
// chrome.storage.local.clear();

function amzOrder(){
    let list= Array();
    let b=  $('.a-keyvalue a').attr('href');
    if(typeof b == 'string'){
    let c = b.split("/");
    let pr = $("#MYO-app > div > div.a-row.a-spacing-medium > div.a-column.a-span10 > div > div.a-row.a-spacing-large > div > table > tbody > tr > td.a-text-right").text();
    chrome.storage.sync.get(['amzO'], function(or) {
        if(or.amzO !=='undefined'){
            list = JSON.parse(or.amzO);
        }
 list.push(path[3], c[(c.length - 1)],pr); 
    chrome.storage.sync.set({amzO: JSON.stringify(list)}, function() {
      });
    });
}
//     chrome.storage.sync.clear();
// chrome.storage.local.clear();
}
function amzProduct() {
    // let price = $('#aod-offer .a-offscreen').text();
    // console.log('in load data');
    
    let asin = $('#ASIN').val().trim();
    let para = [];
    let byboxPrice = $('#aod-pinned-offer #aod-price-0 .a-offscreen').text().replace('$', '').trim();
    let byboxSeller = $('#aod-pinned-offer #aod-offer-shipsFrom .a-size-small.a-color-base').text().trim();
    let sellerType = $('#aod-pinned-offer #aod-offer-soldBy a').text().trim();
    let review = $('#acrCustomerReviewText').text().trim();
    var itemT = $('#productTitle').text();
    var image = $('#imgTagWrapperId img').attr('src');
    var query = 'https://www.google.com/search?q=' + "site:walmart.com " + itemT.trim();
  
    let title = $('#productTitle').text().substr(0, 70).replace('/', '').replace('&', '').replace('"', '').replace("'", "").trim();
    $('#title').prepend('<a href="' + query + '" target="_blank"  class="nur-s"> Go to </a>');
    if (sellerType === '') {
        sellerType = byboxSeller;
    }
    var price = type = seller = null;
    const allSeller = [];
    $(".aod-information-block").each(function(i) {
        if (i === 0) {
            price = byboxPrice;
            type = sellerType;
            seller = byboxSeller;
        } else {
            price = $(this).children('#aod-offer-price').find('.a-offscreen').text().replace('$', '').trim();
            type = $(this).children('#aod-offer-shipsFrom').find('div.a-fixed-left-grid-col.a-col-right > span').text().trim();
            seller = $(this).children('#aod-offer-soldBy').find('.a-size-small.a-link-normal').text().trim();
        }
        allSeller[i] = { price, seller, type }
    });
    if (byboxPrice != '' || byboxSeller != '' || sellerType != '') {
        para = [asin, byboxPrice, byboxSeller, itemT, review, image];
        console.log('BoyBox  Available');
        // arr = ['aprice' = byboxPrice, 'seller' = byboxSeller, 'review' = review];

    } else if (allSeller.length > 0) {
        // arr = ['aprice' = allSeller[1].price, 'seller' = allSeller[1].seller, 'review' = review];
        para = [ asin, allSeller[1].price, allSeller[1].seller, itemT, review, image];
        console.log('BoyBox not Available');

    }
    console.log(para);

    chrome.storage.sync.set({amzCm: asin}, function() {
        console.log('Value is set in amzProduct to ' + asin);
      });

    chrome.storage.sync.set({[asin]: para}, function() {
        console.log(asin+ ' :Value is set in amzProduct to ' + para);
      });
    // requestForDs(para);
    // chrome.storage.sync.get([asin], function(n1) {
    //     console.log(n1);
    //     console.log('------n1--------');
    //   });

}
 
function walProduct() {
    let id = location.pathname.split('/');
    id = id[id.length - 1]
    let sold = $('.ld.ld-Spark.mr2').siblings('span').text().replace('.', ' ').trim();
    let price = $('[data-testid="add-to-cart-price-atf"] [itemprop="priceCurrency"]').siblings('span').text().replace('$', '').trim();
    let title = $('h1[itemprop="name"]').text().substr(0, 70).replace('/', '').replace('&', '').replace('"/g', '').replace("'", "").trim();
    let brand = $('[link-identifier="brandLink"]').text().trim();
    let image = $('[data-testid="zoom-image"] img').attr('src');
const wData =  [ id, price , sold , title, image];
    chrome.storage.sync.set({walCm: id}, function() {
        console.log('Value is set in walCm  to ' + id);
      });

    chrome.storage.sync.set({[id]: wData}, function() {
        console.log('Value is set in amzProduct to ' + wData);
      });

  
    if (sold != '') {
        showClaculatorBtn('wal');
        // requestForDs(id + '&p=' + price + '&s=' + sold + '&sy=' + sold + '&r=null&t=' + title);
    }
}
function amzProductList() {

//     chrome.storage.sync.clear();
// chrome.storage.local.clear();

    $("[data-asin]").each(function() {
        var es = $(this).attr('data-asin').trim();
        var item = $(this).attr('data-index');
        // console.log( es);
        // console.log( item);
       var price = $("[data-index=" + item + "]" + ' .a-price .a-price-whole').text() + $("[data-index=" + item + "]" + ' .a-price .a-price-fraction').text();
        let sData = $("[data-index=" + item + "]" + ' h2 a span').text();
      

        if(es!=''){
            $("[data-index=" + item + "]" + ' a').attr('href','https://www.amazon.com/dp/'+es+'/ref=olp-opf-redir?aod=1&ie=UTF8&f_new=true&f_primeEligible=true');
            chrome.storage.sync.get([es], function(r) {
                // console.log(r[es]);
                if(es in r ){
                    console.log(r[es]);
                    $("[data-index=" + item + "]" ).addClass('was-view');
                } 
          });
        }

        let query = 'https://www.google.com/search?q=' + "site:walmart.com" + ' ' + sData.trim();
        let sellLink = 'https://sellercentral.amazon.com/product-search/search?q=' +  es+'&ref_=xx_catadd_dnav_xx';
        $("[data-index=" + item + "]" + ' h2').prepend('<a href="' + sellLink + '" target="_blank"  class="sell-btn">Sell this Product</a>');

        $("[data-index=" + item + "]" + ' h2 a').addClass('h2');
        $("[data-index=" + item + "]" + ' h2').prepend('<a href="' + query + '" target="_blank"  class="nur-s">  Click to search in Walmart</a>');
    });
 

} 
function showClaculatorBtn(para) {
    console.log(para);
    $('[data-testid="sticky-buy-box"]').prepend('<span id="asinCopy">Show Amazon to Walmart Calculator</span>');
    $('#asinCopy').click(function() {
        requestForDs(para);
    });
}
 
function requestForDs(ar) {
    var url = "http://localhost/fetch/ds.php?h=" + ar;
    window.open(url, "width = 300, height = 300 ");
}
if(host==='amazon'){
    // setTimeout(amzProduct, 3000);    
if (location.search === '?aod=1&ie=UTF8&f_new=true&f_primeEligible=true') { setTimeout(amzProduct, 3000); }
amzProductList();
// chrome.storage.sync.get(['amzCm'], function(result) {
//     console.log('walmart currently is: ' + result.amtCm);
//   });

  $('.s-pagination-strip a').click(function(){
    var pagination = location.search.slice('&');
pagination = pagination[pagination.length - 1];
// pageId=pagination[1];
// console.log(pagination);
// console.log('------------------');
    //   amzProductList();
    });

   
if(path[2] === 'order'){
    console.log('amzOrder will be run!!');
    setTimeout(amzOrder, 3000);
}
}
else if(host === 'walmart'){
    setTimeout(walProduct, 8000);
    // localStorage.setItem("<?php echo $_GET['id'] ?>", JSON.stringify(arr));
}
else {
 
    chrome.storage.sync.get(['walCm'], function(wal) {
       
        chrome.storage.sync.get([wal.walCm], function(wd) {
 
            console.log(wd[wal.walCm]);
            console.log('-wal-');
            $('#walId').val(wd[wal.walCm][0]);
            $('#walPrice').val(wd[wal.walCm][1]);
          });
      });
      console.log('amz');
    chrome.storage.sync.get(['amzCm'], function(amz) {
    
        chrome.storage.sync.get([amz.amzCm], function(ad) {
            console.log(ad[amz.amzCm]);
            $('#amzId').val(ad[amz.amzCm][0]);
            $('#amzPrice').val(ad[amz.amzCm][1]);
        });
        console.log(amz);
      });


 
 
     

     
      setTimeout(function(){
        // chrome.storage.sync.get(['B007USJJH0'], function(n1) {
        //     console.log(n1);
        //     console.log('------n1--------');
        //   });
 


      }, 3000);  

 
}
