"use client";

import React from "react";

// --- Custom Tailwind Components to replace Shadcn/ui ---

const Label = ({ htmlFor, children, className = '' }) => (
    <label htmlFor={htmlFor} className={`cursor-pointer text-base text-gray-800 ${className}`}>
        {children}
    </label>
);

const Input = (props) => (
    <input 
        {...props} 
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" 
    />
);

// This simulates RadioGroupItem and is used inside the option layout
const RadioGroupItemSimulated = ({ value, id, checked, onChange }) => (
    <input
        type="radio"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        // Custom styling for the radio button
        className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
        // Force accent color for better visual consistency
        style={{ accentColor: '#4f46e5' }}
    />
);

// This is a simple container, the main logic for RadioGroup is handled in the parent component
const RadioGroupSimulated = ({ children, value, onValueChange }) => {
    // We pass the controlled value and change handler down to the native inputs
    const handleChange = (e) => {
        onValueChange(e.target.value);
    };

    return (
        <div className="space-y-3" onChange={handleChange}>
            {children}
        </div>
    );
};


// --- Main Component ---

interface QuizQuestionProps {
  question: any;
  answer: any;
  onAnswerChange: (answer: any) => void;
}

export default function QuizQuestion({ question, answer, onAnswerChange }: QuizQuestionProps) {
    
    const baseClasses = "flex items-center space-x-3 p-3 border rounded-lg transition-colors duration-150 cursor-pointer hover:bg-gray-50";

    // --- Multiple Choice ---
    if (question.type === "multiple-choice") {
        return (
            <RadioGroupSimulated 
                value={answer?.toString() || ""} 
                onValueChange={(value) => onAnswerChange(Number.parseInt(value))}
            >
                {question.options.map((option: string, index: number) => {
                    const optionValue = index.toString();
                    const isChecked = optionValue === answer?.toString();
                    
                    return (
                        <div 
                            key={index} 
                            className={`${baseClasses} ${isChecked ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-500' : 'border-gray-200'}`}
                            // Wrap click handler to make the whole container selectable
                            onClick={() => onAnswerChange(index)}
                        >
                            <RadioGroupItemSimulated 
                                value={optionValue} 
                                id={`mc-option-${index}`}
                                checked={isChecked}
                                // The onChange here is mainly for accessibility, handled by RadioGroupSimulated
                                onChange={() => onAnswerChange(index)}
                            />
                            <Label htmlFor={`mc-option-${index}`} className="font-medium">
                                {String.fromCharCode(65 + index)}. {option}
                            </Label>
                        </div>
                    );
                })}
            </RadioGroupSimulated>
        );
    }

    // --- Short Answer ---
    if (question.type === "short-answer") {
        return (
            <div className="space-y-2">
                <Input
                    type="text"
                    placeholder="Type your short answer here..."
                    value={answer || ""}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className="text-base"
                />
            </div>
        );
    }

    // --- True/False ---
    if (question.type === "true-false") {
        return (
            <RadioGroupSimulated 
                value={answer?.toString() || ""} 
                onValueChange={(value) => onAnswerChange(value)}
            >
                {/* True Option */}
                <div 
                    className={`${baseClasses} ${answer === "true" ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-500' : 'border-gray-200'}`}
                    onClick={() => onAnswerChange("true")}
                >
                    <RadioGroupItemSimulated 
                        value="true" 
                        id="true-option"
                        checked={answer === "true"}
                        onChange={() => onAnswerChange("true")}
                    />
                    <Label htmlFor="true-option" className="font-medium text-green-700">
                        True
                    </Label>
                </div>
                
                {/* False Option */}
                <div 
                    className={`${baseClasses} ${answer === "false" ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-500' : 'border-gray-200'}`}
                    onClick={() => onAnswerChange("false")}
                >
                    <RadioGroupItemSimulated 
                        value="false" 
                        id="false-option"
                        checked={answer === "false"}
                        onChange={() => onAnswerChange("false")}
                    />
                    <Label htmlFor="false-option" className="font-medium text-red-700">
                        False
                    </Label>
                </div>
            </RadioGroupSimulated>
        );
    }

    return null;
}