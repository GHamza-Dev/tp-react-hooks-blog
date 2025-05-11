import React from 'react';
// TODO: Exercice 3 - Importer useTheme
import { useTheme } from '../context/ThemeContext';

/**
 * Composant d'affichage détaillé d'un post
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.post - Le post à afficher
 * @param {Function} props.onClose - Fonction pour fermer les détails
 * @param {Function} props.onTagClick - Fonction appelée lors du clic sur un tag
 */
function PostDetails({ post, onClose, onTagClick, loading }) {
  // TODO: Exercice 3 - Utiliser le hook useTheme
  const { theme } = useTheme();

  // TODO: Exercice 3 - Utiliser useMemo pour calculer les classes CSS
  const themeClasses = React.useMemo(() => ({
    card: theme === 'dark' ? 'bg-dark text-light' : '',
    badge: theme === 'dark' ? 'bg-secondary' : 'bg-light text-dark',
    button: theme === 'dark' ? 'btn-outline-light' : 'btn-outline-dark'
  }), [theme]);

  if (loading) {
    return (
      <div className={`card ${themeClasses.card}`}>
        <div className="card-body text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  // Conversion sécurisée des réactions en nombre
  const getReactionsCount = () => {
    if (!post.reactions) return 0;
    if (typeof post.reactions === 'number') return post.reactions;
    return (post.reactions.likes || 0) + (post.reactions.dislikes || 0);
  };

  // Formater l'affichage des réactions détaillées si disponible
  const getReactionsDisplay = () => {
    if (!post.reactions) return "0 réactions";
    if (typeof post.reactions === 'number') return `${post.reactions} réaction${post.reactions !== 1 ? 's' : ''}`;
    return `👍 ${post.reactions.likes || 0} | 👎 ${post.reactions.dislikes || 0}`;
  };

  return (
    <div className={`card mb-4 ${themeClasses.card}`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">{post.title}</h5>
        <button 
          className={`btn btn-sm ${themeClasses.button}`}
          onClick={onClose}
          aria-label="Fermer"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="card-body">
        {/* TODO: Exercice 4 - Afficher le contenu du post */}
        <p className="card-text mb-4">{post.body}</p>

        {/* TODO: Exercice 4 - Afficher les réactions et l'utilisateur */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="text-muted small">
            <span className="me-3">
              <i className="bi bi-person"></i> Utilisateur #{post.userId}
            </span>
            <span>
              <i className="bi bi-heart"></i> {getReactionsDisplay()}
            </span>
          </div>
        </div>

        {/* TODO: Exercice 4 - Afficher les tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="tags mt-3">
            <p className="mb-1 text-muted small">Tags:</p>
            <div>
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className={`badge ${themeClasses.badge} me-1 mb-1`}
                  onClick={() => onTagClick(tag)}
                  style={{ cursor: 'pointer' }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// TODO: Exercice 3 - Utiliser React.memo pour optimiser les rendus
export default React.memo(PostDetails);