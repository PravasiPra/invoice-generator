import { useState } from "react";
import { servicesData } from "./data/services";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function App() {

  // Company Details (pre-filled)
  const [company, setCompany] = useState({
    companyName: "ABC Lift Consultancy",
    name: "Mr Consultant",
    phone: "",
    email: ""
  });

  // Client Details
  const [client, setClient] = useState({
    clientName: "",
    project: "",
    invoiceNo: Date.now(),
    date: new Date().toLocaleDateString()
  });

  // Services list added to invoice
  const [items, setItems] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
const [selectedService, setSelectedService] = useState("");
const [price, setPrice] = useState("");

const addService = () => {
  if (!selectedCategory || !selectedService || !price) {
    alert("Please select service and enter price");
    return;
  }

  const newItem = {
    category: selectedCategory,
    service: selectedService,
    price: price,
  };

  setItems([...items, newItem]);

  // reset fields
  setSelectedCategory("");
  setSelectedService("");
  setPrice("");
};

const totalAmount = items.reduce(
  (sum, item) => sum + Number(item.price),
  0
);


const generatePDF = async () => {
  const invoice = document.getElementById("invoice");

  const canvas = await html2canvas(invoice);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 210;
  const pageHeight = 295;

  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("invoice.pdf");
};

const shareWhatsApp = () => {
  const message = `Invoice from ${company.companyName}
Client: ${client.clientName}
Amount: ₹ ${totalAmount}`;
  
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

const shareEmail = () => {
  const subject = "Invoice";
  const body = `Invoice from ${company.companyName}
Client: ${client.clientName}
Total Amount: ₹ ${totalAmount}`;

  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
};

  return (
  <div className="p-4 max-w-xl mx-auto space-y-6">

    <h1 className="text-2xl font-bold">Invoice Generator</h1>

    {/* Company Details */}
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">Company Details</h2>

      <input
        className="w-full border p-2 mb-2 rounded"
        placeholder="Company Name"
        value={company.companyName}
        onChange={(e) =>
          setCompany({ ...company, companyName: e.target.value })
        }
      />

      <input
        className="w-full border p-2 mb-2 rounded"
        placeholder="Consultant Name"
        value={company.name}
        onChange={(e) =>
          setCompany({ ...company, name: e.target.value })
        }
      />

      <input
        className="w-full border p-2 mb-2 rounded"
        placeholder="Phone"
        value={company.phone}
        onChange={(e) =>
          setCompany({ ...company, phone: e.target.value })
        }
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        value={company.email}
        onChange={(e) =>
          setCompany({ ...company, email: e.target.value })
        }
      />
    </div>
{/* Client Details */}
<div className="bg-white p-4 rounded shadow">
  <h2 className="font-semibold mb-3">Client Details</h2>

  <input
    className="w-full border p-2 mb-2 rounded"
    placeholder="Client Name"
    value={client.clientName}
    onChange={(e) =>
      setClient({ ...client, clientName: e.target.value })
    }
  />

  <input
    className="w-full border p-2 mb-2 rounded"
    placeholder="Project Name"
    value={client.project}
    onChange={(e) =>
      setClient({ ...client, project: e.target.value })
    }
  />

  <input
    className="w-full border p-2 mb-2 rounded"
    placeholder="Invoice Number"
    value={client.invoiceNo}
    onChange={(e) =>
      setClient({ ...client, invoiceNo: e.target.value })
    }
  />

  <input
    type="date"
    className="w-full border p-2 rounded"
    value={new Date().toISOString().split("T")[0]}
    onChange={(e) =>
      setClient({ ...client, date: e.target.value })
    }
  />
</div>

{/* Services Section */}
<div className="bg-white p-4 rounded shadow">
  <h2 className="font-semibold mb-3">Add Services</h2>

  {/* Category Dropdown */}
  <select
    className="w-full border p-2 mb-2 rounded"
    value={selectedCategory}
    onChange={(e) => {
      setSelectedCategory(e.target.value);
      setSelectedService("");
    }}
  >
    <option value="">Select Category</option>
    {Object.keys(servicesData).map((cat) => (
      <option key={cat}>{cat}</option>
    ))}
  </select>

  {/* Sub Service Dropdown */}
  <select
    className="w-full border p-2 mb-2 rounded"
    value={selectedService}
    onChange={(e) => setSelectedService(e.target.value)}
  >
    <option value="">Select Service</option>
    {selectedCategory &&
      servicesData[selectedCategory].map((srv) => (
        <option key={srv}>{srv}</option>
      ))}
  </select>

  {/* Price Input */}
  <input
    type="number"
    placeholder="Enter Price"
    className="w-full border p-2 mb-3 rounded"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
  />

  {/* Add Button */}
  <button
    onClick={addService}
    className="bg-blue-600 text-white w-full py-2 rounded"
  >
    Add Service
  </button>
</div>

{/* Added Services List */}
{items.length > 0 && (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="font-semibold mb-3">Added Services</h2>

    {items.map((item, index) => (
      <div
        key={index}
        className="flex justify-between border-b py-2 text-sm"
      >
        <div>
          <p className="font-medium">{item.service}</p>
          <p className="text-gray-500">{item.category}</p>
        </div>

        <p className="font-semibold">₹ {item.price}</p>
      </div>
    ))}
  </div>
)}

{/* Invoice Preview */}
{items.length > 0 && (
  <div className="bg-white p-6 rounded shadow" id="invoice">
    
    <h2 className="text-xl font-bold mb-4 text-center">
      INVOICE
    </h2>

    {/* Company + Client */}
    <div className="flex justify-between mb-6 text-sm">
      <div>
        <p className="font-bold">{company.companyName}</p>
        <p>{company.name}</p>
        <p>{company.phone}</p>
        <p>{company.email}</p>
      </div>

      <div className="text-right">
        <p><b>Invoice No:</b> {client.invoiceNo}</p>
        <p><b>Date:</b> {client.date}</p>
        <p><b>Client:</b> {client.clientName}</p>
        <p><b>Project:</b> {client.project}</p>
      </div>
    </div>

    {/* Table */}
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2 text-left">Service</th>
          <th className="border p-2 text-left">Category</th>
          <th className="border p-2 text-right">Amount</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td className="border p-2">{item.service}</td>
            <td className="border p-2">{item.category}</td>
            <td className="border p-2 text-right">₹ {item.price}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Total */}
    <div className="text-right mt-4">
      <p className="text-lg font-bold">
        Total: ₹ {totalAmount}
      </p>
    </div>

    <p className="text-center text-xs mt-6 text-gray-500">
      Thank you for your business
    </p>
  </div>
)}

{items.length > 0 && (
  <button
    onClick={generatePDF}
    className="bg-green-600 text-white w-full py-3 rounded text-lg"
  >
    Generate & Download PDF
  </button>
)}

{items.length > 0 && (
  <div className="flex gap-3 mt-3">
    
    <button
      onClick={shareWhatsApp}
      className="bg-green-500 text-white w-1/2 py-3 rounded"
    >
      Share WhatsApp
    </button>

    <button
      onClick={shareEmail}
      className="bg-blue-500 text-white w-1/2 py-3 rounded"
    >
      Share Email
    </button>

  </div>
)}

  </div>
);
}

export default App;