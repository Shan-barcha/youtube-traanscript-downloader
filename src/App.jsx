import { useState, useEffect } from 'react';
import axios from 'axios';

const YouTubeChannelTranscripts = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideoData() {
      try {
        const response = await axios.get(
          'https://www.googleapis.com/youtube/v3/search',
          {
            params: {
              key: 'AIzaSyAHI04CQtE8SJrGcuDWvE8L2rVGMKyzLYo',
              channelId: 'UCvz8QtzcQv42J82JgkxkiZg',
              part: 'snippet',
              maxResults: 10, 
            },
          }
        );

        const videoItems = response.data.items;

        
        const videosWithCaptions = await Promise.all(
          videoItems.map(async (video) => {
            const captions = await fetchCaptionsForVideo(video.id.videoId);
            return {
              ...video,
              captions,
            };
          })
        );

        setVideos(videosWithCaptions);
      } catch (error) {
        console.error('Error fetching video data', error);
      }
    }

    fetchVideoData();
  }, []);

  async function fetchCaptionsForVideo(videoId) {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/youtube/v3/captions',
        {
          params: {
            key: 'AIzaSyAHI04CQtE8SJrGcuDWvE8L2rVGMKyzLYo',
            videoId,
            part: 'snippet',
            maxResults: 1, 
          },
        }
      );

      if (response.data.items.length > 0) {
        const captionTrackId = response.data.items[0].id;
        const captionTrack = await axios.get(
          'https://www.googleapis.com/youtube/v3/captions/' + captionTrackId,
          {
            params: {
              key: 'AIzaSyAHI04CQtE8SJrGcuDWvE8L2rVGMKyzLYo',
            },
          }
        );

        return captionTrack.data.snippet.title;
      } else {
        return 'No captions available';
      }
    } catch (error) {
      console.error('Error fetching captions', error);
      return 'Error fetching captions';
    }
  }

  return (
    <div>
      <h1>YouTube Channel Transcripts</h1>
      <ul>
        {videos.map((video) => (
          <li key={video.id.videoId}>
            <h2>{video.snippet.title}</h2>
            <p>Captions: {video.captions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YouTubeChannelTranscripts;
