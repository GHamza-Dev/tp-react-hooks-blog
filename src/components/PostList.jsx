import React from 'react';
import { useTheme } from '../context/ThemeContext';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import LoadingSpinner from './LoadingSpinner';

function PostList({
  posts = [],
  loading = false,
  hasMore = false,
  onLoadMore,
  onPostClick,
  onTagClick,
  infiniteScroll = true
}) {
  const { theme } = useTheme();
 
  const [loaderRef, isVisible] = useIntersectionObserver({
    enabled: infiniteScroll && hasMore && !loading,
    threshold: 0.5,
    rootMargin: '100px'
  });

  React.useEffect(() => {
    if (isVisible && hasMore && !loading && infiniteScroll) {
      onLoadMore();
    }
  }, [isVisible, hasMore, loading, onLoadMore, infiniteScroll]);
 
  const handlePostClick = React.useCallback((post) => {
    if (onPostClick) {
      onPostClick(post);
    }
  }, [onPostClick]);
 
  const handleTagClick = React.useCallback((e, tag) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  }, [onTagClick]);

  const renderReactions = (reactions) => {
    if (!reactions) return null;
    
    if (typeof reactions === 'number') {
      return (
        <div className="reactions-total">
          <i className="bi bi-heart-fill"></i> {reactions}
        </div>
      );
    }
    
    return (
      <div className="reactions-split">
        <div className="reaction like">
          <i className="bi bi-hand-thumbs-up-fill"></i> {reactions.likes || 0}
        </div>
        <div className="reaction dislike">
          <i className="bi bi-hand-thumbs-down-fill"></i> {reactions.dislikes || 0}
        </div>
      </div>
    );
  };
 
  if (!loading && posts.length === 0) {
    return (
      <div className={`empty-state ${theme}`}>
        <i className="bi bi-file-earmark-text"></i>
        <p>Aucun article trouvé</p>
      </div>
    );
  }
 
  return (
    <div className={`post-list ${theme}`}>
      <div className="posts-container">
        {posts.map(post => (
          <article 
            key={post.id}
            className={`post-card ${theme}`}
            onClick={() => handlePostClick(post)}
          >
            <div className="post-content">
              <div className="post-header">
                <h3>{post.title}</h3>
                <div className="post-meta">
                  <span className="user-info">
                    <i className="bi bi-person-circle"></i> User #{post.userId}
                  </span>
                  {renderReactions(post.reactions)}
                </div>
              </div>
              <p className="post-excerpt">{post.body.substring(0, 120)}...</p>
              <div className="post-footer">
                <div className="tags">
                  {post.tags?.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="tag"
                      onClick={(e) => handleTagClick(e, tag)}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
     
      {loading && <LoadingSpinner />}
     
      {infiniteScroll && hasMore && 
        <div ref={loaderRef} className="load-more-indicator">
          {!loading && <span>Chargement en cours...</span>}
        </div>
      }
     
      {!infiniteScroll && hasMore && !loading && (
        <button className={`load-more-btn ${theme}`} onClick={onLoadMore}>
          <i className="bi bi-plus-circle"></i> Voir plus d'articles
        </button>
      )}
    </div>
  );
}

export default React.memo(PostList);