import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Calendar, Eye, User, Clock } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Sample video data
// const sampleVideos = [
//   {
//     _id: 1,
//     title: "Deep Learning Fundamentals: Neural Network Architecture",
//     description: "A comprehensive introduction to neural network architecture, covering the basic building blocks of deep learning systems.",
//     author: "Dr. Sarah Chen",
//     authorAvatar: "👩‍🔬",
//     category: "Research",
//     duration: "18:42",
//     views: "12,453",
//     uploadDate: "2024-01-15",
//     thumbnail: "🎥",
//     tags: ["Deep Learning", "Neural Networks", "AI Fundamentals"]
//   },
//   {
//     _id: 2,
//     title: "Machine Learning Algorithms Explained",
//     description: "An overview of the most important machine learning algorithms and their practical applications in real-world scenarios.",
//     author: "Dr. Michael Park",
//     authorAvatar: "👨‍💻",
//     category: "Tutorial",
//     duration: "25:30",
//     views: "8,921",
//     uploadDate: "2024-01-12",
//     thumbnail: "📊",
//     tags: ["Machine Learning", "Algorithms", "Data Science"]
//   },
//   {
//     _id: 3,
//     title: "Computer Vision Techniques in Medical Imaging",
//     description: "Exploring how computer vision and deep learning are revolutionizing medical image analysis and diagnosis.",
//     author: "Dr. Lisa Wang",
//     authorAvatar: "👩‍⚕️",
//     category: "Research",
//     duration: "32:15",
//     views: "15,672",
//     uploadDate: "2024-01-10",
//     thumbnail: "🏥",
//     tags: ["Computer Vision", "Medical AI", "Healthcare"]
//   },
//   {
//     _id: 4,
//     title: "Natural Language Processing: Transformers Deep Dive",
//     description: "Understanding the transformer architecture that powers modern NLP models like GPT and BERT.",
//     author: "Prof. James Rodriguez",
//     authorAvatar: "👨‍🏫",
//     category: "Tutorial",
//     duration: "41:22",
//     views: "22,103",
//     uploadDate: "2024-01-08",
//     thumbnail: "💬",
//     tags: ["NLP", "Transformers", "Language Models"]
//   },
//   {
//     _id: 5,
//     title: "Reinforcement Learning in Robotics",
//     description: "How reinforcement learning algorithms enable robots to learn complex behaviors through trial and error.",
//     author: "Dr. Anna Kowalski",
//     authorAvatar: "👩‍🔬",
//     category: "Research",
//     duration: "28:17",
//     views: "9,854",
//     uploadDate: "2024-01-05",
//     thumbnail: "🤖",
//     tags: ["Reinforcement Learning", "Robotics", "AI Control"]
//   },
//   {
//     _id: 6,
//     title: "Ethics in Artificial Intelligence",
//     description: "Discussing the ethical implications of AI systems and the importance of responsible AI development.",
//     author: "Dr. Robert Kim",
//     authorAvatar: "👨‍💼",
//     category: "Discussion",
//     duration: "35:48",
//     views: "18,291",
//     uploadDate: "2024-01-03",
//     thumbnail: "⚖️",
//     tags: ["AI Ethics", "Responsible AI", "Society"]
//   }
// ];

