import React from 'react';
import SearchBar from '../SearchBar';
import ResultsTable from '../ResultsTable';

export default function MonitoringTab({ results, searchTerm, setSearchTerm }) {
 const filteredResults = results.filter(result => 
   result.classification.toLowerCase().includes(searchTerm.toLowerCase()) ||
   new Date(result.timestamp).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
 );

 return (
   <div className="bg-white rounded-lg shadow">
     <div className="px-6 py-4 border-b border-gray-200">
       <h2 className="text-2xl font-bold text-gray-900">실시간 분류 결과</h2>
       <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
     </div>
     <ResultsTable results={filteredResults} />
   </div>
 );
}