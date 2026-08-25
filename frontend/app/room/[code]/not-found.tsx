'use client'
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 ">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-white/10 p-6 shadow-xl backdrop-blur-md text-center">
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl">
            🏠
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white">
          Room Not Found
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          This room doesn&apos;t exist or may have expired.
          <br />
          Please check the room code and try again.
        </p>

        <button
          onClick={() => window.location.href = "/"}
          className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-200"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;