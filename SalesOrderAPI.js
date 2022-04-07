/** 
@NApiVersion 2.0
@NScriptType Restlet
@NModuleScope Public
*/

define(['N/log', 'N/record'], function (log, record) {
    var customer;
    var customerId;
    var map = { 'Company': 'companyname', 'address': 'addr1', 'city': 'city', 'state': 'state', 'zip': 'zip' };

    function createCustomer(params) {
        customer = record.create({
            type: record.Type.CUSTOMER
        });

        // 98 = CSG Customer Form
        customer.setValue({
            fieldId: 'customform',
            value: 98
        });

        // insert address sublist and get the address subrecord
        customer.insertLine({
            sublistId: 'addressbook',
            line: 0
        });

        customer.setSublistValue({
            sublistId: 'addressbook',
            fieldId: 'label',
            line: 0,
            value: 'Default Address'
        });

        customer.setSublistValue({
            sublistId: 'addressbook',
            fieldId: 'defaultbilling',
            line: 0,
            value: true
        });

        customer.setSublistValue({
            sublistId: 'addressbook',
            fieldId: 'defaultshipping',
            line: 0,
            value: true
        });

        var addressRecord = customer.getSublistSubrecord({
            sublistId: 'addressbook',
            fieldId: 'addressbookaddress',
            line: 0
        });

        // map keys to set values
        for (var key in params) {
            if (!map[key]) {
                continue;
            }

            log.debug({
                title: 'Netsuite map:',
                details: map[key] + '->' + params[key]
            });

            if (key.indexOf('Company') == -1) {
                // set fields for address records
                addressRecord.setValue({
                    fieldId: map[key],
                    value: params[key]
                });
            } else {
                // set customer companyname fields
                customer.setValue({
                    fieldId: map[key],
                    value: params[key]
                });

                customer.setValue({
                    fieldId: 'entityid',
                    value: params[key]
                });
            }
        }

        var newCustomerId = customer.save();
        return newCustomerId;
    }

    function createSalesOrder() {
        // create the sales order
        // 6714 = Peplink MAX-BR1-LTEA-W-T
        // 2577 = BULKSIM-TRI-A-D
        // 5896 = Manufacturer Warranty
        var items = [6714, 2577, 5896];
        var itemsAmounts = [0, 0, 0];
        var so = record.create({
            type: record.Type.SALES_ORDER
        });

        so.setValue({
            fieldId: 'entity',
            value: customerId
        });

        for (var i = 0; i < items.length; i++) {
            log.debug({
                title: 'add item ' + i,
                details: '=' + items[i]
            });
            so.setSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i,
                value: items[i]
            });
            so.setSublistValue({
                sublistId: 'item',
                fieldId: 'amount',
                line: i,
                value: itemsAmounts[i]
            });
        }

        so.save();
        log.debug({
            title: 'new sales order created',
            details: 'id=' + so.id
        });
    }

    function post(params) {
        log.debug({
            title: 'Received POST',
            details: '=' + JSON.stringify(params)
        });

        customerId = createCustomer(params);

        log.debug({
            title: 'new customer',
            details: 'id=' + customerId
        });

        createSalesOrder();

        return;
    }
    
    return {
        post: post
    }
});