import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Printer, Share2, ReceiptText, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import logoImg from '../assets/logo.png';

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReceiptId, setExpandedReceiptId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sharingReceipt, setSharingReceipt] = useState(null);
  const [generatedImg, setGeneratedImg] = useState(null);
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

  const handleWhatsAppForward = async (receipt) => {
      setSharingReceipt(receipt);
      setGeneratedImg(null);
      setIsGenerating(true);
      
      // Give the DOM a moment to ensure expansion if needed (though it should be expanded to share)
      setTimeout(async () => {
          const receiptElement = document.getElementById(`receipt-card-${receipt.id}`);
          if (!receiptElement) {
              setSharingReceipt(null);
              setIsGenerating(false);
              return;
          }

          try {
              const canvas = await html2canvas(receiptElement, {
                  scale: 2,
                  useCORS: true,
                  backgroundColor: "#ffffff",
                  logging: false,
              });
              const imgData = canvas.toDataURL('image/png');
              setGeneratedImg(imgData);
          } catch (error) {
              console.error("Error generating receipt image:", error);
              // FALLBACK: If image generation fails, automatically proceed to text sharing
              finalizeWhatsAppShare(receipt);
          } finally {
              setIsGenerating(false);
          }
      }, 500);
  };

  const shareImage = async () => {
    if (!generatedImg) return;
    
    try {
      // Convert DataURL to Blob
      const res = await fetch(generatedImg);
      const blob = await res.blob();
      const file = new File([blob], `DAS_Receipt_${sharingReceipt.receipt_no}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'DAS Receipt',
          text: `Official Receipt #${sharingReceipt.receipt_no}`
        });
      } else {
        // Fallback to text share if native share isn't supported for files
        finalizeWhatsAppShare(sharingReceipt);
      }
    } catch (err) {
      console.error('Share failed', err);
      finalizeWhatsAppShare(sharingReceipt);
    }
  };

  const finalizeWhatsAppShare = (receipt) => {
      const verifyLink = `${window.location.origin}/verify?r=${receipt.receipt_no}`;
      const textMsg = `🧾 *Direct Access Syndicate Official Receipt*\n\n` +
                      `*Receipt No:* ${receipt.receipt_no}\n` +
                      `*Student:* ${receipt.student_name}\n` +
                      `*AMOUNT:* SLL ${Number(receipt.amount).toLocaleString()}\n\n` +
                      `_Verify here:_ ${verifyLink}`;
      
      window.open(`https://wa.me/?text=${encodeURIComponent(textMsg)}`, '_blank', 'noopener,noreferrer');
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

      {/* Sharing Modal */}
      {sharingReceipt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div>
                          <h3 className="text-xl font-black text-slate-800">Visual Receipt Share</h3>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Receipt # {sharingReceipt.receipt_no}</p>
                      </div>
                      <button onClick={() => setSharingReceipt(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                          <X size={24} className="text-slate-500" />
                      </button>
                  </div>

                  <div className="p-8 flex flex-col items-center justify-center bg-slate-100/50 min-h-[300px]">
                      {isGenerating ? (
                          <div className="flex flex-col items-center gap-4">
                              <div className="w-12 h-12 border-4 border-green-600/20 border-t-green-600 rounded-full animate-spin"></div>
                              <p className="text-slate-500 font-bold">Generating HD Image...</p>
                          </div>
                      ) : generatedImg ? (
                          <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-200 w-full">
                              <img src={generatedImg} alt="Generated Receipt" className="w-full h-auto rounded-xl" />
                          </div>
                      ) : (
                          <p className="text-red-500 font-bold">Failed to load preview.</p>
                      )}
                  </div>

                  <div className="p-6 grid grid-cols-2 gap-4 bg-white border-t border-slate-100">
                      <a 
                        href={generatedImg} 
                        download={`DAS_Receipt_${sharingReceipt.receipt_no}.png`}
                        className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95"
                      >
                          <Download size={20} /> SAVE
                      </a>
                      <button 
                        onClick={shareImage}
                        className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl font-black hover:bg-[#1ebd5b] transition-all active:scale-95 shadow-lg shadow-green-500/20"
                      >
                          <Share2 size={20} /> {navigator.share ? 'SHARE IMAGE' : 'SEND TEXT'}
                      </button>
                  </div>
                  <div className="px-6 pb-6 text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                          {navigator.share 
                            ? "Use 'SHARE IMAGE' to send as a photo directly!" 
                            : "Step 1: Save Image. Step 2: Open WhatsApp and attach."}
                      </p>
                  </div>
              </div>
          </div>
      )}
    </Layout>
  );
};

export default Receipts;
