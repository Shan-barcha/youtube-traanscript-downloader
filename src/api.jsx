import { useState } from 'react';
import axios from 'axios';

const TranscriptDownloader = () => {
  const [videoLink, setVideoLink] = useState('');
  const [transcriptData, setTranscriptData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoLinkChange = (e) => {
    setVideoLink(e.target.value);
  };

  const fetchDataAndDownload = async () => {
    try {
      setIsLoading(true); // Show loading state

      const options = {
        method: 'GET',
        url: 'https://youtube-transcriptor.p.rapidapi.com/transcript',
        params: {
          video_id: videoLink,
          lang: 'en',
        },
        headers: {
          'X-RapidAPI-Key': 'f66cd1d01emshd5f00aee61a4c56p16f2aejsnb029116c21a7',
          'X-RapidAPI-Host': 'youtube-transcriptor.p.rapidapi.com',
        },
      };

      const response = await axios.request(options);
      setTranscriptData(response.data);

      const jsonData = JSON.stringify(response.data);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      // Create a download link
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transcript.txt';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      // Clean up resources
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setIsLoading(false); // Hide loading state
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Hide loading state on error
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Transcript Downloader</h1>
      <input
        type="text"
        placeholder="Paste video link..."
        value={videoLink}
        onChange={handleVideoLinkChange}
        className="w-full border border-gray-300 rounded-md py-2 px-3 mb-4"
      />
      <button
        onClick={fetchDataAndDownload}
        disabled={isLoading}
        className={`w-full py-2 ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        } rounded-md`}
      >
        {isLoading ? 'Downloading...' : 'Download Transcript'}
      </button>
      {transcriptData && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Transcript Data</h2>
          <pre className="border border-gray-300 rounded-md p-4">{JSON.stringify(transcriptData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TranscriptDownloader;
