// content.js

(function () {
  const domain = window.location.hostname;

  let thead, tdata, productInfo = '';
  const info = [];
  const spcTd = [];
  const spcTh = [];

  // ===============================
  // burtprocess.com
  // ===============================
  if (domain === 'www.burtprocess.com' || domain === 'burtprocess.com') {

    chrome.storage.local.clear();
    chrome.storage.sync.clear();

    $('body').append(`
      <div class="extension-box">
        <input type="text" id="seriesCode" placeholder="Series Code"/>
        <span class="submit">Submit</span>
      </div>
    `);

    $('.submit').on('click', function () {
      const productData = {
        productID: $('.current-sku-value').text(),
        productTitle: $.trim($('.product-name').text()),
        price: $.trim($('.price-info .price').last().text()).replace(/\$|,/g, ''),
        shortDescription: $.trim($('.short-description span').first().text()),
        productImage: $('.product-image-gallery img').first().attr('src'),
        description: $.trim($('.tab-content li[data-title^="OVERVIEW"]').text()),
        additional2: $('.tab-content li[data-title^="SPECIFICATIONS"] .component-content .component-content').html(),
        additional1: $('.tab-content li[data-title^="DOCUMENTS"] .component-content .component-content').html(),
        searchUrl: location.pathname.replace(/^\/+/, ''),
        seriesID: $('#seriesCode').val()
      };

      // saveToStorage(productData);
      sendToBackground(productData);
    });
  }

  // ===============================
  // micropumpparts.com (admin)
  // ===============================
  if (domain === 'www.micropumpparts.com' || domain === 'micropumpparts.com') {

    $('#content').append('<span class="paste">Paste btn</span>');
    getData();

    $('.paste').on('click', function () {
      if (!productInfo) return;

      $('#id_productID').val(productInfo[0]);
      $('#id_seriesID').val(productInfo[1]);
      $('#id_productTitle').val(productInfo[2]);
      $('#id_searchUrl').val(productInfo[3]);
      $('#id_shortDescription').val(productInfo[5]);
    });
  }

  // ===============================
  // helpers
  // ===============================

  function saveToStorage(productData) {
    chrome.storage.local.set({
      productInfo: JSON.stringify(productData)
    });
  }

  function getData() {
    chrome.storage.local.get(['spcTd'], res => {
      if (res.spcTd) tdata = JSON.parse(res.spcTd);
    });

    chrome.storage.local.get(['spcTh'], res => {
      if (res.spcTh) thead = JSON.parse(res.spcTh);
    });

    chrome.storage.local.get(['productInfo'], res => {
      if (res.productInfo) productInfo = JSON.parse(res.productInfo);
    });
  }

  // 🔥 IMPORTANT: API call goes to background
  function sendToBackground(payload) {
    console.log('Content: sending data to background', payload);
    chrome.runtime.sendMessage(
      {
        type: 'SAVE_PRODUCT',
        payload: payload
      },
      function (response) {
        if (response?.success) {
          console.log('Content: data saved successfully', response.data);
          alert('Content: data saved successfully', response.data);
        } else {
          console.error('Content: save failed', response?.error);
        }
      }
    );
  }

})();
