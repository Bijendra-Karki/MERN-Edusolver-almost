// MyStudents.jsx
import React from 'react';

const MyStudents = ({ students, setSelectedStudent }) => {
    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Students</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                    <div key={student.id} className="bg-white p-5 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
                        <p className="text-sm text-blue-600 mb-3">Progress: {student.progress}%</p>
                        <p className="text-sm text-gray-500 mb-4">Subjects: {student.subjects.join(', ')}</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setSelectedStudent(student)} // Opens the Suggestion Modal
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                            >
                                Send Suggestion
                            </button>
                            <button
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors text-sm"
                            >
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyStudents;