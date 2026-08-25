const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-white" />

        <p className="mt-4 text-sm text-slate-400">
          Joining room...
        </p>
      </div>
    </div>
  );
};

export default Loading;