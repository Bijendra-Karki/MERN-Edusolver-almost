import React from 'react';
// Assuming 'Send' is an imported icon component
// import { Send } from 'lucide-react'; // Example

const SendNewSuggestion = ({
    showSuggestionModal,
    students,
    suggestion,
    setSuggestion,
    selectedStudentForSuggestion,
    setSelectedStudentForSuggestion,
    handleSendNewSuggestion,
    closeSuggestionModal
}) => {
    if (!showSuggestionModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 mx-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Send Suggestion to Student</h3>
                {/* Student Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                    <select
                        value={selectedStudentForSuggestion}
                        onChange={(e) => setSelectedStudentForSuggestion(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                    >
                        <option value="">Choose a student...</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id.toString()}>
                                {student.name} - {student.subjects.join(", ")}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Suggestion Text */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Suggestion</label>
                    <textarea
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        placeholder="Write your helpful suggestion here..."
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                    />
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 sm:gap-3">
                    <button
                        onClick={handleSendNewSuggestion}
                        disabled={!selectedStudentForSuggestion || !suggestion.trim()}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                    >
                        {/* The 'Send' component must be passed or imported */}
                        {/* Replace <Send /> with your actual icon component if it's not available in this context */}
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg> {/* Placeholder icon */}
                        Send Suggestion
                    </button>
                    <button
                        onClick={closeSuggestionModal}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendNewSuggestion;