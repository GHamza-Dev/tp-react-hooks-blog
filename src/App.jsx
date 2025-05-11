import React, { useState, useCallback } from 'react';
import './App.css';
import PostList from './components/PostList';
import PostSearch from './components/PostSearch';

// TODO: Exercice 3 - Importer ThemeToggle
import ThemeToggle from './components/ThemeToggle';
// TODO: Exercice 3 - Importer ThemeProvider et useTheme
import { ThemeProvider, useTheme } from './context/ThemeContext';
// TODO: Exercice 1 - Importer le hook usePosts
import usePosts from './hooks/usePosts';
// TODO: Exercice 2 - Importer le hook useLocalStorage
import useLocalStorage from './hooks/useLocalStorage';
// Importer le composant PostDetails
import PostDetails from './components/PostDetails';

function AppContent() {
  const { theme } = useTheme();
  
  // État local pour la recherche
  const [searchTerm, setSearchTerm] = useState('');
  
  // TODO: Exercice 4 - Ajouter l'état pour le tag sélectionné
  const [selectedTag, setSelectedTag] = useState('');
  
  // Déclarer infiniteScrollEnabled avant usePosts
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useLocalStorage('infiniteScroll', true);
  
  // TODO: Exercice 1 - Utiliser le hook usePosts pour récupérer les posts
  const { 
    posts, 
    loading, 
    error, 
    hasMore, 
    loadMore, 
    uniqueTags, 
    selectedPost, 
    loadingPost, 
    fetchPostById, 
    setSelectedPost 
  } = usePosts({ 
    searchTerm, 
    tag: selectedTag, 
    limit: 10, 
    infinite: infiniteScrollEnabled 
  });
  
  // TODO: Exercice 3 - Utiliser useCallback pour les gestionnaires d'événements
  // Gestionnaire pour la recherche
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  
  // TODO: Exercice 4 - Ajouter le gestionnaire pour la sélection de tag
  const handleTagSelect = useCallback((tag) => {
    setSelectedTag(tag);
  }, []);
  
  // Gestionnaire pour le clic sur un post
  const handlePostClick = useCallback((post) => {
    fetchPostById(post.id);
  }, [fetchPostById]);
  
  // Gestionnaire pour fermer les détails d'un post
  const handleCloseDetails = useCallback(() => {
    setSelectedPost(null);
  }, [setSelectedPost]);
  
  // Gestionnaire pour le changement de mode de défilement
  const toggleScrollMode = useCallback(() => {
    setInfiniteScrollEnabled(prev => !prev);
  }, [setInfiniteScrollEnabled]);
  
  return (
    <div className={`container py-4 ${theme === 'dark' ? 'bg-dark text-light' : ''}`}>
      <header className="pb-3 mb-4 border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="display-5 fw-bold">Blog</h1>
          <div className="d-flex gap-2">

            {/* TODO: Exercice 3 - Ajouter le ThemeToggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main>
        <PostSearch 
          onSearch={handleSearchChange} 
          onTagSelect={handleTagSelect}
          availableTags={uniqueTags}
          selectedTag={selectedTag}
        />
        
        {/* TODO: Exercice 1 - Afficher un message d'erreur si nécessaire */}
        {error && (
          <div className={`alert ${theme === 'dark' ? 'alert-danger' : 'alert-danger'}`}>
            Erreur : {error}
          </div>
        )}
        
        {/* TODO: Exercice 4 - Ajouter le composant PostDetails */}
        {selectedPost && (
          <PostDetails
            post={selectedPost}
            loading={loadingPost}
            onClose={handleCloseDetails}
            onTagClick={handleTagSelect}
          />
        )}
        
        {/* TODO: Exercice 1 - Passer les props nécessaires à PostList */}
        <PostList 
          posts={posts}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onPostClick={handlePostClick}
          onTagClick={handleTagSelect}
          infiniteScroll={infiniteScrollEnabled}
        />
      </main>
      
      <footer className={`pt-3 mt-4 text-center border-top ${theme === 'dark' ? 'border-secondary' : ''}`}>
        <p>
          TP React Hooks - Blog &middot; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;