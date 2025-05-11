import { useState, useEffect, useCallback, useMemo } from 'react';
// TODO: Exercice 2 - Importer useDebounce
import useDebounce from './useDebounce';

/**
 * Hook personnalisé pour gérer les posts du blog
 * @param {Object} options - Options de configuration
 * @param {string} options.searchTerm - Terme de recherche
 * @param {string} options.tag - Tag à filtrer
 * @param {number} options.limit - Nombre d'éléments par page
 * @param {boolean} options.infinite - Mode de chargement infini vs pagination
 * @returns {Object} État et fonctions pour gérer les posts
 */
function usePosts({ searchTerm = '', tag = '', limit = 10, infinite = true } = {}) {
  // État local pour les posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // TODO: Exercice 1 - Ajouter les états nécessaires pour la pagination
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // TODO: Exercice 4 - Ajouter l'état pour le post sélectionné
  const [selectedPost, setSelectedPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  
  // TODO: Exercice 2 - Utiliser useDebounce pour le terme de recherche
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  // TODO: Exercice 3 - Utiliser useCallback pour construire l'URL de l'API
  const buildApiUrl = useCallback((skip = 0) => {
    // Construire l'URL en fonction des filtres
    let url = `https://dummyjson.com/posts`;
    
    // Ajouter les paramètres de pagination
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('skip', skip.toString());
    
    // Ajouter la recherche si présente
    if (debouncedSearchTerm) {
      url = `https://dummyjson.com/posts/search`;
      params.append('q', debouncedSearchTerm);
    }
    
    // Retourner l'URL complète
    return `${url}?${params.toString()}`;
  }, [debouncedSearchTerm, limit]);
  
  // TODO: Exercice 1 - Implémenter la fonction pour charger les posts
  const fetchPosts = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      
      // Réinitialiser le skip si c'est un nouveau chargement
      const currentSkip = reset ? 0 : skip;
      if (reset) {
        setSkip(0);
        setPosts([]);
      }
      
      // Appeler l'API et mettre à jour les états
      const response = await fetch(buildApiUrl(currentSkip));
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filtrer par tag si nécessaire
      let filteredPosts = data.posts;
      if (tag) {
        filteredPosts = filteredPosts.filter(post => 
          post.tags && post.tags.includes(tag)
        );
      }
      
      // Mettre à jour les posts
      setPosts(prev => reset ? filteredPosts : [...prev, ...filteredPosts]);
      setTotal(data.total);
      
      // Vérifier s'il y a plus de posts à charger
      const loadedCount = reset ? filteredPosts.length : skip + filteredPosts.length;
      setHasMore(loadedCount < data.total);
      
      // Mettre à jour le skip pour la prochaine page
      if (!reset) {
        setSkip(currentSkip + limit);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [skip, limit, buildApiUrl, tag]);
  
  // TODO: Exercice 1 - Utiliser useEffect pour charger les posts quand les filtres changent
  useEffect(() => {
    // Réinitialiser et charger les posts quand la recherche ou le tag change
    fetchPosts(true);
  }, [debouncedSearchTerm, tag]);
  
  // TODO: Exercice 4 - Implémenter la fonction pour charger plus de posts
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(false);
    }
  }, [loading, hasMore, fetchPosts]);
  
  // TODO: Exercice 3 - Utiliser useMemo pour calculer les tags uniques
  const uniqueTags = useMemo(() => {
    // Extraire tous les tags de tous les posts
    const allTags = posts.flatMap(post => post.tags || []);
    
    // Filtrer pour n'avoir que des tags uniques
    return [...new Set(allTags)].sort();
  }, [posts]);
  
  // TODO: Exercice 4 - Implémenter la fonction pour charger un post par son ID
  const fetchPostById = useCallback(async (postId) => {
    if (!postId) return;
    
    try {
      setLoadingPost(true);
      
      // Vérifier si le post est déjà chargé
      const cachedPost = posts.find(p => p.id === postId);
      if (cachedPost) {
        setSelectedPost(cachedPost);
        setLoadingPost(false);
        return cachedPost;
      }
      
      // Sinon, charger depuis l'API
      const response = await fetch(`https://dummyjson.com/posts/${postId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const post = await response.json();
      setSelectedPost(post);
      return post;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoadingPost(false);
    }
  }, [posts]);
  
  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    total,
    uniqueTags,
    selectedPost,
    loadingPost,
    fetchPostById,
    setSelectedPost
  };
}

export default usePosts;