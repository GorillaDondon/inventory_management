(() => {
  'use strict';

  kintone.events.on(['app.record.create.submit.success', 'app.record.edit.submit.success'], (event) => {
    const record = event.record;

    // Extract details from the Orders App regarding customers or vendors
    const firstName = record['new_first_name'].value;
    const lastName = record['new_last_name'].value;

    const contactAppId = 14; 

    
    return event;
  });

})();
