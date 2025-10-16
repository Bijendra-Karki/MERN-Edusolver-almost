// StudentRequests.jsx
import React from 'react';

const StudentRequests = ({ requests }) => {
    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Pending Student Requests ({requests.length})</h2>

            {requests.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <p className="text-gray-500 text-lg">No pending requests at this time. 🎉</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Render request list here */}
                </div>
            )}
        </div>
    );
};

export default StudentRequests;