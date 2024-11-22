import React from 'react';

export function Tabs({ children, defaultValue, onChange }) {
 const [activeTab, setActiveTab] = React.useState(defaultValue);

 const handleChange = (value) => {
   setActiveTab(value);
   onChange?.(value);
 };

 return (
   <div className="space-y-6">
     <div className="border-b border-gray-200">
       <nav className="-mb-px flex space-x-8">
         {React.Children.map(children, child => {
           if (child.type === TabsTrigger) {
             return React.cloneElement(child, {
               isActive: activeTab === child.props.value,
               onClick: () => handleChange(child.props.value)
             });
           }
           return null;
         })}
       </nav>
     </div>
     {React.Children.map(children, child => {
       if (child.type === TabsContent && child.props.value === activeTab) {
         return child;
       }
       return null;
     })}
   </div>
 );
}

export function TabsTrigger({ children, value, isActive, onClick }) {
 return (
   <button
     className={`${
       isActive
         ? 'border-blue-500 text-blue-600'
         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
     } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
     onClick={onClick}
   >
     {children}
   </button>
 );
}

export function TabsContent({ children, value }) {
 return (
   <div>
     {children}
   </div>
 );
}