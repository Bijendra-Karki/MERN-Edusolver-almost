import React from 'react'

function PageNotFound() {
   
  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
      
      {/* Visual Indicator: Large 404 Code */}
      <h1 className="text-9xl font-extrabold text-indigo-600 tracking-wider transition-transform duration-500 ease-in-out hover:scale-105">
        404
      </h1>

      {/* Main Message */}
      <div className="mt-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          Page Not Found
        </h2>
        <p className="text-xl font-medium text-gray-600 mt-2">
          Oops! The page you were looking for doesn't exist.
        </p>
      </div>

      {/* Description */}
      <p className="text-gray-500 mb-10 max-w-lg">
        It seems you've followed a broken link or entered a URL that doesn't exist on this site. Don't worry, we'll get you back on track.
      </p>

      {/* Call to Action */}
    

      {/* Optional Footer Text */}
      <div className="mt-20 text-sm text-gray-400">
        Need assistance? Check the URL or contact support.
      </div>
    </div>
  );
}
 

export default PageNotFound
