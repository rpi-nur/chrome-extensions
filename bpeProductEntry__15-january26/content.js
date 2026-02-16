// content.js
(function () {

    const domain = window.location.hostname;

    let category = [];
    let productList = [];
    let productData = {};
    let len = 0;

    /* ---------- helpers ---------- */

    function cleanHref(href) {
        if (!href) return '';
        const url = new URL(href, window.location.origin);
        return url.pathname + url.search + url.hash;
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
        // console.log('Content → Background payload:', payload);

        // chrome.runtime.sendMessage(
        //     { type: 'SAVE_PRODUCT', payload },
        //     function (response) {
        //         if (response?.success) {
        //             console.log('Saved successfully', response.data.next);
        //             if(response.data.next){
        //               window.location.href = response.data.next; // Redirect to next URL
        //               console.log('Next URL:', response.data.next);
        //             }
        //             // alert('Data saved successfully');
        //         }  
        //     }
        // );
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
            discontinued: $('.current-discontinued-value').text().trim()
        };
    }

    /* ---------- CATEGORY LIST ---------- */

    $('.tabContents .tabContent').each(function (_, element) {
        $(element).find('.tabItem').each(function (_, subElement) {
            const $el = $(subElement);
            var url = cleanHref($el.find('a').attr('href')).split('#')[0];
            var title = $el.find('h2').text().trim();
            if(url && title){
                // console.log('category link:', title, url);
            
            category.push({
                title: title,
                subTitle: $el.find('p').text().trim(),
                link: url,
                details: $el.find('ul').length ? `<ul>${$el.find('ul').html()}</ul>` : '',
                img: cleanHref($el.find('img').attr('src'))
            });
            len
          }
            
        });
    });

    /* ---------- PRODUCT LIST ---------- */

    $('.zoey-product-list-products li.item').each(function (index, element) {
        const $el = $(element);
        var url = cleanHref($el.find('meta[itemprop="url"]').attr('content'));
        console.log('product link:', url);
        productList.push({
            title: $el.find('meta[itemprop="name"]').attr('content'),
            ProductId: $el.find('meta[itemprop="sku"]').attr('content'),
            url: url,
            brand: $el.find('meta[itemprop="brand"]').attr('content') || '',
            img: $el.find('img').attr('src') || '',
            stock: $el.find('.zoey-product-list-attribute-value').text().trim()
        });
        len++;
    });

    /* ---------- PRODUCT LIST pagination data ---------- */
    var pagination_title= $('.currently li:last-child span').last().text().trim()

    $('.toolbar-bottom  .pager .pages li').each(function (index, element) {
        var productLink = $(element).find('a').attr('href'); 
        // console.log('pagination link:', pagination_title+'_'+index, productLink);
        if(productLink){
            category.push({
                title: pagination_title+'_'+index,
                link: cleanHref(productLink),
                type: 'pagination'
            });
        }

        // category.push({
        //         title: $el.find('h2').text().trim(),
        //         subTitle: $el.find('p').text().trim(),
        //         link: cleanHref($el.find('a').attr('href')),
        //         details: $el.find('ul').length ? `<ul>${$el.find('ul').html()}</ul>` : '',
        //         img: cleanHref($el.find('img').attr('src'))
        //     });
    });

    /* ---------- MAIN EXECUTION (ASYNC SAFE) ---------- */

    (async function () {
        const localData = await getLocalData();
        // console.log('localData:', localData);
        $('#loadingStatus').val(localData || '');

        if (localData === 'wempro') {
            // alert('Loading wempro data...');
            const url = new URL(window.location.href);
            const pathOnly = url.pathname + url.search + url.hash;

            console.log('url:', productData, category, productList, pathOnly);

            sendToBackground({
                productData,
                category,
                productList,
                currentUrl: pathOnly
            });
        }
    })();

})();
