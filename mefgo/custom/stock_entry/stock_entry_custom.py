import frappe


@frappe.whitelist()
def after_insert(doc, method=None):
    if (doc.custom_mefgo_job_order) and (doc.purpose == "Material Issue"):
        frappe.db.set_value('MEFGO Job Order',doc.custom_mefgo_job_order,{'issue_stock_entry':doc.name})
        frappe.db.commit()

        doc_job = frappe.get_doc('MEFGO Job Order',doc.custom_mefgo_job_order)
        doc_job.reload()

    if (doc.custom_mefgo_job_order) and  (doc.purpose == "Material Receipt"):
        frappe.db.set_value('MEFGO Job Order',doc.custom_mefgo_job_order,{'final_stock_entry':doc.name})
        frappe.db.commit()

        doc_job = frappe.get_doc('MEFGO Job Order',doc.custom_mefgo_job_order)
        doc_job.reload()

@frappe.whitelist()
def on_cancel(doc, method=None):
    if (doc.custom_mefgo_job_order) and (doc.purpose == "Material Issue"):
        frappe.db.set_value('MEFGO Job Order',doc.custom_mefgo_job_order,{'issue_stock_entry':""})
        frappe.db.commit()
        doc_job = frappe.get_doc('MEFGO Job Order',doc.custom_mefgo_job_order)
        doc_job.reload()

    if (doc.custom_mefgo_job_order) and  (doc.purpose == "Material Receipt"):
        frappe.db.set_value('MEFGO Job Order',doc.custom_mefgo_job_order,{'final_stock_entry':""})
        frappe.db.commit()
        doc_job = frappe.get_doc('MEFGO Job Order',doc.custom_mefgo_job_order)
        doc_job.reload()
