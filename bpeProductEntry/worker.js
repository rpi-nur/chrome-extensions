// background.js (FINAL)

chrome.runtime.onInstalled.addListener(() => {
  console.log('Service worker installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SAVE_PRODUCT') {

    fetch('http://127.0.0.1:8000/api/save/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.payload)
    })
    .then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json().catch(() => ({}));
    })
    .then(data => {
      sendResponse({ success: true, data });
    })
    .catch(err => {
      sendResponse({ success: false, error: err.toString() });
    });

    return true; // VERY IMPORTANT
  }
});
