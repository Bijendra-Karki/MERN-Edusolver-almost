"use client";

import React, { useState } from "react";
import { Edit2, Trash2, Zap } from "lucide-react";

// --- Custom Tailwind Components to replace Shadcn/ui ---

const Card = ({ children, className = '' }) => (
  <div className={`rounded-xl border bg-white shadow-md ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 p-6 border-b">
    {children}
  </div>
);
const CardTitle = ({ children }) => (
  <h3 className="text-2xl font-bold leading-none tracking-tight text-gray-900">
    {children}
  </h3>
);
const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-6 ${className}`}>
    {children}
  </div>
);
const Badge = ({ children, className = '' }) => (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-white text-indigo-700 border-indigo-200 ${className}`}>
        {children}
    </span>
);

// Button Component with Size and Variant handling
const Button = ({ children, className = '', variant = 'default', size = 'default', disabled, onClick, ...props }) => {
    const baseStyle = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
    let variantStyle = '';
    let sizeStyle = 'h-10 px-4 py-2';

    if (variant === 'default') variantStyle = 'bg-indigo-600 text-white shadow hover:bg-indigo-700';
    if (variant === 'outline') variantStyle = 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50';
    if (variant === 'destructive') variantStyle = 'bg-red-600 text-white shadow hover:bg-red-700';

    if (size === 'sm') sizeStyle = 'h-8 px-3 py-1.5 text-xs';
    if (size === 'icon') sizeStyle = 'h-9 w-9';

    if (disabled) variantStyle = 'bg-gray-300 text-gray-500 cursor-not-allowed';

    return (
        <button
            className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

// Table components
const Table = ({ children }) => <table className="w-full caption-bottom text-sm">{children}</table>;
const TableHeader = ({ children }) => <thead className="[&_tr]:border-b">{children}</thead>;
const TableBody = ({ children }) => <tbody className="[&_tr:last-child]:border-0">{children}</tbody>;
const TableRow = ({ children }) => <tr className="border-b transition-colors hover:bg-gray-50">{children}</tr>;
const TableHead = ({ children, className = '' }) => <th className={`h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</th>;
const TableCell = ({ children, className = '' }) => <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>;


// --- Data Structures ---

interface Question {
  id: string;
  text: string;
  type: string;
  marks: number;
  options?: string[];
  correctAnswer: any;
}

interface QuestionsListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
}

// --- Dialog Simulation Component ---
interface AlertDialogSimulatedProps {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
}

const AlertDialogSimulated: React.FC<AlertDialogSimulatedProps> = ({ title, description, onConfirm, onCancel, isOpen }) => {
    if (!isOpen) return null;

    return (
        // Overlay
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            {/* Dialog Content */}
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};


// --- Main Component ---

export default function QuestionsList({ questions, onEdit, onDelete }: QuestionsListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            "multiple-choice": "Multiple Choice",
            "short-answer": "Short Answer",
            "true-false": "True/False",
        };
        return labels[type] || type;
    };

    const handleDeleteClick = (question: Question) => {
        setQuestionToDelete(question);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (questionToDelete) {
            onDelete(questionToDelete.id);
        }
        setIsDialogOpen(false);
        setQuestionToDelete(null);
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false);
        setQuestionToDelete(null);
    };


    if (questions.length === 0) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-gray-500 space-y-2">
                    <Zap className="h-8 w-8 mx-auto text-indigo-400" />
                    <p>No questions added yet. Create your first question to get started.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Exam Questions</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50%]">Question</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Marks</TableHead>
                                    <TableHead className="text-right w-[20%]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell className="max-w-xs truncate text-sm text-gray-800" title={question.text}>
                                            {question.text}
                                        </TableCell>
                                        <TableCell>
                                            <Badge>{getTypeLabel(question.type)}</Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold text-gray-800">{question.marks}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onEdit(question)}
                                                    className="gap-1 text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDeleteClick(question)}
                                                    className="gap-1"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <AlertDialogSimulated
                isOpen={isDialogOpen}
                title="Delete Question"
                description="Are you sure you want to delete this question? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
}