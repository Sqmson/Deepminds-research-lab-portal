import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  User, 
  Calendar, 
  Eye,
  MessageCircle,
  Send,
  MoreVertical,
  Flag
} from 'lucide-react';

const VideoPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Sample video data
  const videoData = {
    id: 1,
    title: "Deep Learning Fundamentals: Neural Network Architecture",
    description: "A comprehensive introduction to neural network architecture, covering the basic building blocks of deep learning systems. This video explains how neurons work, activation functions, and how layers combine to create powerful learning systems.",
    author: "Dr. Sarah Chen",
    authorAvatar: "👩‍🔬",
    uploadDate: "2024-01-15",
    duration: "18:42",
    views: "12,453",
    likes: 1247,
    dislikes: 23,
    category: "Research",
    tags: ["Deep Learning", "Neural Networks", "AI Fundamentals"]
  };

  // Sample comments data
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Alex Johnson",
      avatar: "👨‍💻",
      content: "Excellent explanation of backpropagation! This really helped me understand the mathematical concepts behind neural networks.",
      timestamp: "2 hours ago",
      likes: 15,
      replies: []
    },
    {
      id: 2,
      author: "Maria Rodriguez",
      avatar: "👩‍🎓",
      content: "Could you make a follow-up video about convolutional neural networks? This was a great foundation.",
      timestamp: "5 hours ago",
      likes: 8,
      replies: [
        {
          id: 3,
          author: "Dr. Sarah Chen",
          avatar: "👩‍🔬",
          content: "Great suggestion! I'm planning a CNN video for next week.",
          timestamp: "3 hours ago",
          likes: 12
        }
      ]
    },
    {
      id: 4,
      author: "David Kim",
      avatar: "👨‍🔬",
      content: "The visualization at 12:30 was particularly helpful. Do you have the code for those animations available?",
      timestamp: "1 day ago",
      likes: 22,
      replies: []
    }
  ]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Current User",
        avatar: "👤",
        content: newComment,
        timestamp: "just now",
        likes: 0,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Video Player Section */}
        <div style={{
          backgroundColor: '#000000',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '20px',
          position: 'relative',
          aspectRatio: '16/9'
        }}>
          {/* Video Placeholder */}
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              textAlign: 'center',
              color: 'white'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '16px',
                opacity: 0.7
              }}>
                🎥
              </div>
              <p style={{
                margin: 0,
                fontSize: '1.1rem',
                opacity: 0.8
              }}>
                Video Player ({videoData.duration})
              </p>
            </div>
            
            {/* Play/Pause Button Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.6)',
                border: 'none',
                borderRadius: '50%',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0,0,0,0.8)';
                e.target.style.transform = 'translate(-50%, -50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0,0,0,0.6)';
                e.target.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              {isPlaying ? (
                <Pause size={32} color="white" />
              ) : (
                <Play size={32} color="white" style={{ marginLeft: '4px' }} />
              )}
            </button>

            {/* Video Controls Bar */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <button style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer'
              }}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <div style={{
                flex: 1,
                height: '4px',
                backgroundColor: 'rgba(255,255,255,0.3)',
                borderRadius: '2px',
                position: 'relative'
              }}>
                <div style={{
                  width: '35%',
                  height: '100%',
                  backgroundColor: '#ff4444',
                  borderRadius: '2px'
                }}></div>
              </div>
              
              <span style={{
                color: 'white',
                fontSize: '14px'
              }}>
                6:23 / {videoData.duration}
              </span>
              
              <Volume2 size={20} color="white" />
              <Maximize size={20} color="white" />
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '30px'
        }}>
          {/* Main Content */}
          <div>
            {/* Video Info */}
            <div style={{
              marginBottom: '24px'
            }}>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#24292e',
                margin: '0 0 12px 0',
                lineHeight: '1.3'
              }}>
                {videoData.title}
              </h1>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
                fontSize: '14px',
                color: '#586069'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Eye size={16} />
                  {videoData.views} views
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Calendar size={16} />
                  {new Date(videoData.uploadDate).toLocaleDateString()}
                </div>
                <span style={{
                  backgroundColor: '#f1f3f4',
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {videoData.category}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => {
                    setLiked(!liked);
                    if (disliked) setDisliked(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    border: '1px solid #d1d5da',
                    borderRadius: '20px',
                    backgroundColor: liked ? '#e6f3ff' : '#ffffff',
                    color: liked ? '#0366d6' : '#586069',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ThumbsUp size={16} />
                  {videoData.likes + (liked ? 1 : 0)}
                </button>

                <button
                  onClick={() => {
                    setDisliked(!disliked);
                    if (liked) setLiked(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    border: '1px solid #d1d5da',
                    borderRadius: '20px',
                    backgroundColor: disliked ? '#ffe6e6' : '#ffffff',
                    color: disliked ? '#d73a49' : '#586069',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ThumbsDown size={16} />
                  {videoData.dislikes + (disliked ? 1 : 0)}
                </button>

                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    border: '1px solid #d1d5da',
                    borderRadius: '20px',
                    backgroundColor: bookmarked ? '#fff5b4' : '#ffffff',
                    color: bookmarked ? '#b08800' : '#586069',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Bookmark size={16} />
                  Save
                </button>

                <button style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  border: '1px solid #d1d5da',
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  color: '#586069',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}>
                  <Share2 size={16} />
                  Share
                </button>
              </div>

              {/* Author Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#f6f8fa',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <div style={{
                  fontSize: '2rem'
                }}>
                  {videoData.authorAvatar}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 4px 0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#24292e'
                  }}>
                    {videoData.author}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#586069'
                  }}>
                    Research Scientist • 156 videos
                  </p>
                </div>
                <button style={{
                  padding: '8px 16px',
                  backgroundColor: '#0366d6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  Follow
                </button>
              </div>

              {/* Description */}
              <div style={{
                backgroundColor: '#f6f8fa',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#24292e',
                  lineHeight: '1.5'
                }}>
                  {videoData.description}
                </p>
                
                {/* Tags */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  marginTop: '12px'
                }}>
                  {videoData.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#e1e4e8',
                        color: '#586069',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <MessageCircle size={20} color="#586069" />
                <h2 style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#24292e',
                  margin: 0
                }}>
                  Comments ({comments.length})
                </h2>
              </div>

              {/* Add Comment */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#f6f8fa',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '1.5rem' }}>👤</div>
                <div style={{ flex: 1 }}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      border: '1px solid #d1d5da',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical',
                      marginBottom: '8px'
                    }}
                  />
                  <button
                    onClick={handleAddComment}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      backgroundColor: '#0366d6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <Send size={16} />
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {comments.map(comment => (
                  <div key={comment.id} style={{
                    padding: '16px',
                    border: '1px solid #e1e4e8',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <div style={{ fontSize: '1.5rem' }}>
                        {comment.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px'
                        }}>
                          <span style={{
                            fontWeight: '600',
                            fontSize: '14px',
                            color: '#24292e'
                          }}>
                            {comment.author}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            color: '#586069'
                          }}>
                            {comment.timestamp}
                          </span>
                        </div>
                        <p style={{
                          margin: '0 0 8px 0',
                          fontSize: '14px',
                          color: '#24292e',
                          lineHeight: '1.4'
                        }}>
                          {comment.content}
                        </p>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '12px',
                          color: '#586069'
                        }}>
                          <button style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#586069',
                            cursor: 'pointer'
                          }}>
                            <ThumbsUp size={12} />
                            {comment.likes}
                          </button>
                          <button style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#586069',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}>
                            Reply
                          </button>
                          <button style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#586069',
                            cursor: 'pointer'
                          }}>
                            <Flag size={12} />
                          </button>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div style={{
                            marginTop: '12px',
                            paddingLeft: '20px',
                            borderLeft: '2px solid #f1f3f4'
                          }}>
                            {comment.replies.map(reply => (
                              <div key={reply.id} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                paddingTop: '12px'
                              }}>
                                <div style={{ fontSize: '1.2rem' }}>
                                  {reply.avatar}
                                </div>
                                <div>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '4px'
                                  }}>
                                    <span style={{
                                      fontWeight: '600',
                                      fontSize: '14px',
                                      color: '#24292e'
                                    }}>
                                      {reply.author}
                                    </span>
                                    <span style={{
                                      fontSize: '12px',
                                      color: '#586069'
                                    }}>
                                      {reply.timestamp}
                                    </span>
                                  </div>
                                  <p style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    color: '#24292e'
                                  }}>
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#24292e',
              margin: '0 0 16px 0'
            }}>
              Related Videos
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f6f8fa'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                  <div style={{
                    width: '120px',
                    height: '68px',
                    backgroundColor: '#f1f3f4',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    🎥
                  </div>
                  <div>
                    <h4 style={{
                      margin: '0 0 4px 0',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#24292e',
                      lineHeight: '1.3'
                    }}>
                      Introduction to Machine Learning Algorithms
                    </h4>
                    <p style={{
                      margin: '0 0 2px 0',
                      fontSize: '11px',
                      color: '#586069'
                    }}>
                      Dr. Michael Park
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '11px',
                      color: '#586069'
                    }}>
                      2.1k views • 3 days ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;