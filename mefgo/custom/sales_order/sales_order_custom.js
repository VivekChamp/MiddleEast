frappe.ui.form.on('Sales Order', {
    refresh(frm) {
       // your code here

       if (cur_frm.doc.docstatus == 1){
         frm.add_custom_button('Job Order', () => {
   
            cur_frm.call({
               method: "erpnext.selling.doctype.sales_order.sales_order.get_work_order_items",
               args: {
                  sales_order: cur_frm.doc.name,
               },
               freeze: true,
               callback: function (r) {
                  if (!r.message) {
                     frappe.msgprint({
                        title: __('Work Order not created'),
                        message: __('No Items with Bill of Materials to Manufacture'),
                        indicator: 'orange'
                     });
                     return;
                  } else {
                     const fields = [{
                        label: 'Items',
                        fieldtype: 'Table',
                        fieldname: 'items',
                        description: __('Select Item and Qty for Production'),
                        fields: [{
                           fieldtype: 'Read Only',
                           fieldname: 'item_code',
                           label: __('Item Code'),
                           in_list_view: 1
                        },
                        {
                           fieldtype: 'Float',
                           fieldname: 'pending_qty',
                           reqd: 1,
                           label: __('Qty'),
                           in_list_view: 1
                        },
                        {
                           fieldtype: 'Data',
                           fieldname: 'sales_order_item',
                           reqd: 1,
                           label: __('Sales Order Item'),
                           hidden: 1
                        }],
                        data: r.message,
                        get_data: () => {
                           return r.message
                        }
                     }]
                     var d = new frappe.ui.Dialog({
                        title: __('Select Items to Manufacture'),
                        fields: fields,
                        primary_action: function () {
                           var data = {
                              items: d.fields_dict.items.grid.get_selected_children()
                           };
                           
                           
                           console.log(data)
                           
                           frappe.call({
                              method: 'mefgo.custom.sales_order.sales_order_custom.create_mefgo_job_order',
                              args: {
                                 data: data,
                                 delivery_date: cur_frm.doc.delivery_date,
                                 transaction_date: cur_frm.doc.transaction_date,
                                 name: cur_frm.doc.name,
   
                              },
                              freeze: true,
                              callback: function (r) {
                                 if (r.message) {
                                    console.log(r)
                                    
                                    frappe.set_route('List', "MEFGO Job Order",{'ref_no':cur_frm.doc.name})
                                    //  frappe.msgprint({
                                    //     message: __('Work Orders Created: {0}', [r.message.map(function (d) {
                                    //       return repl('<a href="/app/work-order/%(name)s">%(name)s</a>', {
                                    //           name: d
                                    //       })
                                    //     }).join(', ')]),
                                    //     indicator: 'green'
                                    //  })
                                 }
                                 d.hide();
                              }
                           });
                           
                           
                        },
                        primary_action_label: __('Create')
                     });
                     d.show();
                  }
               }
            });
   
   
         })
      }

    }
 })