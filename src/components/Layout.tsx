import React, { ReactNode } from 'react';
import Header from './Header'; // Assurez-vous que le chemin est correct
import Footer from './Footer'; // Assurez-vous que le chemin est correct

// Définition des types pour les props du Layout
interface LayoutProps {
  children: ReactNode;
}

/**
 * Composant Layout pour envelopper les pages publiques qui nécessitent
 * le Header et le Footer.
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="site-wrapper">
      <Header />
      
      {/* Le contenu spécifique à la route sera injecté ici */}
      <main className="site-content">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;