
const Loading = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Please Wait...</p>
          </div>
        </div>
      );
}

export default Loading