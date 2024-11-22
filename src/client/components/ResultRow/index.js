import React from 'react';

export default function ResultRow({ result }) {
 return (
   <tr>
     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
       {new Date(result.timestamp).toLocaleString()}
     </td>
     <td className="px-6 py-4 whitespace-nowrap">
       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
         result.classification === 'class_A' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
       }`}>
         {result.classification}
       </span>
     </td>
     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
       {result.weight}g
     </td>
     <td className="px-6 py-4 whitespace-nowrap">
       {result.imagePath && (
         <img
           src={`http://localhost:5000${result.imagePath}`}
           alt="Classified item"
           className="h-16 w-16 object-cover rounded"
         />
       )}
     </td>
   </tr>
 );
}

// components/SearchBar/index.js
import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange }) {
 return (
   <div className="mt-4 relative">
     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
       <Search className="h-5 w-5 text-gray-400" />
     </div>
     <input
       type="text"
       className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
       placeholder="분류 결과 또는 시간으로 검색..."
       value={searchTerm}
       onChange={(e) => onSearchChange(e.target.value)}
     />
   </div>
 );
}