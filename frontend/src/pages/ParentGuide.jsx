import React from 'react';
import Layout from '../components/Layout';
import { BookOpen, LogIn, Receipt, Bell, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react';

const ParentGuide = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Parent User Guide</h1>
        <p className="text-slate-500 font-medium">Learn how to navigate and use the Direct Access Syndicate portal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><LogIn size={24} /></div>
               <h2 className="text-xl font-bold text-slate-800">1. Logging In & Linking Students</h2>
            </div>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed pl-16">
               <p>
                 When you enroll a child at Direct Access Syndicate, the admin will provide you with a <strong>Unique Registration Code</strong> (e.g., <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-mono">DAS-2024-001</span>).
               </p>
               <ol className="list-decimal pl-4 space-y-2 font-medium">
                 <li>Sign in to your account using your email and password.</li>
                 <li>If no children are linked, you will see a prompt to enter your Registration Code.</li>
                 <li>If you have multiple children, go to the <strong>Enroll Child</strong> tab and enter their respective codes to link them all to your single parent account.</li>
               </ol>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Receipt size={24} /></div>
               <h2 className="text-xl font-bold text-slate-800">2. Tracking Receipts & Payments</h2>
            </div>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed pl-16">
               <p>
                 You have 100% transparency over your financial records. Navigate to the <strong>Receipts</strong> tab to view a history of all payments made to the school.
               </p>
               <ul className="list-disc pl-4 space-y-2 font-medium">
                 <li>Click <strong>View Receipt</strong> to see the full digital receipt details.</li>
                 <li>Click <strong>Download PDF</strong> to save a lightweight, highly-optimized PDF copy to your device.</li>
                 <li>The receipt includes a <strong>QR Code</strong>. Anyone scanning it can verify the receipt's authenticity on our secure portal.</li>
               </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#25D366]"></div>
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-xl"><MessageCircle size={24} /></div>
               <h2 className="text-xl font-bold text-slate-800">3. Sharing via WhatsApp</h2>
            </div>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed pl-16">
               <p>
                 We understand WhatsApp is the easiest way to communicate. You can share digital receipts directly to family members or sponsors instantly.
               </p>
               <p className="font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <strong>On Mobile:</strong> Click "Send WhatsApp" inside a receipt. Your phone will automatically ask if you want to share the actual PDF file directly into a chat, along with a nice summary text!
               </p>
               <p className="font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <strong>On Desktop:</strong> Click "Send WhatsApp" to download the PDF and simultaneously open WhatsApp Web so you can paste the text and attach the file.
               </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Bell size={24} /></div>
               <h2 className="text-xl font-bold text-slate-800">4. Multi-Child Dashboard</h2>
            </div>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed pl-16">
               <p>
                 If you have more than one child enrolled at DAS, you <strong>do not</strong> need multiple accounts!
               </p>
               <ul className="list-disc pl-4 space-y-2 font-medium">
                 <li>On the main <strong>Dashboard</strong>, you will see a scrolling list of all your children at the top.</li>
                 <li>Click on a child's card to switch your view.</li>
                 <li>When you switch children, the dashboard instantly updates to show <em>only</em> that specific child's attendance, receipts, and performance metrics.</li>
               </ul>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl shadow-lg shadow-slate-200/50 text-white relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              <ShieldCheck size={32} className="text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Your data is encrypted and completely modular. You only see data relevant to your officially linked children.
              </p>
           </div>

           <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
              <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <img src="/src/assets/logo.png" alt="DAS Logo" className="w-8 h-8 object-cover" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Need help?</h4>
              <p className="text-xs text-slate-500 mb-4">Contact our support center</p>
              <a href="tel:078003333" className="block w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">
                Call 078003333
              </a>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default ParentGuide;
