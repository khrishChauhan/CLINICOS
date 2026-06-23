import React from 'react';
import { BookOpen, Search, ChevronRight, FileText, PlayCircle } from 'lucide-react';

const kbArticles = [
  { id: 'KB-01', title: 'How to check-in a new patient', category: 'Front Desk', type: 'Article' },
  { id: 'KB-02', title: 'Processing an insurance claim', category: 'Billing', type: 'Video' },
  { id: 'KB-03', title: 'Adding items to the stock ledger', category: 'Inventory', type: 'Article' },
  { id: 'KB-04', title: 'Using the Doctor EMR templates', category: 'Clinical', type: 'Article' },
  { id: 'KB-05', title: 'Resetting your POS terminal', category: 'IT Support', type: 'Article' },
];

export default function KnowledgeBaseView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-8 text-center items-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">How can we help?</h1>
        <p className="text-slate-500">Search for articles, tutorials, and standard operating procedures.</p>
        
        <div className="relative w-full max-w-2xl mt-4">
           <Search className="w-6 h-6 text-slate-400 absolute left-4 top-3" />
           <input type="text" placeholder="Search knowledge base..." className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-bold text-slate-900 text-lg mb-2">Front Desk Operations</h3>
          <p className="text-sm text-slate-500 mb-4">Registration, queuing, follow-ups.</p>
          <div className="text-sm font-bold text-indigo-600 flex items-center gap-1">Browse 12 articles <ChevronRight className="w-4 h-4"/></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-bold text-slate-900 text-lg mb-2">Clinical & EMR</h3>
          <p className="text-sm text-slate-500 mb-4">Prescriptions, diagnosis, reports.</p>
          <div className="text-sm font-bold text-indigo-600 flex items-center gap-1">Browse 8 articles <ChevronRight className="w-4 h-4"/></div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <h3 className="font-bold text-slate-900 text-lg mb-2">Billing & Accounting</h3>
          <p className="text-sm text-slate-500 mb-4">Invoicing, refunds, petty cash.</p>
          <div className="text-sm font-bold text-indigo-600 flex items-center gap-1">Browse 15 articles <ChevronRight className="w-4 h-4"/></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-12 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-bold text-slate-900">Popular Articles</h3>
        </div>
        <div className="divide-y divide-slate-100">
           {kbArticles.map((article, i) => (
              <div key={i} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                 <div className="flex items-center gap-3">
                   {article.type === 'Video' ? <PlayCircle className="w-5 h-5 text-indigo-500" /> : <FileText className="w-5 h-5 text-slate-400" />}
                   <p className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{article.title}</p>
                 </div>
                 <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">{article.category}</span>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
