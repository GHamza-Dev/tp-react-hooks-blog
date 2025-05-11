import { useState, useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour détecter quand un élément devient visible dans le viewport
 * @param {Object} options - Options pour l'IntersectionObserver
 * @param {boolean} options.enabled - Est-ce que l'observer est actif
 * @param {number} options.threshold - Seuil de visibilité de l'élément (0 à 1)
 * @param {string} options.rootMargin - Marge autour de la racine
 * @returns {[React.RefObject, boolean]} Référence à attacher à l'élément et état d'intersection
 */
function useIntersectionObserver({
  enabled = true,
  threshold = 0.1,
  rootMargin = '0px'
} = {}) {
  // TODO: Exercice 4 - Implémenter le hook useIntersectionObserver
  // 1. Créer un état pour suivre l'intersection
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  // 2. Créer une référence pour l'élément à observer
  const elementRef = useRef(null);
  
  // 3. Configurer l'IntersectionObserver dans un useEffect
  useEffect(() => {
    // Ne pas observer si le hook est désactivé
    if (!enabled) {
      setIsIntersecting(false);
      return;
    }
    
    const element = elementRef.current;
    if (!element) return;
    
    // Créer l'observer avec les options
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Mettre à jour l'état d'intersection
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin
      }
    );
    
    // Commencer à observer l'élément
    observer.observe(element);
    
    // Nettoyer l'observer lors du démontage
    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [enabled, threshold, rootMargin, elementRef.current]); // La dépendance à elementRef.current est intentionnelle
  
  // 4. Retourner la référence et l'état d'intersection
  return [elementRef, isIntersecting];
}

export default useIntersectionObserver;