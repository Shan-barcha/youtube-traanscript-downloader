/* eslint-disable no-undef */
import axios from "axios";

const options = {
  method: 'GET',
  url: 'https://youtube-transcriptor.p.rapidapi.com/transcript',
  params: {
    video_id: '8aGhZQkoFbQ',
    lang: 'en'
  },
  headers: {
    'X-RapidAPI-Key': 'f66cd1d01emshd5f00aee61a4c56p16f2aejsnb029116c21a7',
    'X-RapidAPI-Host': 'youtube-transcriptor.p.rapidapi.com'
  }
};

async function fetchDataAndDownload() {
  try {
    const response = await axios.request(options);
    console.log(response.data);
    console.log("try");

    // Convert the API response data to text (JSON in this case)
    const jsonData = JSON.stringify(response.data);

    // Create a Blob containing the text data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.json'; // You can customize the filename here
    a.style.display = 'none';

    // Append the link to the DOM and trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up resources
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

  } catch (error) {
    console.error(error);
    console.log("catch");
  }
}

// Call the function to fetch data and trigger download
fetchDataAndDownload();