const VideoCard = ({ video, onClick }) => {
  const {
    title,
    description,
    tags = [],
    author,
    authorAvatar,
    category,
    thumbnail,
    uploadDate,
    duration,
    views
  } = video;

  return (
    <div
      onClick={() => onClick(video)}
      style={{
        border: '1px solid #ddd',
        borderRadius: '16px',
        padding: '1rem',
        marginBottom: '1.5rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        maxWidth: '600px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.05)';
      }}
    >
      {/* Video Thumbnail */}
      <div style={{
        width: '100%',
        height: '200px',
        backgroundColor: '#f1f3f4',
        borderRadius: '12px',
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          fontSize: '4rem',
          opacity: 0.7
        }}>
          {thumbnail}
        </div>

        {/* Play Button Overlay */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Play size={24} color="white" style={{ marginLeft: '3px' }} />
        </div>

        {/* Duration Badge */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Clock size={12} />
          {duration}
        </div>
      </div>

      <h2 style={{
        fontSize: '1.25rem',
        marginBottom: '0.5rem',
        color: '#24292e',
        fontWeight: '600'
      }}>
        {title}
      </h2>

      <p style={{
        color: '#666',
        fontSize: '0.95rem',
        marginBottom: '0.75rem',
        lineHeight: '1.4'
      }}>
        {description}
      </p>

      {/* Author and Meta Info */}
      <div style={{
        fontSize: '0.8rem',
        color: '#888',
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ fontSize: '1rem' }}>{authorAvatar}</span>
          <strong>{author || 'Unknown'}</strong>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Calendar size={12} />
          {new Date(uploadDate).toDateString()}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Eye size={12} />
          {views} views
        </div>
        <span style={{
          backgroundColor: '#e1e4e8',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '11px'
        }}>
          {category}
        </span>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {tags.map((tag, index) => (
          <span
            key={index}
            style={{
              backgroundColor: '#e0e7ff',
              padding: '0.3rem 0.6rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              color: '#1e40af'
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const VideoSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Search videos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          flex: 1,
          padding: '0.75rem 1rem',
          fontSize: '1rem',
          borderRadius: '6px',
          border: '1px solid #d1d5da',
          maxWidth: '400px'
        }}
      />
      <span style={{ marginLeft: '-30px', color: '#888' }}>🔍</span>
    </div>
  );
};

const VideoFilters = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ['All', 'Research', 'Tutorial', 'Discussion', 'Lab Work'];

  return (
    <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: '1px solid #d1d5da',
            backgroundColor: selectedCategory === category ? '#0366d6' : '#ffffff',
            color: selectedCategory === category ? 'white' : '#586069',
            cursor: 'pointer',
            fontWeight: selectedCategory === category ? '600' : 'normal',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (selectedCategory !== category) {
              e.target.style.backgroundColor = '#f6f8fa';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCategory !== category) {
              e.target.style.backgroundColor = '#ffffff';
            }
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const VideoList = ({ videos, onVideoClick }) => {
  return (
    <div>
      {videos.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#586069'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📹</div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No videos found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        videos.map(video => (
          <VideoCard key={video._id} video={video} onClick={onVideoClick} />
        ))
      )}
    </div>
  );
};

const VideoListPage = () => {
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredVideos, setFilteredVideos] = useState([]);
  // const [loading, setLoading] = useState(true);

  // Fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/videos`);
        if (Array.isArray(response.data)) {
          setVideos(response.data);
          setFilteredVideos(response.data); // Initialize filtered videos
        } else {
          console.error('Invalid response format:', response.data);
          setVideos([]);
          setFilteredVideos([]);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setVideos([]);
        setFilteredVideos([]);
      } finally {
        // setLoading(false);
        console.log('Videos fetched successfully');
      }
    };

    fetchVideos();
  }, []);
  // Filter videos based on search term and category
  useEffect(() => {
    let filtered = videos;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(video =>
        video.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredVideos(filtered);
  }, [videos, searchTerm, selectedCategory]);

  const handleVideoClick = (video) => {
    // navigate to the video page
    console.log('Video clicked:', video.title);
    // alert(`Opening video: ${video.title}`);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e1e4e8',
        padding: '24px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#24292e',
            margin: '0 0 8px 0'
          }}>
            Videos
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#586069',
            margin: 0
          }}>
            Educational videos, research presentations, and tutorials from our lab
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 20px'
      }}>
        <VideoSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <VideoFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <VideoList videos={filteredVideos} onVideoClick={handleVideoClick} />

        {/* Results Summary */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1rem',
          color: '#586069',
          fontSize: '0.9rem'
        }}>
          Showing {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      </div>
    </div>
  );
};

export default VideoListPage;