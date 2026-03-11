import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Printer, Share2, ReceiptText, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import logoImg from '../assets/logo.png';

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReceiptId, setExpandedReceiptId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sharingReceipt, setSharingReceipt] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const itemsPerPage = 10;
  const { role } = useAuth();

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const { data } = await api.get('/receipts');
        setReceipts(data);
      } catch (err) {
        console.error('Failed to fetch receipts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  // Simple print function wrapper
  const handlePrint = () => {
      window.print();
  }

  const generatePDF = async (receipt) => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a5' });
      const w = doc.internal.pageSize.getWidth();

      // Load logo
      const toBase64 = (src) => new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(null);
        img.src = src;
      });
      const logoData = await toBase64(logoImg);

      // Header
      doc.setFillColor(22, 163, 74);
      doc.rect(0, 0, w, 30, 'F');
      if (logoData) doc.addImage(logoData, 'PNG', 8, 5, 20, 20);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13); doc.setFont('helvetica', 'bold');
      doc.text('Direct Access Syndicate', 32, 13);
      doc.setFontSize(7); doc.setFont('helvetica', 'normal');
      doc.text('Syke street at arthodox school near flaming church | 078003333 / 073573032', 32, 19);
      doc.text('Freetown, Sierra Leone', 32, 24);

      // Title
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(16); doc.setFont('helvetica', 'bold');
      doc.text('OFFICIAL RECEIPT', w / 2, 42, { align: 'center' });

      // Line
      doc.setDrawColor(226, 232, 240);
      doc.line(10, 46, w - 10, 46);

      // Details
      const details = [
        ['Receipt No:', receipt.receipt_no],
        ['Issue Date:', new Date(receipt.issue_date).toLocaleDateString()],
        ['Student:', receipt.student_name],
        ['Parent / Guardian:', receipt.parent_name],
        ['Class Level:', receipt.level],
        ['Payment Method:', receipt.method],
      ];
      let y = 54;
      details.forEach(([label, value]) => {
        doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(100, 116, 139);
        doc.text(label, 12, y);
        doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 41, 59);
        doc.text(String(value || 'N/A'), 65, y);
        y += 10;
      });

      // Amount box
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(10, y, w - 20, 20, 4, 4, 'F');
      doc.setTextColor(5, 150, 105);
      doc.setFontSize(11); doc.setFont('helvetica', 'bold');
      doc.text('AMOUNT PAID', w / 2, y + 8, { align: 'center' });
      doc.setFontSize(16);
      doc.text(`SLL ${Number(receipt.amount).toLocaleString()}`, w / 2, y + 16, { align: 'center' });

      // Footer
      y += 28;
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7); doc.setFont('helvetica', 'italic');
      doc.text(`Verify at: ${window.location.origin}/verify?r=${receipt.receipt_no}`, w / 2, y, { align: 'center' });
      y += 5;
      doc.text(`Generated on ${new Date().toLocaleString()} | Direct Access Syndicate`, w / 2, y, { align: 'center' });

      const filename = `DAS_Receipt_${receipt.receipt_no}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Could not generate PDF. Please try printing instead.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppForward = (receipt) => {
    setSharingReceipt(receipt);
  };

  const sendViaWhatsApp = () => {
    if (!sharingReceipt) return;
    const r = sharingReceipt;
    const msg = `🧾 *Direct Access Syndicate - Official Receipt*\n\n` +
      `*Receipt No:* ${r.receipt_no}\n` +
      `*Student:* ${r.student_name}\n` +
      `*Parent:* ${r.parent_name}\n` +
      `*Class:* ${r.level}\n` +
      `*Method:* ${r.method}\n` +
      `*AMOUNT PAID:* SLL ${Number(r.amount).toLocaleString()}\n` +
      `*Date:* ${new Date(r.issue_date).toLocaleDateString()}\n\n` +
      `_Verify: ${window.location.origin}/verify?r=${r.receipt_no}_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    setSharingReceipt(null);
  };

  const toggleExpand = (id) => {
      setExpandedReceiptId(prev => prev === id ? null : id);
  };

  const totalPages = Math.ceil(receipts.length / itemsPerPage);
  const indexOfLastReceipt = currentPage * itemsPerPage;
  const indexOfFirstReceipt = indexOfLastReceipt - itemsPerPage;
  const currentReceipts = receipts.slice(indexOfFirstReceipt, indexOfLastReceipt);

  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };

  return (
    <Layout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Receipts History</h1>
          <p className="text-slate-500">View and manage all transaction receipts.</p>
        </div>
        {role === 'admin' && (
          <Link
            to="/admin/receipts/new"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-green-500/20 transition-all active:scale-95"
          >
            <Plus size={20} /> New Receipt
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center flex-col gap-4">
            <div className="w-10 h-10 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {currentReceipts.map((receipt) => {
             const isExpanded = expandedReceiptId === receipt.id;
             return (
             <div key={receipt.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                 
                 {/* Summary Row */}
                 <div onClick={() => toggleExpand(receipt.id)} className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold text-xl">
                            {receipt.student_name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-lg">{receipt.student_name}</p>
                            <p className="text-sm text-slate-500 font-medium">Receipt No: {receipt.receipt_no}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                           <p className="font-black text-emerald-600 tracking-tight text-lg">SLL {Number(receipt.amount).toLocaleString()}</p>
                           <p className="text-xs text-slate-500 font-medium">{new Date(receipt.issue_date).toLocaleDateString()}</p>
                        </div>
                        <button className="text-slate-400 hover:text-green-600 transition-colors flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl font-bold text-sm">
                            {isExpanded ? 'Collapse' : 'View Receipt'} {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </div>
                 </div>

                 {/* Expanded Content */}
                 {isExpanded && (
                 <div className="flex flex-col lg:flex-row border-t border-slate-100 bg-slate-50/30">
                     <div id={`receipt-card-${receipt.id}`} className="flex-1 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 border-dashed relative bg-white m-4 rounded-3xl shadow-sm">
                         
                         <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                         
                         {/* Formal Header with Logo */}
                         <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 relative z-10">
                             <img src={logoImg} alt="DAS Logo" className="w-16 h-16 object-contain" />
                             <div>
                                 <h2 className="text-xl font-black text-slate-800 tracking-tight">Direct Access Syndicate</h2>
                                 <p className="text-xs text-slate-500">Syke street at arthodox school near flaming church</p>
                                 <p className="text-xs text-slate-500">Call (Prop): 078003333 | Call (Mgr): 073573032</p>
                             </div>
                         </div>

                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-4 relative z-10">
                            <div>
                                 <p className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-1">Receipt No</p>
                                 <p className="text-lg font-black text-slate-800 tracking-tight">{receipt.receipt_no}</p>
                            </div>
                            <div className="text-right">
                                 <p className="text-sm font-bold text-slate-400 tracking-widest uppercase mb-1">Issue Date</p>
                                 <p className="font-semibold text-slate-700">{new Date(receipt.issue_date).toLocaleDateString()}</p>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-2 relative z-10">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">Parent / Guardian</p>
                                <p className="font-bold text-slate-800 text-lg">{receipt.parent_name}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">Student Name</p>
                                <p className="font-bold text-slate-800 text-lg">{receipt.student_name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Class Level</p>
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-sm font-medium">{receipt.level}</span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Payment Method</p>
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-sm font-medium">{receipt.method}</span>
                            </div>
                         </div>
                     </div>

                     {/* Action & Amount Panel */}
                     <div className="w-full lg:w-72 p-6 flex flex-col justify-between items-center text-center m-4 ml-0 bg-white rounded-3xl shadow-sm border border-slate-100">
                         <div className="w-full">
                            <p className="text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">Amount Paid</p>
                            <h3 className="text-4xl font-black text-emerald-600 tracking-tight">
                               <span className="text-emerald-400 text-xl mr-1">SLL</span>{Number(receipt.amount).toLocaleString()}
                            </h3>
                         </div>

                         <div className="my-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <QRCodeSVG 
                                value={`${window.location.origin}/verify?r=${receipt.receipt_no}`} 
                                size={120}
                                fgColor="#1e293b" 
                            />
                         </div>

                         <div className="flex flex-col w-full gap-3 print-hide">
                             <button onClick={() => handlePrint()} className="w-full flex justify-center items-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl hover:bg-slate-100 transition-colors font-bold shadow-sm active:scale-[0.98]">
                                 <Printer size={18} /> Print Receipt
                             </button>
                             <button 
                                onClick={() => handleWhatsAppForward(receipt)} 
                                className="w-full flex justify-center items-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl hover:bg-[#1ebd5b] transition-all font-black shadow-lg shadow-green-500/20 active:scale-95"
                                title="Send this receipt via WhatsApp"
                             >
                                <Share2 size={24} /> 
                                <span className="text-lg">SEND WHATSAPP</span>
                             </button>
                         </div>
                     </div>
                 </div>
                 )}
             </div>
             );
          })}

          {receipts.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <button 
                      onClick={prevPage} 
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${currentPage === 1 ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm'}`}
                  >
                      <ChevronLeft size={20} /> Previous
                  </button>
                  <span className="text-slate-500 font-medium">Page <span className="text-slate-800 font-bold">{currentPage}</span> of {totalPages}</span>
                  <button 
                      onClick={nextPage} 
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${currentPage === totalPages ? 'text-slate-400 bg-slate-50 cursor-not-allowed' : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm'}`}
                  >
                      Next <ChevronRight size={20} />
                  </button>
              </div>
          )}

          {receipts.length === 0 && (
              <div className="col-span-full bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                 <ReceiptText size={64} className="mx-auto text-slate-200 mb-6" />
                 <h3 className="text-xl font-bold text-slate-800 mb-2">No Receipts Found</h3>
                 <p className="text-slate-500">There are no transaction receipts recorded in the system yet.</p>
              </div>
          )}
        </div>
      )}

      {/* Share Modal */}
      {sharingReceipt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                      <div>
                          <h3 className="text-base font-black text-slate-800">Share Receipt</h3>
                          <p className="text-xs text-slate-400">Receipt #{sharingReceipt.receipt_no}</p>
                      </div>
                      <button onClick={() => setSharingReceipt(null)} className="p-1.5 hover:bg-slate-100 rounded-full">
                          <X size={18} className="text-slate-500" />
                      </button>
                  </div>

                  <div className="p-5 space-y-3">
                      <p className="text-sm text-slate-500 text-center">How would you like to share this receipt?</p>

                      <button
                        onClick={() => { generatePDF(sharingReceipt); setSharingReceipt(null); }}
                        disabled={isGenerating}
                        className="w-full flex items-center gap-3 p-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm"
                      >
                        <FileText size={18} />
                        <div className="text-left">
                          <p className="font-bold">Download as PDF</p>
                          <p className="text-xs opacity-75">Save to your device, then share anywhere</p>
                        </div>
                      </button>

                      <button
                        onClick={sendViaWhatsApp}
                        className="w-full flex items-center gap-3 p-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#1ebd5b] transition-all text-sm"
                      >
                        <Share2 size={18} />
                        <div className="text-left">
                          <p className="font-bold">Send Text via WhatsApp</p>
                          <p className="text-xs opacity-75">Opens WhatsApp with receipt details pre-filled</p>
                        </div>
                      </button>

                      <p className="text-center text-xs text-slate-400">💡 Tip: Download the PDF first, then attach it in WhatsApp chat for best results.</p>
                  </div>
              </div>
          </div>
      )}
    </Layout>
  );
};

export default Receipts;

