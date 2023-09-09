import { useState } from 'react';
import axios from 'axios';

const TranscriptDownloader = () => {
  const [videoLink, setVideoLink] = useState('');
  const [transcriptData, setTranscriptData] = useState(null);

  const handleVideoLinkChange = (e) => {
    setVideoLink(e.target.value);
  };

  const fetchDataAndDownload = async () => {
    try {
      // Extract the video ID from the input (assuming the format: https://www.youtube.com/watch?v=VIDEO_ID)
      // const videoId = videoLink.match(/v=([^&]+)/)[1];

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

      // Set the transcript data in state
      setTranscriptData(response.data);

      // Convert the API response data to text (JSON in this case)
      const jsonData = JSON.stringify(response.data);

      // Create a Blob containing the text data
      const blob = new Blob([jsonData], { type: 'application/json' });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transcript.txt'; // You can customize the filename here
      a.style.display = 'none';

      // Append the link to the DOM and trigger the download
      document.body.appendChild(a);
      a.click();

      // Clean up resources
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Paste video link..."
        value={videoLink}
        onChange={handleVideoLinkChange}
      />
      <button onClick={fetchDataAndDownload}>Download Transcript</button>
      {transcriptData && (
        <div>
          {/* Display the transcript data here if needed */}
          <pre>{JSON.stringify(transcriptData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TranscriptDownloader;
