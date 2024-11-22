export const getStats = (results) => ({
    totalItems: results.length,
    avgWeight: Math.round(results.reduce((sum, item) => sum + item.weight, 0) / (results.length || 1)),
    classACounts: results.filter(item => item.classification === 'class_A').length,
    classBCounts: results.filter(item => item.classification === 'class_B').length
   });
   
   export const formatData = (results) => {
    const hourlyData = Object.entries(
      results.reduce((acc, item) => {
        const hour = new Date(item.timestamp).toISOString().slice(0, 13);
        if (!acc[hour]) acc[hour] = { count: 0, totalWeight: 0 };
        acc[hour].count++;
        acc[hour].totalWeight += item.weight;
        return acc;
      }, {})
    ).map(([hour, data]) => ({
      hour: new Date(hour).toLocaleTimeString([], { hour: '2-digit' }),
      count: data.count,
      avgWeight: Math.round(data.totalWeight / data.count)
    })).slice(-24);
   
    const classificationData = [
      { name: 'Class A', value: results.filter(item => item.classification === 'class_A').length },
      { name: 'Class B', value: results.filter(item => item.classification === 'class_B').length }
    ];
   
    return { hourlyData, classificationData };
   };