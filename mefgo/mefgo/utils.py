import frappe 



@frappe.whitelist()
def make_MEFGO_Job_Order(data):
    return data