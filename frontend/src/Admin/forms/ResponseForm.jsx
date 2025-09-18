import React, { useState } from "react";

export default function ResponseForm() {
  const [queries, setQueries] = useState([
    {
      id: 1,
      user: "John Doe",
      email: "john@example.com",
      question: "How do I upload course materials to the platform?",
      status: "pending",
      timestamp: "2024-01-15 10:30 AM",
      response: "",
    },
    {
      id: 2,
      user: "Sarah Smith",
      email: "sarah@example.com",
      question: "Can I edit my teacher profile after registration?",
      status: "pending",
      timestamp: "2024-01-15 09:15 AM",
      response: "",
    },
    {
      id: 3,
      user: "Mike Johnson",
      email: "mike@example.com",
      question: "What file formats are supported for course uploads?",
      status: "responded",
      timestamp: "2024-01-14 02:45 PM",
      response: "We support PDF, DOCX, PPT, and video files up to 100MB.",
    },
  ]);

  const [responseText, setResponseText] = useState({});
  const [expandedQuery, setExpandedQuery] = useState(null);

  const handleResponseChange = (queryId, text) => {
    setResponseText((prev) => ({ ...prev, [queryId]: text }));
  };

  const submitResponse = (queryId) => {
    const response = responseText[queryId];
    if (!response?.trim()) return;

    setQueries((prev) =>
      prev.map((query) =>
        query.id === queryId ? { ...query, status: "responded", response } : query
      )
    );
    setResponseText((prev) => ({ ...prev, [queryId]: "" }));
    setExpandedQuery(null);
  };

  const toggleExpand = (queryId) => {
    setExpandedQuery(expandedQuery === queryId ? null : queryId);
  };

  const getStatusColor = (status) =>
    status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Queries</h1>
          <p className="text-gray-600">Manage and respond to user questions</p>
        </div>

        {/* Queries */}
        <div className="space-y-6">
          {queries.map((query) => (
            <div key={query.id} className="bg-white shadow rounded-lg p-6">
              {/* User Info */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{query.user}</h2>
                  <p className="text-sm text-gray-500">{query.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{query.timestamp}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(query.status)}`}>
                  {query.status}
                </span>
              </div>

              {/* Question */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-1">Question:</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{query.question}</p>
              </div>

              {/* Response (if any) */}
              {query.status === "responded" && query.response && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-1">Response:</h3>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                    {query.response}
                  </p>
                </div>
              )}

              {/* Pending Response Form */}
              {query.status === "pending" && (
                <div>
                  {expandedQuery === query.id ? (
                    <div className="space-y-3">
                      <textarea
                        className="w-full border rounded-lg p-2 min-h-[6rem]  text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Type your response here..."
                        value={responseText[query.id] || ""}
                        onChange={(e) => handleResponseChange(query.id, e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitResponse(query.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                          Send Response
                        </button>
                        <button
                          onClick={() => setExpandedQuery(null)}
                          className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleExpand(query.id)}
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
                    >
                      Respond to Query
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {queries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No queries found</p>
          </div>
        )}
      </div>
    </div>
  );
}
