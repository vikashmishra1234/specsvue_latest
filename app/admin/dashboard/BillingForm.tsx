import { useState } from "react";
import jsPDF from "jspdf";

export default function GenerateBill() {
  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    productName: "",
    productModel: "",
    quantity: 1,
    gst: "",
    total: "",
    paymentMethod: "",
    date: new Date().toLocaleDateString(),
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // ====== COMPANY INFO ======
    const companyName = "SpecsVue";
    const companyAddress = "123, Vision Street, Lucknow, Uttar Pradesh - 226010";
    const companyEmail = "support@specsvue.in";
    const companyPhone = "+91 98765 43210";
    const companyGSTIN = "09ABCDE1234F1Z5";
    const ownerName = "Rishabh Sharma";

    // ====== HEADER ======
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(20, 20, 20);
    doc.text(companyName, 20, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(companyAddress, 20, 26);
    doc.text(`Email: ${companyEmail} | Phone: ${companyPhone}`, 20, 31);
    doc.text(`GSTIN: ${companyGSTIN} | Owner: ${ownerName}`, 20, 36);
    doc.setDrawColor(60, 60, 60);
    doc.line(20, 40, 190, 40);

    // ====== TITLE ======
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 33, 33);
    doc.text("Official Invoice / Bill", 20, 48);

    // ====== ORDER INFO ======
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Order ID: ${formData.orderId}`, 20, 58);
    doc.text(`Date: ${formData.date}`, 150, 58);

    // ====== CUSTOMER DETAILS ======
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details:", 20, 68);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`Name: ${formData.customerName}`, 20, 76);
    doc.text(`Email: ${formData.customerEmail}`, 20, 82);
    doc.text(`Phone: ${formData.customerPhone}`, 20, 88);
    doc.text(`Address: ${formData.customerAddress}`, 20, 94);

    // ====== PRODUCT DETAILS ======
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Product Details:", 20, 108);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`Product Name: ${formData.productName}`, 20, 116);
    doc.text(`Model: ${formData.productModel}`, 20, 122);
    doc.text(`Quantity: ${formData.quantity}`, 20, 128);
    doc.text(`GST: ${formData.gst}%`, 20, 134);
    doc.text(`Total Price (incl. GST): ₹${formData.total}`, 20, 140);

    // ====== PAYMENT INFO ======
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Payment Details:", 20, 156);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(`Payment Method: ${formData.paymentMethod}`, 20, 164);

    // ====== FOOTER ======
    doc.setDrawColor(100, 100, 100);
    doc.line(20, 260, 190, 260);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for shopping with SpecsVue!", 20, 268);
    doc.text("This is a system-generated invoice. No signature required.", 20, 274);

    doc.save(`Invoice_${formData.orderId || "SpecsVue"}.pdf`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-10 border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900">
        Generate Product Bill
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {Object.keys(formData).map(
          (key) =>
            key !== "date" && (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  name={key}
                  value={(formData as any)[key]}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm text-gray-800 focus:ring-2 focus:ring-gray-700"
                />
              </div>
            )
        )}
      </div>

      <button
        onClick={generatePDF}
        className="mt-6 w-full bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition"
      >
        Generate PDF Bill
      </button>
    </div>
  );
}
