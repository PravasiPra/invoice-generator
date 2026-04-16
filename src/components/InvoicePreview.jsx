import React from "react";

// Convert number to words (simple version)
const numberToWords = (num) => {
  const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
  "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen",
  "Eighteen","Nineteen"];
  const b = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

  if (num === 0) return "Zero";
  if (num < 20) return a[num];
  if (num < 100) return b[Math.floor(num/10)] + " " + a[num%10];
  if (num < 1000) return a[Math.floor(num/100)] + " Hundred " + numberToWords(num%100);
  if (num < 100000) return numberToWords(Math.floor(num/1000)) + " Thousand " + numberToWords(num%1000);
  return num;
};

const InvoicePreview = ({ company, client, services }) => {

  const total = services.reduce((sum,item)=> sum + item.price * item.qty,0);
  const totalWords = numberToWords(total) + " Only";

  return (
    <div
  id="invoice"
  className="bg-white text-black shadow-lg mx-auto"
  style={{ width: "794px", padding: "40px" }}
>

      {/* HEADER */}
      <div className="text-center border-b pb-4">
        <h1 className="text-3xl font-bold text-red-600">{company.companyName}</h1>
        <p>{company.addressLine1}</p>
        <p>{company.addressLine2}</p>
        <p>Prop: {company.proprietor} | PAN: {company.pan}</p>
      </div>

      {/* QUOTE + DATE */}
      <div className="flex justify-between mt-6 text-sm">
        <p><b>Quote No:</b> {client.quoteNo}</p>
        <p><b>Date:</b> {client.date}</p>
      </div>

      {/* CLIENT */}
      <div className="mt-6">
        <p className="font-bold">To,</p>
        <p className="font-semibold">{client.clientName}</p>
        <p className="font-bold">Add :</p>
        <p className="whitespace-pre-line">{client.clientAddress}</p>
      </div>

      {/* TITLE */}
      <h2 className="text-center font-bold mt-6">
        BILL FOR LIFT CONSULTANCY CHARGES FOR {client.projectTitle}
      </h2>

      {/* TABLE */}
      <table className="w-full mt-6 border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">SR NO</th>
            <th className="border p-2">DESCRIPTION</th>
            <th className="border p-2">QTY</th>
            <th className="border p-2">RATE</th>
            <th className="border p-2">AMOUNT</th>
          </tr>
        </thead>

        <tbody>
          {services.map((item,index)=>(
            <tr key={index}>
              <td className="border p-2 text-center">{index+1}</td>
              <td className="border p-2">
                <b>{item.category}</b><br/>
                {item.service}
              </td>
              <td className="border p-2 text-center">{item.qty}</td>
              <td className="border p-2 text-center">₹{item.price}</td>
              <td className="border p-2 text-center">₹{item.price * item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAL */}
      <div className="flex justify-end mt-4">
        <p className="text-xl font-bold">Total: ₹ {total}</p>
      </div>

      {/* AMOUNT WORDS */}
      <p className="mt-4"><b>Amount in Words:</b> {totalWords}</p>

      {/* BANK DETAILS */}
      <div className="mt-6">
        <p className="font-bold">Bank Details:</p>
        <p>Bank: HDFC Bank</p>
        <p>Account Name: {company.companyName}</p>
        <p>Account No: XXXXXXXXX</p>
        <p>IFSC: HDFC000XXXX</p>
      </div>

      {/* SIGNATURE */}
      <div style={{ textAlign: 'right' }}>
      <div style={{ display: 'inline-block', textAlign: 'center' }}>
      <p>For {company.proprietor}</p>
        <br/>
        <br/>
        <br/>
    <p>Proprietor</p>
  </div>
</div>

    </div>
  );
};

export default InvoicePreview;