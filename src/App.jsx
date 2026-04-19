import { useState } from "react";
import { servicesData } from "./data/services";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import InvoicePreview from "./components/InvoicePreview";

function App() {

  // Company Details (pre-filled)
  const [company, setCompany] = useState({
  companyName: "INFRA CONSULTANCY",
  addressLine1: "A Wing, Flat No. 504, Shiv Kripa CHS Ltd, Road, Dahisar East, Mumbai 400068",
  //addressLine2: "",
  proprietor: "Mr. Nikhil Patel",
  phone: "",
  email: "",
  pan: "ANDPPXXXX"
});

  // Client Details
  const [client, setClient] = useState({
  quoteNo: "MAR/25-26/11",
  date: new Date().toLocaleDateString(),
  clientName: "",
  clientAddress: "",
  projectTitle: ""
});

  // Services list added to invoice
  const [items, setItems] = useState([]);

  const [notes, setNotes] = useState({
  description: "1.5% Consultancy charges of total basic cost of lifts",
  workOrder: "",
  workDate: ""
});

  const [selectedCategory, setSelectedCategory] = useState("");
const [selectedService, setSelectedService] = useState("");
const [price, setPrice] = useState("");
const [qty,setQty] = useState(1);

{/*} const addService = () => {
  if (!selectedCategory || !selectedService || !price) {
    alert("Please select service and enter price");
    return;
  } 

   const addService = (service) => {
  const formattedService = {
    id: Date.now(), // important for delete
    name: service.name,
    type: service.type,
    qty: Number(service.qty) || 1,
    price: Number(service.price) || 0   
  }; 

  setServices(prev => [...prev, formattedService]);
}; 

  const removeService = (indexToRemove) => {
  const updated = items.filter((_, index) => index !== indexToRemove);
  setItems(updated);
};

const deleteService = (id) => {
  setServices(prev => prev.filter(service => service.id !== id));
};

  const newItem = {
  category: selectedCategory,
  service: selectedService,
  qty: Number(qty),
  rate: Number(price)
};

  setItems([...items, newItem]);

  // reset fields
  setSelectedCategory("");
  setSelectedService("");
  setPrice("");
  setQty(1);
}; */}

const addService = () => {
  if (!selectedCategory || !selectedService || !price) {
    alert("Please select service and enter price");
    return;
  }

  const newItem = {
    id: Date.now(),          // needed for delete
    category: selectedCategory,
    service: selectedService,
    qty: Number(qty),
    rate: Number(price)
  };

  setItems(prev => [...prev, newItem]);

  // reset form
  setSelectedCategory("");
  setSelectedService("");
  setPrice("");
  setQty(1);
};

const deleteService = (id) => {
  setItems(prev => prev.filter(item => item.id !== id));
};

const totalAmount = items.reduce(
  (sum, item) => sum + item.rate * item.qty,
  0
);

{/* const total = services.reduce((sum, s) => {
  const price = Number(s.price) || 0;
  const qty = Number(s.qty) || 0;
  return sum + price * qty;
}, 0);  */}


const generatePDF = async () => {
  const input = document.getElementById("invoice");

  // make high quality canvas
  const canvas = await html2canvas(input, {
  scale: window.devicePixelRatio > 1 ? 2 : 3,
  useCORS: true,
  scrollX: 0,
  scrollY: -window.scrollY,
  windowWidth: input.scrollWidth,
});

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const margin = 0;
const imgWidth = pdfWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let position = 0;

  // If invoice height is bigger than A4 → auto multiple pages
  if (imgHeight > pdfHeight) {
    let heightLeft = imgHeight;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, 0, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }
  } else {
    pdf.addImage(imgData, "PNG", margin, 0, imgWidth, imgHeight);
  }

  pdf.save(`Invoice_${client.clientName || "Client"}.pdf`);
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
  value={company.proprietor}
  onChange={(e) =>
    setCompany({ ...company, proprietor: e.target.value })
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

      <input
  className="w-full border p-2 mb-2 rounded"
  placeholder="Address Line 1"
  value={company.addressLine1}
  onChange={(e)=>setCompany({...company,addressLine1:e.target.value})}
/>

{/* <input
  className="w-full border p-2 mb-2 rounded"
  placeholder="Address Line 2"
  value={company.addressLine2}
  onChange={(e)=>setCompany({...company,addressLine2:e.target.value})}
/> */}

<input
  className="w-full border p-2 mb-2 rounded"
  placeholder="Proprietor Name"
  value={company.proprietor}
  onChange={(e)=>setCompany({...company,proprietor:e.target.value})}
/>

<input
  className="w-full border p-2 rounded"
  placeholder="PAN Number"
  value={company.pan}
  onChange={(e)=>setCompany({...company,pan:e.target.value})}
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

  {/* <input
    className="w-full border p-2 mb-2 rounded"
    placeholder="Project Name"
    value={client.project}
    onChange={(e) =>
      setClient({ ...client, project: e.target.value })
    }
  /> */}

  {/* <input
    className="w-full border p-2 mb-2 rounded"
    placeholder="Invoice Number"
    value={client.invoiceNo}
    onChange={(e) =>
      setClient({ ...client, invoiceNo: e.target.value })
    }
  /> */}

  <input
    type="date"
    className="w-full border p-2 rounded"
    value={new Date().toISOString().split("T")[0]}
    onChange={(e) =>
      setClient({ ...client, date: e.target.value })
    }
  />

<input
  className="w-full border p-2 mb-2 rounded"
  placeholder="Quote Number"
  value={client.quoteNo}
  onChange={(e)=>setClient({...client,quoteNo:e.target.value})}
/>

{/* <input
  type="date"
  className="w-full border p-2 mb-2 rounded"
  onChange={(e)=>setClient({...client,date:e.target.value})}
/> */}

{/* <input
  className="w-full border p-2 mb-2 rounded"
  placeholder="Client Name"
  value={client.clientName}
  onChange={(e)=>setClient({...client,clientName:e.target.value})}
/> */}

<textarea
  className="w-full border p-2 mb-2 rounded"
  placeholder="Client Address"
  value={client.clientAddress}
  onChange={(e)=>setClient({...client,clientAddress:e.target.value})}
/>

<input
  className="w-full border p-2 rounded"
  placeholder="Project Title"
  value={client.projectTitle}
  onChange={(e)=>setClient({...client,projectTitle:e.target.value})}
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

  <input
  type="number"
  placeholder="Quantity"
  className="w-full border p-2 mb-2 rounded"
  value={qty}
  onChange={(e)=>setQty(e.target.value)}
/>

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

{/* Consultancy Notes */}
<div className="bg-white p-4 rounded shadow mt-6">
  <h2 className="font-semibold mb-3">Consultancy Notes</h2>

  <textarea
    className="w-full border p-2 mb-2 rounded"
    placeholder="Consultancy Description"
    value={notes.description}
    onChange={(e)=>setNotes({...notes,description:e.target.value})}
  />

  <input
    className="w-full border p-2 mb-2 rounded"
    placeholder="Work Order Number"
    value={notes.workOrder}
    onChange={(e)=>setNotes({...notes,workOrder:e.target.value})}
  />

  <input
    type="date"
    className="w-full border p-2 rounded"
    value={notes.workDate}
    onChange={(e)=>setNotes({...notes,workDate:e.target.value})}
  />
</div>

</div>

{/* Added Services List */}
{items.length > 0 && (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="font-semibold mb-3">Added Services</h2>

    {items.map((item) => (
  <div
    key={item.id}
    className="flex justify-between items-center border-b py-2 text-sm"
  >
    <div>
      <p className="font-medium">{item.service}</p>
      <p className="text-gray-500">{item.category}</p>
      <p className="text-gray-400 text-xs">Qty: {item.qty}</p>
    </div>

    <div className="flex items-center gap-3">
      <p className="font-semibold">
        ₹ {(item.rate * item.qty).toLocaleString()}
      </p>

      <button
        onClick={() => deleteService(item.id)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Delete
      </button>
    </div>
  </div>
))}
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

{/* Invoice Preview */}
{items.length > 0 && (
  <div className="mt-10">
    <InvoicePreview 
      company={company}
      client={client}
      services={items}
      notes={notes}
    />
  </div>
)}

  </div>
);
}

export default App;