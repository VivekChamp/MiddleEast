frappe.ui.form.on('Stock Entry', {
	onload_post_render(frm) {
		// your code hereyooo
		console.log('yooo')
		
		
		if (cur_frm.doc.custom_mefgo_job_order && cur_frm.doc.purpose == "Material Receipt"){
		
		$.each(frm.doc.items,  function(i,  d) {
		    
        if (d.item_code == '' || d.item_code == undefined ){
            frappe.model.remove_from_locals(d.doctype,d.name)
            
        }
        else{
            		    
            		    // Convert the payload into JSON format
            var payload = {
                "docs":cur_frm.doc,
                "method": "get_item_details",
                "args": {
                    "item_code": d.item_code,
                    "warehouse": "",
                    "transfer_qty": 0,
                    "expense_account": "Stock Adjustment - MEEFF",
                    "cost_center": "Main - MEEFF",
                    "company": "Middle East Elite Fiberglass Factory",
                    "qty": d.qty,
                    "voucher_type": "Stock Entry",
                    "voucher_no": "new-stock-entry-detail-puipqbscjl",
                    "allow_zero_valuation": 1
                }
            };
            
            // Make the Frappe API call
            frappe.call({
                method: "run_doc_method", // Change this to the appropriate method name in your Frappe app
                args: {
                    'docs': payload.docs,
                    'method': payload.method,
                    'args': payload.args
                },
                callback: function(response) {
                    if (!response.exc) {
                        console.log(response.message);
                        // Handle the response data
                        
                        frappe.model.set_value(d.doctype,d.name,response.message)
                        
                        
                        
                    } else {
                        console.error(response.exc);
                    }
                }
            });

		    
        }
            
            
        });
		
		}
		
		
		
		
		
		
		
	}
})