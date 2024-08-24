import json
import frappe
from frappe import _

@frappe.whitelist()
def create_mefgo_job_order():
    data = frappe.form_dict.get('data')
    delivery_date = frappe.form_dict.get('delivery_date')
    transaction_date = frappe.form_dict.get('transaction_date')
    name = frappe.form_dict.get('name')

    item = json.loads(data)

    completed = 0
    msg = ''

    if len(item['items']) == 0:
        completed = 1
        msg = _('Kindly select items')

    for i in item['items']:
        i['qty'] = i['pending_qty']
        i['sales_order'] = name
        i['item_description'] = i['description']
        
        comp = frappe.db.sql(f"""SELECT
                                    COALESCE(SUM(mjoi.qty), 0) as qty
                                 FROM `tabMEFGO Job Order Item` mjoi
                                 WHERE mjoi.item_code = %s AND mjoi.docstatus IN %s AND sales_order = %s
                                 LIMIT 1""", (i["item_code"], tuple([0, 1]), name), as_dict=1)

        reqd = frappe.db.get_value('Sales Order Item', i['sales_order_item'], 'qty')
        if len(comp) == 1 and comp[0]['qty'] >= reqd:
            completed = 1
            msg += f"<b>Row {i['idx']}:</b> {i['item_code']} has already been produced in the required quantity <b> ({comp[0]['qty']}) </b>.<br>"

    if completed:
        frappe.throw(msg)


    for i in item['items']:
        
        doc = frappe.get_doc({
        
            "order_date": transaction_date,
            "date_required": delivery_date,
            "ref_no": name,
            "doctype": "MEFGO Job Order",
            "mefgo_job_order_item": [i],
        
        }).insert()
        frappe.db.commit()
        

    frappe.response['message'] = doc.name
