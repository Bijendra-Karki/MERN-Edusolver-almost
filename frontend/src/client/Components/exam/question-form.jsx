"use client";

import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react"; // Added Plus icon for 'Add Option'

// --- Custom Tailwind Components to replace Shadcn/ui ---

const Card = ({ children, className = '' }) => (
  <div className={`w-full max-w-2xl mx-auto rounded-xl border bg-white shadow-lg ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 p-6 border-b bg-gray-50/50 rounded-t-xl">
    {children}
  </div>
);
const CardTitle = ({ children }) => (
  <h3 className="text-2xl font-bold leading-none tracking-tight text-gray-900">
    {children}
  </h3>
);
const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-500">
    {children}
  </p>
);
const CardContent = ({ children }) => (
  <div className="p-6 pt-6">
    {children}
  </div>
);
const Label = ({ htmlFor, children, className = '' }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
        {children}
    </label>
);
const baseInputStyle = "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out";
const Input = (props) => (
    <input {...props} className={baseInputStyle} />
);
const Textarea = (props) => (
    <textarea {...props} className={baseInputStyle} />
);
const Select = React.forwardRef(({ children, value, onChange, id, className = '', ...props }, ref) => (
    <select
        id={id}
        ref={ref}
        value={value}
        onChange={onChange}
        className={`${baseInputStyle} appearance-none cursor-pointer ${className}`}
        {...props}
    >
        {children}
    </select>
));
Select.displayName = 'Select';


const Button = ({ children, className = '', variant = 'default', disabled, onClick, type = 'button', ...props }) => {
    const baseStyle = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors h-10 px-4 py-2';
    let variantStyle = '';
    
    if (variant === 'default') variantStyle = 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700';
    if (variant === 'outline') variantStyle = 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50';
    if (variant === 'destructive') variantStyle = 'bg-red-600 text-white shadow-md hover:bg-red-700';
    
    if (disabled) variantStyle = 'bg-gray-300 text-gray-500 cursor-not-allowed';

    return (
        <button
            type={type}
            className={`${baseStyle} ${variantStyle} ${className}`}
            disabled={disabled}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};


// --- Main Component ---

interface QuestionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export default function QuestionForm({ onSubmit, onCancel, initialData }: QuestionFormProps) {
  const [formData, setFormData] = useState({
    text: "",
    type: "multiple-choice",
    marks: 1,
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type === "multiple-choice" && formData.options.some((opt) => !opt.trim())) {
      alert("Please ensure all multiple-choice options are filled.");
      return;
    }
    onSubmit(formData);
    setFormData({
      text: "",
      type: "multiple-choice",
      marks: 1,
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ""] });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      // Adjust correctAnswer index if the removed option was before the correct one
      let newCorrectAnswer = formData.correctAnswer;
      if (newCorrectAnswer === index) {
        newCorrectAnswer = 0; // Default to the first option
      } else if (newCorrectAnswer > index) {
        newCorrectAnswer -= 1;
      }

      setFormData({ ...formData, options: newOptions, correctAnswer: newCorrectAnswer });
    }
  };
  
  // Helper to convert array index to a label (0 -> A, 1 -> B, etc.)
  const getOptionLabel = (index: number) => String.fromCharCode(65 + index);


  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Question ✏️" : "Add New Question ➕"}</CardTitle>
        <CardDescription>
          {initialData ? "Update the question details" : "Create a new question for this exam set"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="text">Question Text</Label>
            <Textarea
              id="text"
              placeholder="Enter the question..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows={3}
              required
            />
          </div>

          {/* Type and Marks */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Question Type</Label>
              <Select id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="short-answer">Short Answer</option>
                <option value="true-false">True/False</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marks">Marks</Label>
              <Input
                id="marks"
                type="number"
                min="1"
                value={formData.marks}
                onChange={(e) => setFormData({ ...formData, marks: Number.parseInt(e.target.value) })}
              />
            </div>
          </div>

          {/* Conditional Fields: Multiple Choice Options */}
          {formData.type === "multiple-choice" && (
            <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
              <div>
                <Label className="mb-3 block">Options</Label>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="text-sm font-semibold w-6 text-center text-indigo-600">{getOptionLabel(index)}.</span>
                      <Input
                        placeholder={`Option ${getOptionLabel(index)}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        required // Enforce option text
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        className="p-0 h-10 w-10 flex-shrink-0"
                        onClick={() => removeOption(index)}
                        disabled={formData.options.length <= 2}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-3 w-full" 
                    onClick={addOption}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                </Button>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="correctAnswer">Correct Answer (Index)</Label>
                <Select
                  id="correctAnswer"
                  value={formData.correctAnswer.toString()}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: Number.parseInt(e.target.value) })}
                >
                  {formData.options.map((option, index) => (
                    // Use index as value, but display the option text or placeholder
                    <option key={index} value={index.toString()}>
                      {option ? `${getOptionLabel(index)}. ${option}` : `Option ${getOptionLabel(index)}`}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          )}

          {/* Conditional Fields: Short Answer */}
          {formData.type === "short-answer" && (
            <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
              <Label htmlFor="correctAnswer">Correct Answer (Expected Text)</Label>
              <Input
                id="correctAnswer"
                placeholder="Enter the exact correct answer..."
                value={formData.correctAnswer}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
              />
            </div>
          )}

          {/* Conditional Fields: True/False */}
          {formData.type === "true-false" && (
            <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
              <Label htmlFor="correctAnswer">Correct Answer</Label>
              <Select
                id="correctAnswer"
                value={formData.correctAnswer.toString()}
                onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </Select>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Update Question" : "Add Question"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}