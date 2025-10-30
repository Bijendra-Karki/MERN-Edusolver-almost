"use client";

import React, { useState } from "react";
import { Edit2, Play, BookOpen, ChevronDown } from "lucide-react";

// --- Custom Tailwind Components to replace Shadcn/ui ---

const Card = ({ children, className = '' }) => (
  <div className={`rounded-xl border bg-white shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-4 border-b ${className}`}>
    {children}
  </div>
);
const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight text-gray-900 ${className}`}>
    {children}
  </h3>
);
const CardDescription = ({ children, className = '' }) => (
    <p className={`text-sm text-gray-500 ${className}`}>
        {children}
    </p>
);
const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 pt-4 ${className}`}>
    {children}
  </div>
);
const Badge = ({ children, className = '' }) => (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 ${className}`}>
        {children}
    </span>
);
const Button = ({ children, className = '', variant = 'default', size = 'sm', onClick, ...props }) => {
    const baseStyle = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
    let variantStyle = '';
    let sizeStyle = 'h-9 px-4 py-2';

    if (variant === 'default') variantStyle = 'bg-indigo-600 text-white shadow hover:bg-indigo-700';
    if (variant === 'outline') variantStyle = 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50';
    
    if (size === 'sm') sizeStyle = 'h-8 px-3 py-1.5 text-sm';

    return (
        <button
            className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};


// --- Simulated Accordion Components using local state ---

interface AccordionSimulatedProps {
    type: "single" | "multiple";
    collapsible: boolean;
    defaultValue: string;
    children: React.ReactNode;
}

// Global state management for the simulated accordion
const AccordionContext = React.createContext<{ 
    openItem: string | null; 
    setOpenItem: React.Dispatch<React.SetStateAction<string | null>> 
} | null>(null);

const AccordionSimulated: React.FC<AccordionSimulatedProps> = ({ children, defaultValue }) => {
    // Only supports 'single' type collapse
    const [openItem, setOpenItem] = useState<string | null>(defaultValue);

    return (
        <AccordionContext.Provider value={{ openItem, setOpenItem }}>
            <div className="space-y-1">{children}</div>
        </AccordionContext.Provider>
    );
};

const AccordionItemSimulated: React.FC<{ value: string, children: React.ReactNode, className?: string }> = ({ value, children, className = '' }) => {
    return (
        <div className={`rounded-xl border border-gray-200 overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

const AccordionTriggerSimulated: React.FC<{ value: string, children: React.ReactNode, className?: string }> = ({ value, children, className = '' }) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error("AccordionTrigger must be used within Accordion");
    const { openItem, setOpenItem } = context;
    const isOpen = openItem === value;

    const toggle = () => {
        setOpenItem(isOpen ? null : value);
    };

    return (
        <button
            className={`flex items-center justify-between w-full p-4 text-left transition-colors duration-200 ${isOpen ? 'bg-gray-50' : 'hover:bg-gray-50'} ${className}`}
            onClick={toggle}
        >
            {children}
            <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-600' : 'text-gray-500'}`} />
        </button>
    );
};

const AccordionContentSimulated: React.FC<{ value: string, children: React.ReactNode, className?: string }> = ({ value, children, className = '' }) => {
    const context = React.useContext(AccordionContext);
    if (!context) throw new Error("AccordionContent must be used within Accordion");
    const { openItem } = context;
    const isOpen = openItem === value;

    return (
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-screen opacity-100 py-4 px-4' : 'max-h-0 opacity-0'
            } ${className}`}
        >
            {children}
        </div>
    );
};

// --- Data Structures ---

interface ExamSet {
  id: string;
  subject: string;
  set: number;
  description: string;
  totalMarks: number;
  duration: number; // In minutes
  questionCount: number;
}

interface SubjectCollectionProps {
  examSets: ExamSet[];
}

// --- Navigation Hook Simulation (for demonstration) ---
const useNavigateSimulated = () => {
    // In a real application, you would use 'react-router-dom's useNavigate
    return (path: string) => {
        console.log(`Navigating to: ${path}`);
        // Add your preferred client-side navigation logic here if not using a router
    };
};

// --- Main Component ---

export default function SubjectCollection({ examSets }: SubjectCollectionProps) {
    const navigate = useNavigateSimulated();

    // Grouping Logic
    const groupedBySubject = examSets.reduce(
        (acc, set) => {
            if (!acc[set.subject]) {
                acc[set.subject] = [];
            }
            acc[set.subject].push(set);
            return acc;
        },
        {} as Record<string, ExamSet[]>,
    );

    const sortedSubjects = Object.keys(groupedBySubject).sort();

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4">
            <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">Exam Sets by Subject</h2>
            
            <AccordionSimulated type="single" collapsible defaultValue={sortedSubjects[0]}>
                {sortedSubjects.map((subject) => {
                    const sets = groupedBySubject[subject];
                    const totalQuestions = sets.reduce((sum, set) => sum + set.questionCount, 0);
                    const avgDuration = sets.length > 0 ? Math.round(sets.reduce((sum, set) => sum + set.duration, 0) / sets.length) : 0;

                    return (
                        <AccordionItemSimulated key={subject} value={subject}>
                            <AccordionTriggerSimulated value={subject}>
                                <div className="flex items-center gap-6 flex-1">
                                    {/* Subject Title */}
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                                        <span className="text-xl font-bold text-gray-900">{subject}</span>
                                    </div>
                                    
                                    {/* Summary Stats */}
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
                                        <span>
                                            <span className="font-semibold text-indigo-600">{sets.length}</span> set{sets.length !== 1 ? "s" : ""}
                                        </span>
                                        <span>
                                            <span className="font-semibold text-indigo-600">{totalQuestions}</span> total questions
                                        </span>
                                        <span>
                                            Avg <span className="font-semibold text-indigo-600">{avgDuration}</span> min
                                        </span>
                                    </div>
                                </div>
                            </AccordionTriggerSimulated>
                            
                            <AccordionContentSimulated value={subject} className="bg-white">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {sets.map((examSet) => (
                                        <Card key={examSet.id} className="flex flex-col h-full">
                                            <CardHeader className="flex-grow-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-xl font-bold text-indigo-700">Set {examSet.set}</CardTitle>
                                                        <CardDescription>{examSet.subject}</CardDescription>
                                                    </div>
                                                    <Badge>{examSet.questionCount} Q</Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="flex-1 space-y-4">
                                                <p className="text-sm text-gray-600">{examSet.description}</p>
                                                <div className="grid grid-cols-2 gap-3 text-sm border-t pt-4">
                                                    <div>
                                                        <p className="text-gray-500">Total Marks</p>
                                                        <p className="font-bold text-lg text-green-600">{examSet.totalMarks}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Duration</p>
                                                        <p className="font-bold text-lg text-blue-600">{examSet.duration} min</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <div className="p-4 pt-0 border-t">
                                                <div className="flex gap-3">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex-1 gap-2 text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                                                        onClick={() => navigate(`/exam/${examSet.id}`)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                        Manage
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        className="flex-1 gap-2" 
                                                        onClick={() => navigate(`/quiz/${examSet.id}`)}
                                                    >
                                                        <Play className="h-4 w-4" />
                                                        Take Exam
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </AccordionContentSimulated>
                        </AccordionItemSimulated>
                    );
                })}
            </AccordionSimulated>
        </div>
    );
}