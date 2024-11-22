import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { formatData, getStats } from './utils';

export default function AnalyticsTab({ results }) {
 const stats = getStats(results);
 const { hourlyData, classificationData } = formatData(results);

 return (
   <div className="space-y-6">
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
       <Card title="총 처리 항목" value={stats.totalItems} />
       <Card title="평균 무게" value={`${stats.avgWeight}g`} />
       <Card title="Class A" value={stats.classACounts} />
       <Card title="Class B" value={stats.classBCounts} /> 
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       <div className="bg-white p-6 rounded-lg shadow">
         <h3 className="text-lg font-semibold mb-4">시간별 처리량</h3>
         <div className="h-80">
           <ResponsiveContainer>
             <LineChart data={hourlyData}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="hour" />
               <YAxis />
               <Tooltip />
               <Legend />
               <Line type="monotone" dataKey="count" stroke="#8884d8" name="처리량" />
             </LineChart>
           </ResponsiveContainer>
         </div>
       </div>

       <div className="bg-white p-6 rounded-lg shadow">
         <h3 className="text-lg font-semibold mb-4">분류 비율</h3>
         <div className="h-80">
           <ResponsiveContainer>
             <BarChart data={classificationData}>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="name" />
               <YAxis />
               <Tooltip />
               <Bar dataKey="value" fill="#82ca9d" name="항목 수" />
             </BarChart>
           </ResponsiveContainer>
         </div>
       </div>
     </div>
   </div>
 );
}