// content.js
(function () {

    const domain = window.location.hostname;

    let category = [];
    let productList = [];
    let productData = {};
    let series=[];
    let len = 0;
    const url = new URL(window.location.href);

    /* ---------- helpers ---------- */

    function cleanHref(href) {
        if (!href) return '';
        const path = new URL(href, window.location.origin);
        return path.pathname + path.search;
    }
    function removePPerPg(url) {
        const u = new URL(url, window.location);
        if(u.searchParams.size>1) return ''
        u.searchParams.delete('pPerPg');
        u.searchParams.delete('pPgNo');
        u.searchParams.delete('p');
        const paramCount = u.searchParams.size;
        console.log('Removed pPerPg/pPgNo/p:', paramCount);
        
        return u.pathname + u.search;
    }

    // ✅ FIXED: async local storage getter
    function getLocalData() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['handLoader'], function (data) {
                resolve(data.handLoader || null);
            });
        });
    }

    function saveLocalData(value) {
        chrome.storage.local.set({ handLoader: value }, () => {
            console.log('handLoader saved:', value);
        });
    }

    // Send data to background
    function sendToBackground(payload) {
        console.log('Content → Background payload:', payload);

        chrome.runtime.sendMessage(
            { type: 'SAVE_PRODUCT', payload },
            function (response) {
                if (response?.success) {
                    console.log('Saved successfully', response);
                    if(response.data.next){
                      window.location.href = response.data.next; // Redirect to next URL
                      console.log('Next URL:', response.data.next);
                    }
                    // alert('Data saved successfully');
                }  
            }
        );
    }

    /* ---------- DOMAIN CHECK ---------- */

    if (domain !== 'www.burtprocess.com' && domain !== 'burtprocess.com') {
        return;
    }

    /* ---------- UI ---------- */

    $('body').append(`
        <div class="extension-box">
            <input class="entry-item" type="text" id="loadingStatus" placeholder="Get Loading keyword"/>
            <button class="btn clear">X</button>
            <span class="submit">Save</span>
        </div>
    `);

    $('.clear').on('click', function () {
        $('#loadingStatus').val('');
        chrome.storage.local.clear();
        chrome.storage.sync.clear();
    });
    
    $('.submit').on('click', function () {
        const value = $('#loadingStatus').val().trim();
        saveLocalData(value);
    });

    /* ---------- PRODUCT DETAILS ---------- */

    if ($('.current-sku-value').text()) {
        productData = {
            productID: $('.current-sku-value').text(),
            productTitle: $.trim($('.product-name h1').text()),
            price: $.trim($('.price-info .price').last().text()).replace(/\$|,/g, ''),
            shortDescription: $.trim($('.short-description span').first().text()),
            productImage: $('.product-image-gallery img').first().attr('src'),
            description: $.trim($('.tab-content li[data-title^="OVERVIEW"]').text()),
            additional2: $('.tab-content li[data-title^="SPECIFICATIONS"] .component-content .component-content').html(),
            additional1: $('.tab-content li[data-title^="DOCUMENTS"] .component-content .component-content').html(),
            searchUrl: location.pathname.replace(/^\/+/, ''),
            discontinued: $('.current-discontinued-value').text().trim(),
            brandName: $('meta[property="product:brand"]').attr('content')
        };
    }

    /* ---------- CATEGORY LIST ---------- */

     var brand=$('h1').text().trim();

    $('.html-content .tabs .tab').each(function (_, element) {
        const $el = $(element);
        const href = $el.find('a').attr('href');
        category.push({'id':href.replace(/^#/, ''),'title':$el.find('a').text(),'url':'','type':'sub-category', 'series':'','img':cleanHref($el.find('img').attr('src'))});
    });


    category.forEach(function (item, index) {
        let current = [];
        $('#' + item.id + ' .tabItem').each(function (_, subElement) {
            const $el = $(subElement);
            const $a = $el.find('a');
            const url = $a.attr('href') || '';
            
            var title = $el.find('h2').text().trim();

            if (url.includes('#tab')) {
                category[index].url = removePPerPg(url.split('#')[0]);
                category[index].type = 'category';
            }
            else {
                // console.log(url, cleanHref(url))
                // series.push(url);
                current.push({
                title: title,
                subTitle: $el.find('p').text().trim(),
                url: removePPerPg(url),
                type: 'series',
                details: $el.find('ul').length ? `<ul>${$el.find('ul').html()}</ul>` : '',
                img: cleanHref($el.find('img').attr('src'))
                })
            }
            

        });
        // console.log(index, current);
        category[index].series = current;
    });
    if(category.length>0){
        category.push({'id':'','title':brand,'url':`/search/?q=${encodeURIComponent(brand)}`,'type':'root', 'series':'','img':''});
    }

    // console.log('category', category)
   



    /* ---------- PRODUCT LIST ---------- */
setTimeout(() => { 
    $('.zoey-product-list-products li.item').each(function (index, element) {
        const $el = $(element);
        var url = cleanHref($el.find('meta[itemprop="url"]').attr('content')); 
        var imgSrc = $el.find('meta[itemprop="url"]').attr('content');
        if(imgSrc==''){
                imgSrc = $el.find('img').attr('src');
            }
        
        productList.push({
            title: $el.find('meta[itemprop="name"]').attr('content'),
            ProductId: $el.find('meta[itemprop="sku"]').attr('content'),
            url: url,
            brand: $el.find('meta[itemprop="brand"]').attr('content') || '',
            img: imgSrc,
            stock: $el.find('.zoey-product-list-attribute-value').text().trim()
        });
         
       
    });
    
    $('#kuLandingProductsListUl li').each(function (index, element) {
        const $el = $(element);
        var url = cleanHref($el.find('a').attr('href'));
      
        productList.push({
            title: $el.find('.kuName a').text().trim(),
            ProductId: $el.find('.zoey-search-attribute-value').first().text().trim(),
            url: url,
            img: $el.find('img').attr('src') || '',
            stock: $el.find('.zoey-search-attribute-value').last().text().trim()
        });
         
       
    });

        /* ---------- PRODUCT LIST pagination data ---------- */
     
        var total_items = parseInt($('.total-number').first().text().trim(), 10);
        let per_page = 15;
        // const url = window.location.pathname + window.location.search; 
        
        if (!isNaN(total_items) && url.searchParams.has('p')===false) {
            console.log(url.searchParams, total_items, url.searchParams.has('p'));
            //  alert('has p');
            var page_count = Math.ceil(total_items / per_page);
            category.push({
                total_items: total_items,
                page_count: page_count, 
                url: removePPerPg(url),
                queryPara: '&p',
                type: 'pagination'
            });
        } 
        var total_items = parseInt($('#kuProductTab strong').text().trim(), 10);
        if(!isNaN(total_items) && url.searchParams.has('pPgNo')===false) {
            // alert('has pPgNo');
            
            var page_count = Math.ceil(total_items / per_page);
            category.push({
                total_items: total_items,
                page_count: page_count, 
                url: removePPerPg(url),
                queryPara: '&pPgNo',
                type: 'pagination'
            }); 
        }
 
        console.log('has p', total_items, url.searchParams.has('p'), url.searchParams.has('pPgNo'));

    // $('.toolbar-bottom  .pager .pages li').each(function (index, element) {
    //     var productLink = $(element).find('a').attr('href'); 
    //     // console.log('pagination link:', pagination_title+'_'+index, productLink);
    //     if(productLink){
    //         category.push({
    //             title: pagination_title+'_'+index,
    //             url: cleanHref(productLink),
    //             type: 'pagination'
    //         });
    //     }
        
    // });

    }, 2000);





    /* ---------- MAIN EXECUTION (ASYNC SAFE) ---------- */

    (async function () {
        const localData = await getLocalData();
        // console.log('localData:', localData);
        $('#loadingStatus').val(localData || '');


        if (localData === 'wempro') {
            // alert('Loading wempro data...');
            

           
        setTimeout(() => { 
            
            const pathOnly = url.pathname + url.search;
            console.log('url: ', pathOnly, 'productData: ', productData, 'category: ', category, 'productList: ', productList );
            
        

            sendToBackground({
                productData,
                category,
                productList,
                currentUrl: pathOnly,
                brand:brand
            });
            }, 2100);
        }
    })();

})();
