import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  invoiceUri = "http://localhost:3000/api/user/invoice"
  constructor(private http: HttpClient) { }

  setInvoice(user_reg_id, customer_details, purchased_date, grand_total) {
    console.log("set invoice called in invoice service");
    const set_invoice = {
      user_reg_id: user_reg_id,
      customer_details: customer_details,
      purchased_date: purchased_date,
      grand_total: grand_total
    }
    return this.http.post(`${this.invoiceUri}`, set_invoice);
  }

  getAllInvoices() {
    return this.http.get<any>(`${this.invoiceUri}`);
  }
  getInvoiceById(user_reg_id) {
    return this.http.get<any>(`${this.invoiceUri}/${user_reg_id}`);
  }

  updateInvoice(customer_details, purchased_date, grand_total, user_reg_id) {
    const update_invoice = {
      customer_details: customer_details,
      purchased_date: purchased_date,
      grand_total: grand_total,
      user_reg_id: user_reg_id,
    }
    return this.http.put(`${this.invoiceUri}/${user_reg_id}`, update_invoice);
  }
  deleteInvoice(user_reg_id) {
    return this.http.delete(`${this.invoiceUri}/${user_reg_id}`);
  }
}
