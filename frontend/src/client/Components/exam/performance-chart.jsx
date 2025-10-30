import React from "react";
// Recharts library is kept, as the request is to convert the UI structure/styling, not the charting logic.
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { CheckCircle, XCircle } from "lucide-react"; // Added icons for visual improvement

// Custom Tailwind wrappers to replace Shadcn/ui components
const Card = ({ children, className = '' }) => (
  <div className={`rounded-xl border bg-white text-gray-900 shadow-lg transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 p-6 border-b">
    {children}
  </div>
);
const CardTitle = ({ children }) => (
  <h3 className="text-2xl font-semibold leading-none tracking-tight">
    {children}
  </h3>
);
const CardContent = ({ children }) => (
  <div className="p-6 pt-6">
    {children}
  </div>
);

interface PerformanceChartProps {
  correctCount: number;
  incorrectCount: number;
  percentage: number; // Assumed to be a number between 0 and 100
}

export default function PerformanceChart({ correctCount, incorrectCount, percentage }: PerformanceChartProps) {
  const data = [
    { name: "Correct", value: correctCount },
    { name: "Incorrect", value: incorrectCount },
  ];

  // Tailwind color codes for green (correct) and red (incorrect)
  const COLORS = ["#10b981", "#ef4444"]; 

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Performance Overview 📊</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* LEFT COLUMN: PIE CHART */}
          <div className="flex items-center justify-center min-h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // Simplified label for better chart appearance
                  label={({ name, value }) => `${name}: ${value}`} 
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                {/* Custom tooltip and legend for better data presentation */}
                <Tooltip 
                    contentStyle={{ borderRadius: '6px', fontSize: '14px' }}
                />
                <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* RIGHT COLUMN: STATS AND PROGRESS BAR */}
          <div className="flex flex-col justify-center space-y-6 p-4">
            
            {/* Accuracy Percentage */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Accuracy Rate</span>
                <span className="text-4xl font-extrabold text-green-600">
                  {percentage}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Counts */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Correct Answers</span>
                </div>
                <span className="font-bold text-lg text-green-600">{correctCount}</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Incorrect Answers</span>
                </div>
                <span className="font-bold text-lg text-red-600">{incorrectCount}</span>
              </div>
            </div>
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
}