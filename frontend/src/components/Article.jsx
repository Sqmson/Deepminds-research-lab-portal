import React, { useState } from 'react';
import { Search, Calendar, User, Tag, ArrowRight, Clock, Eye } from 'lucide-react';

const ArticlesLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Articles', count: 24 },
    { id: 'research', name: 'Research', count: 12 },
    { id: 'tutorials', name: 'Tutorials', count: 8 },
    { id: 'news', name: 'News', count: 4 }
  ];

  const articles = [
    {
      id: 1,
      title: "Deep Learning Fundamentals: A Comprehensive Guide",
      excerpt: "An in-depth exploration of neural networks, backpropagation, and modern deep learning architectures that form the foundation of current AI systems.",
      author: "Dr. Sarah Chen",
      date: "2024-01-15",
      category: "research",
      readTime: "12 min read",
      views: "1.2k",
      tags: ["Deep Learning", "Neural Networks", "AI"]
    },
    {
      id: 2,
      title: "Setting Up Your First Machine Learning Environment",
      excerpt: "Step-by-step tutorial on configuring Python, TensorFlow, and PyTorch for machine learning development on various operating systems.",
      author: "Michael Rodriguez",
      date: "2024-01-10",
      category: "tutorials",
      readTime: "8 min read",
      views: "2.1k",
      tags: ["Python", "TensorFlow", "Setup"]
    },
    {
      id: 3,
      title: "Recent Advances in Computer Vision: 2024 Update",
      excerpt: "A comprehensive review of the latest breakthroughs in computer vision, including transformer architectures and real-time object detection.",
      author: "Prof. James Wilson",
      date: "2024-01-08",
      category: "research",
      readTime: "15 min read",
      views: "956",
      tags: ["Computer Vision", "Transformers", "Object Detection"]
    },
    {
      id: 4,
      title: "Lab Receives Major Grant for AI Ethics Research",
      excerpt: "DMRLab has been awarded a significant grant to investigate ethical implications of artificial intelligence in healthcare applications.",
      author: "Lab Administration",
      date: "2024-01-05",
      category: "news",
      readTime: "3 min read",
      views: "3.2k",
      tags: ["Ethics", "Healthcare", "Grant"]
    },
    {
      id: 5,
      title: "Natural Language Processing with Transformers",
      excerpt: "Learn how to implement and fine-tune transformer models for various NLP tasks including sentiment analysis and text classification.",
      author: "Dr. Emily Park",
      date: "2024-01-03",
      category: "tutorials",
      readTime: "10 min read",
      views: "1.8k",
      tags: ["NLP", "Transformers", "Text Analysis"]
    },
    {
      id: 6,
      title: "Building Robust Machine Learning Pipelines",
      excerpt: "Best practices for creating maintainable and scalable ML pipelines that can handle real-world data and production requirements.",
      author: "Alex Thompson",
      date: "2023-12-28",
      category: "research",
      readTime: "11 min read",
      views: "1.4k",
      tags: ["MLOps", "Pipelines", "Production"]
    }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
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
            Articles
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#586069',
            margin: 0
          }}>
            Research papers, tutorials, and insights from our lab
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 20px'
      }}>
        {/* Search and Filter Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Search Bar */}
          <div style={{
            position: 'relative',
            maxWidth: '400px'
          }}>
            <Search 
              size={20} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#586069'
              }}
            />
            <input
              type="text"
              placeholder="Search articles..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #d1d5da',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0366d6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5da'}
            />
          </div>

          {/* Category Filter */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '1px solid #d1d5da',
                  backgroundColor: selectedCategory === category.id ? '#0366d6' : '#ffffff',
                  color: selectedCategory === category.id ? '#ffffff' : '#586069',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.id) {
                    e.target.style.backgroundColor = '#f6f8fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.id) {
                    e.target.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                {category.name}
                <span style={{
                  fontSize: '12px',
                  backgroundColor: selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : '#f1f3f4',
                  color: selectedCategory === category.id ? '#ffffff' : '#586069',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px'
        }}>
          {filteredArticles.map(article => (
            <article
              key={article.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e1e4e8',
                borderRadius: '8px',
                padding: '24px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#c8e1ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e1e4e8';
              }}
            >
              {/* Article Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                fontSize: '12px',
                color: '#586069'
              }}>
                <span style={{
                  backgroundColor: '#f1f3f4',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  textTransform: 'capitalize'
                }}>
                  {article.category}
                </span>
                <span>•</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Calendar size={12} />
                  {new Date(article.date).toLocaleDateString()}
                </div>
              </div>

              {/* Article Title */}
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#24292e',
                margin: '0 0 12px 0',
                lineHeight: '1.3'
              }}>
                {article.title}
              </h2>

              {/* Article Excerpt */}
              <p style={{
                fontSize: '14px',
                color: '#586069',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                {article.excerpt}
              </p>

              {/* Tags */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                marginBottom: '16px'
              }}>
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#f1f3f4',
                      color: '#586069',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Article Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: '#586069',
                paddingTop: '16px',
                borderTop: '1px solid #f1f3f4'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <User size={12} />
                  {article.author}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock size={12} />
                    {article.readTime}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Eye size={12} />
                    {article.views}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px'
        }}>
          <button style={{
            backgroundColor: '#f6f8fa',
            border: '1px solid #d1d5da',
            color: '#24292e',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e1e4e8';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f6f8fa';
          }}>
            Load More Articles
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticlesLayout;