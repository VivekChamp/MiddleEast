// Copyright (c) 2024, Vivek and contributors
// For license information, please see license.txt
frappe.ui.form.on('MEFGO Job Order', {
	refresh: function(frm) {



	if (cur_frm.doc.docstatus == 1){
		frm.add_custom_button('Issue Material', () => {


            if (cur_frm.doc.issue_stock_entry){
                frappe.set_route('Form', "Stock Entry",cur_frm.doc.issue_stock_entry)
            }
            else{
				frappe.new_doc("Stock Entry", {}, doc => {
					doc.docstatus = 0;
					doc.custom_mefgo_job_order = cur_frm.doc.name;
					doc.doctype = "Stock Entry";
					doc.naming_series = "MAT-STE-.YYYY.-";
					doc.purpose = "Material Issue";
					doc.add_to_transit = 0;
					doc.posting_date = frappe.datetime.get_today();
					doc.set_posting_time = 0;
					doc.inspection_required = 0;
					doc.apply_putaway_rule = 0;
					doc.from_bom = 0;
					doc.use_multi_level_bom = 1;
					doc.is_opening = "No";
					doc.is_return = 0;
					doc.stock_entry_type = "Material Issue";
				});
            }

		}, 'Stock Entry');


		frm.add_custom_button('Final Stock Entry', () => {


            if (cur_frm.doc.final_stock_entry){
                frappe.set_route('Form', "Stock Entry",cur_frm.doc.final_stock_entry)
            }
            else{

					frappe.new_doc("Stock Entry", {}, doc => {
						doc.docstatus = 0;
						doc.custom_mefgo_job_order = cur_frm.doc.name;
						doc.doctype = "Stock Entry";
						doc.naming_series = "MAT-STE-.YYYY.-";
						doc.purpose = "Material Receipt";
						doc.add_to_transit = 0;
						doc.posting_date = frappe.datetime.get_today();
						doc.set_posting_time = 0;
						doc.inspection_required = 0;
						doc.apply_putaway_rule = 0;
						doc.from_bom = 0;
						doc.use_multi_level_bom = 1;
						doc.is_opening = "No";
						doc.is_return = 0;
						doc.stock_entry_type = "Material Receipt";

						const items = cur_frm.doc.mefgo_job_order_item

						items.forEach((item, index) => {
							let row = frappe.model.add_child(doc, "items");
							row.item_code = item.item_code;
							row.item_description = item.description;
							row.qty = item.qty;
							row.custom_mefgo_job_order = cur_frm.doc.name;

							row.idx = index + 1;
						});
					});






            }

		}, 'Stock Entry');
	}

	}
});




















































// const fields = [{
// 	label: 'Items',
// 	fieldtype: 'Table',
// 	fieldname: 'items',
// 	description: __('Select Item and Qty for Production'),
// 	fields: [{
// 			fieldtype: 'Read Only',
// 			fieldname: 'item_code',
// 			label: __('Item Code'),
// 			in_list_view: 1
// 		},
// 		{
// 			fieldtype: 'Float',
// 			fieldname: 'qty',
// 			reqd: 1,
// 			label: __('Qty'),
// 			in_list_view: 1
// 		},
// 		{
// 			fieldtype: 'Data',
// 			fieldname: "name",
// 			reqd: 1,
// 			label: __("MEFGO Job Order Item"),
// 			hidden: 1
// 		}
// 	],
// 	data: cur_frm.doc.mefgo_job_order_item
// }];

// var d = new frappe.ui.Dialog({
// 	title: __('Select Items to Manufacture'),
// 	fields: fields,
// 	primary_action: function() {
// 		var data = {
// 			items: d.fields_dict.items.grid.get_selected_children()
// 		};

// 		console.log(data);

// 		frappe.call({
// 			method: 'mefgo.mefgo.doctype.mefgo_job_order.mefgo_job_order.create_stock_entry',
// 			args: {
// 				data: data,
// 				delivery_date: cur_frm.doc.delivery_date,
// 				transaction_date: cur_frm.doc.transaction_date,
// 				name: cur_frm.doc.name
// 			},
// 			freeze: true,
// 			callback: function(r) {
// 				if (r.message) {
// 					console.log(r);

// 					frappe.new_doc("Stock Entry", {}, doc => {
// 						doc.docstatus = 0;
// 						doc.custom_mefgo_job_order = cur_frm.doc.name;
// 						doc.doctype = "Stock Entry";
// 						doc.naming_series = "MAT-STE-.YYYY.-";
// 						doc.purpose = "Material Issue";
// 						doc.add_to_transit = 0;
// 						doc.posting_date = frappe.datetime.get_today();
// 						doc.set_posting_time = 0;
// 						doc.inspection_required = 0;
// 						doc.apply_putaway_rule = 0;
// 						doc.from_bom = 0;
// 						doc.use_multi_level_bom = 1;
// 						doc.is_opening = "No";
// 						doc.is_return = 0;
// 						doc.stock_entry_type = "Material Issue";

// 						const items = data['items']

// 						items.forEach((item, index) => {
// 							let row = frappe.model.add_child(doc, "items");
// 							row.item_code = item.item_code;
// 							// row.stock_uom = item.stock_uom;
// 							// row.cost_center = item.cost_center;
// 							// row.expense_account = item.expense_account;
// 							row.qty = item.qty;
// 							row.custom_mefgo_job_order = cur_frm.doc.name;

// 							row.idx = index + 1;
// 						});
// 					});
// 				}
// 				d.hide();
// 			}
// 		});
// 	},
// 	primary_action_label: __('Create')
// });
// d.show();