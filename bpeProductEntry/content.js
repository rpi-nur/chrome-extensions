// content.js
(function () {

    const domain = window.location.hostname;
    const rendering_page= 'RENDERING';
    const api_response_page= 'API_RESPONSE';

    let v_category_arr = [];
    let j_category_arr = [];

    let v_pagination_arr = {};
    let j_pagination_arr = {};

    let v_product_list_arr = [];
    let j_product_list_arr = []; 

    let productData = false;

    let sourse_type = false;

    let filterCategory=[];
 
    let counrtExt=0;
    let counrtExt2=0;
    const sourceUrl = new URL(window.location.href);
    const pathOnly = sourceUrl.pathname + sourceUrl.search;

    let product_code_list = []; 

    /* ---------- helpers ---------- */

    function cleanHref(href) {
        if (!href) return '';
        const path = new URL(href, window.location.origin);
        return path.pathname + path.search;
    }

    function cleanImgUrl(src) {
        if (!src) return '';
        return src.replace(/^.*?(https?:\/\/)/, '$1');
    }


    function isProductSlug(sourceUrl) {

        let parsed = new URL(sourceUrl, window.location.origin);

        let path = parsed.pathname.replace(/^\/|\/$/g, '');

        // query থাকলে product না
        if (parsed.search) return false;

        // multiple slash থাকলে product না
        if (path.includes('/')) return false;

        // reserved keywords block
        const blocked = ['search', 'brand', 'category'];

        if (blocked.includes(path.toLowerCase())) return false;

        return true;
    }


    function removePPerPg(sourceUrl) {
        const u = new URL(sourceUrl, window.location);
        if(u.searchParams.size>1) return ''
        u.searchParams.delete('pPerPg');
        u.searchParams.delete('pPgNo');
        u.searchParams.delete('p');
        const paramCount = u.searchParams.size;
        // console.log('Removed pPerPg/pPgNo/p:', paramCount);
        
        return u.pathname + u.search;
    }
    function keepOnlyFirstParam(sourceUrl) {
        const u = new URL(sourceUrl, window.location.origin);

        const params = [...u.searchParams.entries()];

        if (params.length > 0) {
            const [key, value] = params[0];   // first param
            u.search = `?${key}=${value}`;
        } else {
            u.search = '';
        }

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
    function getResponseData() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['reqResponse'], function (data) {
                resolve(data.reqResponse || null);
            });
        });
    }
    function setResponseData(value) {
        chrome.storage.local.set({ reqResponse: value }, () => {
            console.log('reqResponse saved:', value);
            // alert('reqResponse saved:',value)
        });
    }

    // Send data to background
    function sendToBackground(payload) {
        console.log(payload);
        chrome.runtime.sendMessage(
            { type: 'SAVE_PRODUCT', payload },
            function (response) {
                if (response?.success) {
                    console.log('Saved successfully', response);
                    if(response.data.redirectUrl){
                        console.log('Next URL:', response.data.redirectUrl);
                        window.location.href = response.data.redirectUrl; 
                        setResponseData(response.data.redirectUrl)
                        // window.location.reload(true);
                        //  setTimeout(() => { 
                            // window.location.href = response.data.redirectUrl; // Redirect to next URL
                            // window.location.replace(response.data.redirectUrl);
                            
                            // window.location.reload(true);
                        // }, 100);
                        
                        
                    } 
                    // alert('Data saved successfully');
                }  
            }
        );
    }
    function extract_product_list() {
        /* ---------- PRODUCT LIST ---------- */
        
        /* ---------- GET EXTRACT PRODUCT LIST FROM API RESPONSE ---------- */
        // console.log('called extract_product_list');
        $('#kuLandingProductsListUl li').each(function (index, element) {
            // console.log('get li');
            const $el = $(element);
            var sourceUrl = cleanHref($el.find('a').attr('href'));
            sku = $el.find('.zoey-search-attribute-value').first().text().trim()
            // console.log('get li sku:',sku, ' : ',  sourceUrl);
            if(sku!='') {
                j_product_list_arr.push({ 
                    title: $el.find('.kuName a').text().trim(),
                    ProductId: sku,
                    sourceUrl: sourceUrl,
                    img: cleanImgUrl($el.find('img').attr('src') || ''),
                    stock: $el.find('.zoey-search-attribute-value').last().text().trim()
                });
                product_code_list.push(sku);
                sourse_type = api_response_page;
                 
            }
        }); 
        filterCategory= [];

        $('#kuFilterBox-category').each(function (index, element) {
            const $el = $(element);
           
            var cat_title = $el.find('#kuFilterHead-category').text().trim(); 
            if(cat_title=='CATEGORY') { 
       
                $el.find('a').each(function (i, aEl) {
                    const $a = $(aEl);
                    var cleanUrl = cleanHref(window.location.href);
                    let filter_name= encodeURIComponent($a.attr('title'));
                    // console.log('name:', filter_name)
                    
                    //  filter_name= filter_name.toLowerCase().trim(); 
                    let filter_sourceUrl= cleanUrl+'&productFilter=category%3A'+filter_name;
                    
                    let total= $a.find('.kuFilterTotal').text().trim()
                    // console.log('total:', total)
                
                    // filterCategory.push({'id':'','title':$a.attr('title').trim(),'sourceUrl':filter_sourceUrl,'type':'category', 'series':'','img':'','query':'pPgNo', 'total':total});
                });

                // console.log('filterCategory:', filterCategory)
                

                 
            }
        });
         
        /* ---------- GET EXTRACT PRODUCT LIST FROM VIEW SOURCE ---------- */

        $('.zoey-product-list-products li.item').each(function (index, element) {
            const $el = $(element);
            var sourceUrl = cleanHref($el.find('meta[itemprop="url"]').attr('content')); 
            var imgSrc = cleanImgUrl($el.find('meta[itemprop="image"]').attr('content'));
            if(imgSrc==''){
                    imgSrc = $el.find('img').attr('src');
                }
            if($el.find('meta[itemprop="sku"]').attr('content')!='') {
                v_product_list_arr.push({
                    title: $el.find('meta[itemprop="name"]').attr('content'),
                    ProductId: $el.find('meta[itemprop="sku"]').attr('content'),
                    sourceUrl: sourceUrl,
                    brand: $el.find('meta[itemprop="brand"]').attr('content') || '',
                    img: imgSrc,
                    stock: $el.find('.zoey-product-list-attribute-value').text().trim()
                });
                product_code_list.push($el.find('meta[itemprop="sku"]').attr('content'));
                sourse_type = rendering_page;
            } 
        }); 
        
    }
    function extract_product_details() {
            /* ---------- PRODUCT DETAILS ---------- */
            const related_item_list =[];
            const related_item_scv =[];

        if ($('.current-sku-value').text()) {
            const related_item= $('#block-related li').each(function (index, element) { 
                const $el = $(element);
                var sourceUrl = cleanHref($el.find('meta[itemprop="url"]').attr('content')); 
                var imgSrc = cleanImgUrl($el.find('.zoey-product-image').attr('style'));
                var productId = $el.find('meta[itemprop="sku"]').attr('content')

                related_item_scv.push(productId)
                related_item_list.push({
                    title: $el.find('meta[itemprop="name"]').attr('content'),
                    ProductId: productId,
                    sourceUrl: sourceUrl,
                    brand: $el.find('meta[itemprop="brand"]').attr('content') || '',
                    img: imgSrc,
                    stock: ''
                });

            });
            productData = {
                productID: $('.current-sku-value').first().text(),
                productTitle: $.trim($('.product-name h1').text()),
                price: $.trim($('.price-info .price').last().text()).replace(/\$|,/g, ''),
                shortDescription: $.trim($('.short-description span').first().text()),
                productImage: cleanImgUrl($('.product-image-gallery img').first().attr('src')),
                description: $.trim($('.tab-content li[data-title^="OVERVIEW"]').text()),
                additional2: $('.tab-content li[data-title^="SPECIFICATIONS"] .component-content .component-content').html(),
                additional1: $('.tab-content li[data-title^="DOCUMENTS"] .component-content .component-content').html(),
                searchUrl: location.pathname.replace(/^\/+/, ''),
                discontinued: $('.current-discontinued-value').text().trim(),
                brandName: $('meta[property="product:brand"]').attr('content'),
                additional3:related_item_scv,
                related_item: related_item_list
            };
            sourse_type=rendering_page;
            // console.log('related_item_list:', related_item_list)
            
        }
       
        

    }
    function extract_pagination(responseData) { 
        /* ---------- PRODUCT LIST pagination data ---------- */
        var total_items_v = parseInt($('.total-number').first().text().trim(), 10);
        var total_items_j = parseInt($('#kuProductTab strong').text().trim(), 10);
        let per_page = 15;
        const currUrl = window.location.href;
    //    console.log(location.href.includes('pPgNo='), currUrl);
        
        if (!isNaN(total_items_v) && !location.href.includes('p=')) {
            var page_count = Math.ceil(total_items_v / per_page);
            v_pagination_arr={
                total_items: total_items_v,
                page_count: page_count, 
                sourceUrl: responseData,
                queryPara: '&p',
                type: 'pagination'
            }; 
        } 
       
        if(!isNaN(total_items_j) && !location.href.includes('pPgNo=')) {
            var page_count = Math.ceil(total_items_j / per_page);
            j_pagination_arr={
                total_items: total_items_j,
                page_count: page_count, 
                sourceUrl: responseData,
                queryPara: '&pPgNo',
                type: 'pagination'
            }; 
        }
        // var page_count = Math.ceil(total_items / per_page);
        // console.log('extract_pagination: ', sourceUrl);
        // console.log('total_items: ', total_items);
        // console.log('page_count: ', page_count);
        // console.log('removePPerPg(sourceUrl): ', sourceUrl);

        // console.log('j_pagination_arr', j_pagination_arr, 'v_pagination_arr', v_pagination_arr)
        // console.log('total_items', total_items)
 
        // console.log('has p', total_items, sourceUrl.searchParams.has('p'), sourceUrl.searchParams.has('pPgNo'));
         
    }
    function extract_caregoties(){
        
        $('.html-content .tabs .tab').each(function (_, element) {
            const $el = $(element);
            const href = $el.find('a').attr('href');
            v_category_arr.push({'id':href.replace(/^#/, ''),'title':$el.find('a').text(),'sourceUrl':'','type':'sub-category', 'status': 'y', 'series':'','img':cleanHref($el.find('img').attr('src'))});
            sourse_type= rendering_page;
        });


        v_category_arr.forEach(function (item, index) {
            let current_series = [];
            let current_product = [];
            $('#' + item.id + ' .tabItem').each(function (_, subElement) {
                const $el = $(subElement);
                const $a = $el.find('a');
                const sourceUrl = $a.attr('href') || '';
                let clean_sourceUrl = cleanHref(sourceUrl); 
                let clean_img =  cleanImgUrl($el.find('img').attr('src'));
                
                var title = $el.find('h2').text().trim();
              
                

                if (sourceUrl.includes('#tab')) {
                    if(v_category_arr[index].sourceUrl === ''){

                        v_category_arr[index].sourceUrl = clean_sourceUrl;
                        v_category_arr[index].type = 'category';
                        v_category_arr[index].status = 'n';
                    }

                }
                else if (isProductSlug(clean_sourceUrl)) {
                    if(title===''){title=v_category_arr[index].title}

                        current_product.push({
                            title: title,
                            subTitle: $el.find('p').text().trim(),
                            sourceUrl: clean_sourceUrl, 
                            type: 'product',
                            details: $el.find('ul').length ? `<ul>${$el.find('ul').html()}</ul>` : '',
                            img:clean_img
                        });
                }
                else {
                     if(title!==''){
                        current_series.push({
                            title: title,
                            subTitle: $el.find('p').text().trim(),
                            sourceUrl: clean_sourceUrl,
                            type: 'series',
                            details: $el.find('ul').length ? `<ul>${$el.find('ul').html()}</ul>` : '',
                            img: clean_img
                        });
                    }else{
                        v_category_arr[index].sourceUrl = clean_sourceUrl;
                    }

                }

                

            });
            // console.log(index, current);
            v_category_arr[index].series = current_series;
            v_category_arr[index].products = current_product;
        });
        

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
     var brand=$('h1').text().trim();
     $('.zoey-search-attribute-value').on('change', function () {
    // your function logic here
    // alert('onchange tigger')
    });

// setResponseData('nuuuuuuuuuuuuuuuuuuuuuuuuuu')

    /* ---------- extract all  ---------- */
    // var hck_product_details = extract_product_details();
    var hck_product_details = extract_caregoties();
    
    var chk_pagina = extract_pagination(pathOnly);
    var chk_product_list = extract_product_list();

 

    /* ---------- MAIN EXECUTION (ASYNC SAFE) ---------- */

    (async function () {
        const localData = await getLocalData();
        const responseData = await getResponseData();
        if(responseData !== 'reloadOff'){
            setResponseData('reloadOff');
            // alert('reload')
            console.log('==================reload==========================')
            window.location.reload(true);
        }
        // console.log('responseData:', responseData, 'localData: ',localData);
        let myVar = false;  
        $('#loadingStatus').val(localData || ''); 
        if (localData === 'wempro') {
            
            if(sourse_type !==false) myVar = true;
            let attemp = 0;
            
            const intervalId = setInterval(() => { 
                if (myVar || counrtExt > 30) {
                    
                    clearInterval(intervalId); // stop polling
                    if(sourse_type===rendering_page){
                        sendToBackground({
                            productData: productData,
                            category: v_category_arr,
                            productList: v_product_list_arr,
                            pagination: v_pagination_arr,
                            currentUrl: pathOnly,
                            // sourceUrl: responseData,
                            brand:brand,
                            sourse_type: sourse_type
                        });
                    }else {
                         sendToBackground({
                            productData: productData,
                            // category: [...j_category_arr, ...filterCategory],
                            category: j_category_arr,
                            productList: j_product_list_arr,
                            pagination: j_pagination_arr,
                            currentUrl: pathOnly,
                            // sourceUrl: responseData,
                            brand:brand,
                            sourse_type: sourse_type
                        });
                    }
                } else {
                    
                    var chk_pagina = extract_pagination(pathOnly);
                    var chk_product_list = extract_product_list();
                    var hck_product_details = extract_product_details();
                    var hck_product_details = extract_caregoties();

                    console.log('attemp:',counrtExt)
                    console.log('productData:',productData)
                    console.log('product_code_list:', product_code_list); 
                    console.log('j_product_list_arr:', j_product_list_arr); 
                   

                    // if(sourse_type !=false) myVar = true;
                    // if(j_product_list_arr.length > 0 && productData){
                        console.log(j_product_list_arr);
                        if(counrtExt > 3)
                            { myVar = true;}
                        else {
                            product_code_list= []
                            j_product_list_arr= []
                        }
                    // }

                    counrtExt++; 
                    
                }
            }, 3000);
        }
    })();

})();
