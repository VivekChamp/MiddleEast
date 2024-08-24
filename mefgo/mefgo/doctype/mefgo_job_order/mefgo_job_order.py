# Copyright (c) 2024, Vivek and contributors
# For license information, please see license.txt

import frappe
import json
from frappe.model.document import Document

class MEFGOJobOrder(Document):
	def after_insert(self):
		self.issue_stock_entry = ""
		self.final_stock_entry = ""




@frappe.whitelist()
def create_stock_entry():
	
	data = frappe.form_dict.get('data')
	delivery_date = frappe.form_dict.get('delivery_date')
	transaction_date = frappe.form_dict.get('transaction_date')
	name = frappe.form_dict.get('name')
	
	item = json.loads(data)

	items = []


 
	completed = 0
	msg = ''

	if len(item['items']) == 0:
		completed = 1
		msg = frappe.throw('Kindly select items')

	for i in item['items']:
		item_code = i['item_code']
		qty = i['qty']
		custom_mefgo_job_order = i['name']  # Assuming 'name' field is passed as MEFGO Job Order Item
		# custom_mefgo_job_order = i['custom_mefgo_job_order']

		# Check if the item has already been issued in sufficient quantity
		comp = frappe.db.sql("""
			SELECT COALESCE(SUM(sed.qty), 0) as qty
			FROM `tabStock Entry Detail` sed 
			left join `tabStock Entry` se on se.name = sed.parent 
			WHERE sed.item_code = %s AND sed.docstatus in (1,0) 
				AND se.purpose = 'Material Issue' 
				AND sed.custom_mefgo_job_order = %s
			LIMIT 1
		""", (item_code, custom_mefgo_job_order), as_dict=1)

		reqd_qty = frappe.db.get_value("MEFGO Job Order Item", custom_mefgo_job_order, 'qty')
		if len(comp) == 1 and comp[0]['qty'] >= reqd_qty:
			completed = 1
			msg += f"<b>Item {item_code}:</b> has already been issued in the required quantity <b>({comp[0]['qty']})</b>.<br>"

	if completed:
		frappe.throw(msg)


	for i in item['items']:
		items.append({
			'item_code': i['item_code'],
			'qty': i['qty'],
			'doctype': 'Stock Entry Detail',
			'custom_mefgo_job_order': i['name'],  # Assuming 'name' field is passed from frontend
			"s_warehouse":"Work In Progress - MEEFF",	
		})
	
	stock_entry = frappe.get_doc({
		'doctype': 'Stock Entry',
		'purpose': 'Material Issue',
		'posting_date': transaction_date,
		'transaction_date': transaction_date,
		'set_posting_time': 1,
		'custom_mefgo_job_order': name,
		'stock_entry_type': 'Material Issue',
		'items': items
	})
	
	stock_entry.insert()
	frappe.db.commit()
	
	frappe.response['message'] = 'Stock Entry created successfully.'