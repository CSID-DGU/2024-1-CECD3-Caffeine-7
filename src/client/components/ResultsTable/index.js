import React from 'react';
import ResultRow from '../ResultRow';

export default function ResultsTable({ results }) {
 return (
   <div className="overflow-x-auto">
     <table className="min-w-full divide-y divide-gray-200">
       <thead className="bg-gray-50">
         <tr>
           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">시간</th>
           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">분류 결과</th>
           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">무게</th>
           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이미지</th>
         </tr>
       </thead>
       <tbody className="bg-white divide-y divide-gray-200">
         {results.map((result) => (
           <ResultRow key={result._id} result={result} />
         ))}
       </tbody>
     </table>
   </div>
 );
}