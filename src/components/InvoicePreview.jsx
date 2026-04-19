import React from "react";

// Indian Number to Words (supports Crores)
const numberToWords = (num) => {
  if (num === 0) return "Zero";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const getWordsBelowThousand = (n) => {
    let str = "";
    if (n > 99) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n = n % 100;
    }
    if (n > 19) {
      str += tens[Math.floor(n / 10)] + " ";
      n = n % 10;
    }
    if (n > 0) {
      str += ones[n] + " ";
    }
    return str.trim();
  };

  let result = "";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const hundredPart = num;

  if (crore) result += getWordsBelowThousand(crore) + " Crore ";
  if (lakh) result += getWordsBelowThousand(lakh) + " Lakh ";
  if (thousand) result += getWordsBelowThousand(thousand) + " Thousand ";
  if (hundredPart) result += getWordsBelowThousand(hundredPart);

  return result.trim();
};

const InvoicePreview = ({ company, client, services, notes }) => {

  // TOTAL QTY
  const totalQty = services.reduce((sum, item) => sum + Number(item.qty), 0);

  // TOTAL AMOUNT
  const totalAmount = services.reduce(
    (sum, item) => sum + Number(item.qty) * Number(item.rate),
    0
  );

  // GROUP SERVICES BY CATEGORY (FIXED)
  const groupedItems = Object.values(
    services.reduce((acc, item) => {
      const key = item.category;

      if (!acc[key]) {
        acc[key] = {
          category: item.category,
          services: []
        };
      }

      acc[key].services.push({
        service: item.service,
        qty: Number(item.qty),
        rate: Number(item.rate),
        amount: Number(item.qty) * Number(item.rate)
      });

      return acc;
    }, {})
  );

  const totalWords = numberToWords(totalAmount) + " Only";

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
        <p>{company.proprietor} - PROPRIETOR / PAN: {company.pan}</p>
      </div>

      {/* QUOTE + DATE */}
      <div className="flex justify-between mt-6 text-sm">
        <p><b>Invoice Number: {client.quoteNo}</b></p>
        <p><b>Date: {client.date}</b></p>
      </div>
      
      {/* CLIENT */}
      <div className="mt-6">
        <p className="font-bold">To,</p>
        <p className="whitespace-pre-line">{client.clientName}</p>
        <br/>
        <p className="font-bold">Add :</p>
        <p className="whitespace-pre-line">{client.clientAddress}</p>
      </div>

      <br/>

      {/* TITLE */}
      <h2 className="font-bold mt-6 underline">
        INVOICE FOR LIFT CONSULTANCY CHARGES - FOR {client.projectTitle}
      </h2>

      {/* TABLE */}
      <table
  className="w-full mt-6 border border-black text-sm"
  style={{ borderCollapse: "collapse" }}
>
  <thead>
    <tr>
      <th className="border border-black p-2 w-[60px]">SR NO</th>
      <th className="border border-black p-2">DESCRIPTION</th>
      <th className="border border-black p-2 w-[80px]">QTY</th>
      <th className="border border-black p-2 w-[120px]">RATE</th>
      <th className="border border-black p-2 w-[140px]">AMOUNT</th>
    </tr>
  </thead>

  <tbody>
    {groupedItems.map((group, index) => (
      <tr key={index}>
        
        {/* SR NO */}
        <td className="border border-black p-2 align-top text-center">
          {index + 1}
        </td>

        {/* DESCRIPTION */}
        <td className="border border-black p-3 align-top">
          <b>{group.category} Charges</b>
          <br /><br />

          {group.services.map((srv, i) => (
            <div key={i} className="py-1">{srv.service}</div>
          ))}

          <br />
          <br />
<br />
<b>{notes.description}</b>
<br />
{notes.workOrder}
<br />
Dated: {notes.workDate}
        </td>

        {/* QTY */}
        <td className="border border-black p-3 align-top text-center">
          <br /><br />
          {group.services.map((srv, i) => (
            <div key={i} className="py-1">{srv.qty}</div>
          ))}
        </td>

        {/* RATE */}
        <td className="border border-black p-3 align-top text-right">
          <br /><br />
          {group.services.map((srv, i) => (
            <div key={i} className="py-1">
              {srv.rate.toLocaleString()}
            </div>
          ))}
        </td>

        {/* AMOUNT */}
        <td className="border border-black p-3 align-top text-right">
          <br /><br />
          {group.services.map((srv, i) => (
            <div key={i} className="py-1">
              {srv.amount.toLocaleString()}
            </div>
          ))}
        </td>
      </tr>
    ))}

    {/* TOTAL ROW */}
    <tr>
      <td colSpan="2" className="border border-black p-2"></td>

      <td className="border border-black p-2 text-center font-bold">
        {totalQty}
      </td>

      <td className="border border-black p-2 font-bold text-center">
        Total
      </td>

      <td className="border border-black p-2 text-right font-bold">
        ₹ {totalAmount.toLocaleString()}
      </td>
    </tr>
  </tbody>
</table>

      {/* AMOUNT WORDS */}
      <p className="mt-4"><b>Amount in Words: {totalWords}</b></p>

      {/* BANK DETAILS */}
      <div className="mt-6">
        <p>Bank Details:</p>
        <b>
          <p>Bank: HDFC Bank</p>
          <p>Account Name: {company.companyName}</p>
          <p>Account No: XXXXXXXXX</p>
          <p>IFSC: HDFC000XXXX</p>
        </b>
      </div>

      {/* SIGNATURE */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ display: 'inline-block', textAlign: 'center' }}>
          <p><b>For {company.proprietor}</b></p>
          <br/><br/><br/>
          <p><b>Proprietor</b></p>
        </div>
      </div>

    </div>
  );
};

export default InvoicePreview;