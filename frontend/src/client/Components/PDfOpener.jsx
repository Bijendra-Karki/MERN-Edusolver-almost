import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { ChevronLeft, ChevronRight, CheckCircle, Loader } from 'lucide-react';
// Don't forget to configure the PDF worker in your application entry file (e.g., App.js)

// Replace this with the actual URL or local path to your PDF file
// NOTE: This path looks relative to the backend. You might need to change this
// to a public URL where the PDF is served (e.g., '/uploads/pdfs/...')
const SAMPLE_PDF_URL = "http://localhost:8000/uploads/pdfs/1757869546658-Lecture-15---MySQL--PHP-1.pdf";

// 💡 The component now receives props as a single object (including the new subjectTitle)
function PDfOpener({ lessonId, totalPagesInLesson = 10, courseId, subjectTitle }) {
    // 1. PDF Document State
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // 2. Progress Tracking State (Simulated Backend State)
    const [maxReachedPage, setMaxReachedPage] = useState(1); // The highest page the user has ever seen

    // --- Progress Calculation ---
    // Use numPages for accurate percentage
    const progressPercentage = numPages 
        ? Math.round((maxReachedPage / numPages) * 100) 
        : 0; 

    // Simulated API interaction for fetching initial progress (runs once)
    useEffect(() => {
        // Simulating the loading and initial max page fetch
        setLoading(true);
        const initialLoad = setTimeout(() => {
            // For demo: set initial max reached page (e.g., loaded from a user profile)
            setMaxReachedPage(3); 
            setLoading(false);
        }, 1000);

        return () => clearTimeout(initialLoad);
    }, [courseId, lessonId]); // Dependency array to prevent infinite loop


    // --- Document Handlers ---
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoading(false);
    }

    // --- Navigation Handlers ---

    // Logic: Only increases progress if moving forward.
    const goToNextPage = () => {
        if (currentPage < numPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);

            // CRITICAL PROGRESS LOGIC: Update the max reached page
            if (newPage > maxReachedPage) {
                setMaxReachedPage(newPage);
                // In a real app: Send new progress to the backend
                // axios.post(`/api/progress/${courseId}/${lessonId}`, { maxPage: newPage });
            }
        }
    };

    // Logic: Does NOT decrease the maxReachedPage (progress)
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-96 text-lg text-blue-600">
                <Loader className="animate-spin mr-2" /> Loading lesson content...
            </div>
        );
    }

    // --- Main UI ---
    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-xl">
            {/* 💡 Display the passed subject title */}
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
                Lesson: {subjectTitle || 'PDF Viewer'}
            </h2>
            
            {/* Progress Bar and Status */}
            <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-gray-700">Your Reading Progress</span>
                    <span className="text-xl font-bold text-blue-600">
                        {progressPercentage}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-700 ${
                            progressPercentage === 100 ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    You have reached page **{maxReachedPage}** out of {numPages}.
                    {progressPercentage === 100 && (
                        <span className="text-green-600 ml-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" /> Lesson Completed!
                        </span>
                    )}
                </p>
            </div>

            {/* PDF Viewer Container */}
            <div className="flex flex-col items-center space-y-4">
                <div className="border border-gray-300 shadow-lg bg-white overflow-hidden max-w-full">
                    <Document 
                        file={"http://localhost:8000/uploads/pdfs/1757869546658-Lecture-15---MySQL--PHP-1.pdf"}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<Loader className="animate-spin w-8 h-8 text-blue-500 m-16" />}
                     
                    >
                        {/* The 'scale' prop helps adjust the PDF size to the container */}
                        <Page pageNumber={currentPage} renderTextLayer={false} renderAnnotationLayer={false} scale={1.2} />
                    </Document>
                </div>
                
                {/* Navigation and Status */}
                <div className="flex items-center space-x-4 p-4 bg-white/80 rounded-xl shadow-md border border-gray-200">
                    
                    {/* Previous Button */}
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage <= 1}
                        className={`p-3 rounded-full transition-all duration-200 ${
                            currentPage <= 1 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-inner'
                        }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page Status */}
                    <span className="text-lg font-medium text-gray-800 w-32 text-center">
                        Page {currentPage} of {numPages || '...'}
                    </span>
                    
                    {/* Next Button */}
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage >= numPages}
                        className={`p-3 rounded-full transition-all duration-200 ${
                            currentPage >= numPages 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                        }`}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Visual Cue for Progress */}
                <p className="text-sm text-gray-500 italic pt-2">
                    Note: Progress is saved when you click **Next** and advance to a new page.
                </p>

            </div>
        </div>
    );
}

export default PDfOpener;