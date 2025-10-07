// components/VideoPage/RelatedVideos.jsx

import React from 'react';

const RelatedVideos = ({ videos = [] }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Related Videos</h3>
      <ul className="space-y-3">
        {videos.map((video) => (
          <li key={video._id} className="flex gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
            <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded" />
            <div>
              <div className="text-sm font-medium leading-tight line-clamp-2">{video.title}</div>
              <div className="text-xs text-gray-500">{video.views} views</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedVideos;
