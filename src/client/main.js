// import React, { useState, useEffect } from 'react';
// import { createRoot } from 'react-dom/client';
// import { Tabs, TabsTrigger, TabsContent } from './components/ui/Tabs';
// import MonitoringTab from './components/MonitoringTab';
// import AnalyticsTab from './components/AnalyticsTab';

// function SortingApp() {
//   const [results, setResults] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     fetchResults();
//     const eventSource = new EventSource('http://localhost:5000/api/events');
    
//     eventSource.onmessage = (event) => {
//       const newResult = JSON.parse(event.data);
//       setResults(prev => [newResult, ...prev].slice(0, 50));
//     };

//     return () => eventSource.close();
//   }, []);

//   const fetchResults = async (page) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`http://localhost:5000/api/results?page=${page}`);
//       const data = await response.json();
//       // 데이터가 없는 경우에도 빈 배열로 설정
//       setResults(data.results || []);
//       setPagination(data.pagination || {
//         currentPage: 1,
//         totalPages: 1,
//         totalItems: 0,
//         itemsPerPage: 20,
//         hasNextPage: false,
//         hasPrevPage: false
//       });
//     } catch (error) {
//       console.error('Failed to fetch results:', error);
//       // 에러 발생 시 빈 배열로 설정
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">분류 시스템</h1>
        
//         <Tabs defaultValue="monitoring">
//           <TabsTrigger value="monitoring">모니터링</TabsTrigger>
//           <TabsTrigger value="analytics">분석</TabsTrigger>
          
//           <TabsContent value="monitoring">
//             <MonitoringTab 
//               results={results} 
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//             />
//           </TabsContent>
          
//           <TabsContent value="analytics">
//             <AnalyticsTab results={results} />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

// // ReactDOM.render() 대신 createRoot() 사용
// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(<SortingApp />);