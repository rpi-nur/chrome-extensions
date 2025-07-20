chrome.storage.local.set({ key: 'gggggggggggggggggggggggg' }).then(() => {
 
  });

      chrome.storage.local.get("key", function(n1) {
        console.log(n1);
        console.log('------n1--------');
      });