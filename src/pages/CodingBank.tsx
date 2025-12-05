import { useState } from 'react';
import { CockpitButton, CockpitPanel, CockpitPanelBody, CockpitContainer } from '../design-system';
import './CodingBank.css';

interface CodeCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: CodeItem[];
}

interface CodeItem {
  name: string;
  description: string;
  language?: string;
  difficulty?: string;
}

const categories: CodeCategory[] = [
  {
    id: 'snippets',
    title: 'Code Snippets',
    icon: '📝',
    description: 'Ready-to-use code snippets for common problems',
    items: [
      {
        name: 'Algorithms',
        description: 'Sorting, searching, and graph algorithms',
        language: 'Python',
        difficulty: 'Medium'
      },
      {
        name: 'String Utils',
        description: 'String manipulation and validation utilities',
        language: 'Python',
        difficulty: 'Easy'
      },
      {
        name: 'Array Utils',
        description: 'Array operations and transformations',
        language: 'Python',
        difficulty: 'Easy'
      }
    ]
  },
  {
    id: 'components',
    title: 'Components',
    icon: '🧩',
    description: 'Reusable UI components and modules',
    items: [
      {
        name: 'React Components',
        description: 'Modern React components with TypeScript',
        language: 'TypeScript',
        difficulty: 'Medium'
      },
      {
        name: 'Custom Hooks',
        description: 'Reusable React hooks for common patterns',
        language: 'TypeScript',
        difficulty: 'Medium'
      },
      {
        name: 'Form Components',
        description: 'Form handling with validation',
        language: 'TypeScript',
        difficulty: 'Medium'
      }
    ]
  },
  {
    id: 'templates',
    title: 'Templates',
    icon: '📋',
    description: 'Project templates and boilerplate code',
    items: [
      {
        name: 'React Component Template',
        description: 'Complete React component with best practices',
        language: 'TypeScript',
        difficulty: 'Easy'
      },
      {
        name: 'Context Template',
        description: 'React Context API setup',
        language: 'TypeScript',
        difficulty: 'Medium'
      }
    ]
  },
  {
    id: 'tutorials',
    title: 'Tutorials',
    icon: '📚',
    description: 'Step-by-step learning guides',
    items: [
      {
        name: 'Python Basics',
        description: 'Getting started with Python programming',
        difficulty: 'Beginner'
      },
      {
        name: 'DSA Guide',
        description: 'Data Structures and Algorithms fundamentals',
        difficulty: 'Intermediate'
      },
      {
        name: 'Web Development',
        description: 'Frontend and backend development guide',
        difficulty: 'Intermediate'
      }
    ]
  }
];

export const CodingBank = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.items.some(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="coding-bank-page">
      {/* Hero Section */}
      <div className="coding-bank-hero">
        <CockpitContainer size="lg">
          <div className="coding-bank-hero__content">
            <h1 className="coding-bank-hero__title">
              <span className="coding-bank-hero__icon">💾</span>
              CODING BANK
              <span className="coding-bank-hero__icon">⚡</span>
            </h1>
            <p className="coding-bank-hero__subtitle">
              CODE LIBRARY • SNIPPETS • TUTORIALS • TEMPLATES
            </p>
          </div>
        </CockpitContainer>
      </div>

      <CockpitContainer size="xl">
        {/* Search Bar */}
        <div className="coding-bank-search">
          <input
            type="text"
            className="coding-bank-search__input"
            placeholder="SEARCH CODE LIBRARY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category View */}
        {!selectedCategory ? (
          <div className="coding-bank-categories">
            {filteredCategories.map((category) => (
              <CockpitPanel
                key={category.id}
                variant="outlined"
                className="coding-bank-category"
              >
                <CockpitPanelBody>
                  <div className="category-header">
                    <span className="category-icon">{category.icon}</span>
                    <h2 className="category-title">{category.title}</h2>
                  </div>
                  <p className="category-description">{category.description}</p>
                  <div className="category-stats">
                    <span className="category-stat">
                      📦 {category.items.length} Items
                    </span>
                  </div>
                  <div className="category-actions">
                    <CockpitButton
                      variant="primary"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      EXPLORE {category.icon}
                    </CockpitButton>
                  </div>
                </CockpitPanelBody>
              </CockpitPanel>
            ))}
          </div>
        ) : (
          /* Detail View */
          <div className="coding-bank-detail">
            <div className="coding-bank-detail__header">
              <CockpitButton onClick={() => setSelectedCategory(null)}>
                ← BACK TO CATEGORIES
              </CockpitButton>
            </div>

            {selectedCategoryData && (
              <>
                <CockpitPanel variant="elevated" glow className="detail-hero">
                  <CockpitPanelBody>
                    <div className="detail-hero__content">
                      <span className="detail-hero__icon">
                        {selectedCategoryData.icon}
                      </span>
                      <h2 className="detail-hero__title">
                        {selectedCategoryData.title}
                      </h2>
                      <p className="detail-hero__description">
                        {selectedCategoryData.description}
                      </p>
                    </div>
                  </CockpitPanelBody>
                </CockpitPanel>

                <div className="detail-items">
                  {selectedCategoryData.items.map((item, index) => (
                    <CockpitPanel
                      key={index}
                      variant="outlined"
                      className="detail-item"
                    >
                      <CockpitPanelBody>
                        <h3 className="detail-item__name">{item.name}</h3>
                        <p className="detail-item__description">
                          {item.description}
                        </p>
                        <div className="detail-item__meta">
                          {item.language && (
                            <span className="detail-item__badge detail-item__badge--language">
                              💻 {item.language}
                            </span>
                          )}
                          {item.difficulty && (
                            <span className="detail-item__badge detail-item__badge--difficulty">
                              🎯 {item.difficulty}
                            </span>
                          )}
                        </div>
                        <div className="detail-item__actions">
                          <CockpitButton size="small">
                            VIEW CODE
                          </CockpitButton>
                        </div>
                      </CockpitPanelBody>
                    </CockpitPanel>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Info Section */}
        <CockpitPanel variant="outlined" className="coding-bank-info">
          <CockpitPanelBody>
            <h3 className="info-title">📖 ABOUT CODING BANK</h3>
            <p className="info-description">
              The Coding Bank is your personal code library. Browse through
              curated collections of algorithms, components, templates, and
              tutorials. All code is documented with examples and best practices.
            </p>
            <div className="info-features">
              <div className="info-feature">
                <span className="info-feature__icon">⚡</span>
                <span className="info-feature__text">PRODUCTION READY</span>
              </div>
              <div className="info-feature">
                <span className="info-feature__icon">📚</span>
                <span className="info-feature__text">WELL DOCUMENTED</span>
              </div>
              <div className="info-feature">
                <span className="info-feature__icon">🎯</span>
                <span className="info-feature__text">BEST PRACTICES</span>
              </div>
            </div>
          </CockpitPanelBody>
        </CockpitPanel>
      </CockpitContainer>
    </div>
  );
};
