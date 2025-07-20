function extenRun() {
    let inventorySave = false;
    $("#myitable .mt-table tr[data-actions]").each(function() {
        const rowData = $(this).attr('data-row-data');
        var id = $(this).attr('id');
        var asin = $('#' + id + '-title-asin').text().trim();
        var price = parseFloat($('#' + id + '-price input').val());
        var lPrice = $('#' + id + '-lowPrice-lowPrice a').text();

        // console.log('lowPrice text: ' + lPrice);

        lPrice = lPrice.replace('$', '').trim();
        // console.log('lowPrice text after trim: ' + lPrice);

        lPrice = parseFloat(lPrice);


        // const obj = JSON.parse(rowData);
        // console.log(typeof lPrice);


        // console.log('price: ' + price);
        // console.log('lowPrice: ' + lPrice);
        // console.log(asin);


        var index = inventory.hasOwnProperty(asin);
        if (index && !isNaN(lPrice)) {

            if (inventory[asin].updateTigger) {
                // console.log('+++++++++++++++++++');
                // console.log('price: ' + price);
                // console.log('lowPrice: ' + lPrice);
                // console.log(asin);
                if (inventory[asin].price < lPrice) {
                    $('#' + id + '-price input').val((lPrice - 0.05));
                    $('#' + id + '-action button').click();
                    inventorySave = true;
                    // console.log('price update');
                }
            }
        }
        // console.log('-------------------------------');
    });
    if (inventorySave === true) {
        $('#saveall span').click();
    }

}




$(document).ready(function() {
    setTimeout(extenRun, 9000);
    let x = Math.floor((Math.random() * 10) + 9);
    console.log(x);
    console.log(x * 60000);
    setTimeout(function() { location.reload() }, (x * 9000));


});


const inventory = {
    B0xxx_demo: { updateTigger: 0, price: 1, qty: 0 },

    B01LRWTLK4: { updateTigger: 1, price: 62, qty: 50 },
    B07KFN4VML: { updateTigger: 10, price: 10, qty: 4 },
    B01ASVMC4M: { updateTigger: 1, price: 48, qty: 4 },

    B0029JRMP6: { updateTigger: 0, price: 15, qty: 3 },
    B07PTQP4N4: { updateTigger: 0, price: 25.9, qty: 9 },
    B07L6XCY21: { updateTigger: 0, price: 20, qty: 7 },
    B07VFDNQFN: { updateTigger: 0, price: 28, qty: 7 },
    B07H8NPY6C: { updateTigger: 0, price: 70, qty: 0 },
    B09S6R7R66: { updateTigger: 0, price: 18, qty: 0 },
    B000VDV27Q: { updateTigger: 0, price: 15, qty: 0 },
    B07SW13PX4: { updateTigger: 0, price: 70, qty: 0 },
    B00FFJ0LV4: { updateTigger: 0, price: 70, qty: 0 },
    B019Q0MXH2: { updateTigger: 0, price: 70, qty: 0 },
};