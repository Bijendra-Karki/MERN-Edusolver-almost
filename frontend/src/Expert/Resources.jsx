// Resources.jsx
import React from 'react';

const Resources = ({ resources }) => {
    return (
        <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Shared Learning Resources</h2>
                <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Upload New
                </button>
            </div>

            <p className="text-gray-500 italic">Resource list goes here...</p>

        </div>
    );
};

export default Resources;