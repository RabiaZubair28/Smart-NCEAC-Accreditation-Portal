import React from 'react';

const OverlayPage  = () => {
  return (
      <div className="min-h-screen bg-blue-50 animated-bg background-image">
          <header className="flex justify-between items-center p-6">
              <img src="https://liamcrest.com/assets/static/liamcrestlogo.png" alt="Liam Crest logo" className="h-12"/>
              <nav className="flex space-x-8">
                  <a href="#" className="text-blue-900 hover:underline">Home</a>
                  <a href="#" className="text-blue-900 hover:underline">Our Work</a>
                  <a href="#" className="text-blue-900 hover:underline">About</a>
                  <button className="bg-blue-200 text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-300">
                      CONTACT US <i className="fas fa-pen"></i>
                  </button>
              </nav>
          </header>
          <main className="flex flex-col items-center justify-center text-center mt-20">
              <h1 className="text-6xl text-blue-900 font-bold">Welcome to Liam Crest</h1>
              <div className="mt-10">
                  <img src="https://liamcrest.com/assets/static/header/Asset%2075.png" alt="Illustration of a computer and various digital elements" className="w-full max-w-4xl"/>
              </div>
          </main>
      </div>
  );
};

export default OverlayPage;