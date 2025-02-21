(() => {
  'use strict';
  kintone.events.on(['app.record.create.submit.success', 'app.record.edit.submit.success'], (event) => {
    const record = event.record;
    
    // Order details from the current record
    const orderType = record['order_type'].value; // Sale or Purchase
    const itemCode = record['item_code'].value;
    const itemName = record['item_name'].value;
    const quantity = parseInt(record['quantity'].value);
    
    // Item App configuration
    const itemAppId = 16; // App Id of Items App
    const itemQuery = `item_code = "${itemCode}"`;
    
    // Fetch the item from the Item App
    return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
        app: itemAppId,
        query: itemQuery,
    })
    .then(itemResponse => {
      // Ensure 'records' exists and is an array
      if (itemResponse.records && Array.isArray(itemResponse.records)) {
          const recordsLength = itemResponse.records.length;
          
          // if the ordered item exists in the Item App, calculate the updated stock
          if (recordsLength > 0 ) {
            const itemRecord = itemResponse.records[0];
            const currentStock = parseInt(itemRecord['stock'].value);
            const newStock = orderType === 'Sale' ? currentStock - quantity : currentStock + quantity;
            console.log(currentStock, newStock);

            // update the stock number 
            return kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', {
                app: itemAppId,
                id: itemRecord['$id'].value, // Get record ID
                record: {
                    'stock': {
                        value: newStock, // Update this field with the order value
                    },
                },
            });
          }
          
          else {
            // Delete the item if stock is zero or less
            kintone.api(kintone.api.url('/k/v1/record', true), 'DELETE', {
                app: itemAppId,
                id: itemRecord['$id'].value,
            });
          }
      } 
      
      else {
          console.log('No records found or response format is incorrect');
          
      }
    })
    .catch(error => {
    console.error('Error fetching records:', error);
    });
  });
})();
