import PageHero from '../components/PageHero';
import AnimatedSection from '../components/AnimatedSection';
import './Menu.css';
import { useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';

function Menu() {
    const [activeCategory, setActiveCategory] = useState('all');
    const { data: menuItems, loading } = useFirestore('menu_items');

    const categories = [
        { id: 'all', name: 'All Items' },
        { id: 'appetizers', name: 'Appetizers' },
        { id: 'mains', name: 'Main Courses' },
        { id: 'bbq', name: 'BBQ Specialties' },
        { id: 'desserts', name: 'Desserts' },
        { id: 'beverages', name: 'Beverages' },
    ];

    const getFilteredItems = () => {
        if (loading) return [];
        if (activeCategory === 'all') {
            return menuItems;
        }
        return menuItems.filter(item => item.category === activeCategory);
    };

    return (
        <div className="menu-page">
            <PageHero
                title="Our Menu"
                subtitle="Authentic Australian Cuisine"
                backgroundImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600"
            />

            <section className="menu-content">
                <AnimatedSection animation="fade-in">
                    <div className="menu-categories">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category.id)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up">
                    <div className="menu-items-grid">
                        {getFilteredItems().map((item, index) => (
                            <div key={index} className="menu-item-card">
                                <img
                                    src={item.imageUrl || "https://images.unsplash.com/photo-1544025162-d76690b60944?w=600&q=80"}
                                    alt={item.name}
                                    className="menu-item-image"
                                    loading="lazy"
                                />
                                <div className="menu-item-header">
                                    <h3>{item.name}</h3>
                                    <span className="price">{item.price}</span>
                                </div>
                                <p className="description">{item.description}</p>
                                <div className="menu-item-badges">
                                    {item.vegetarian && <span className="badge vegetarian">Vegetarian</span>}
                                    {item.special && <span className="badge special">Chef's Special</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={200}>
                    <div className="menu-note">
                        <p>All prices are in Sri Lankan Rupees and inclusive of service charge and taxes.</p>
                        <p>Please inform our staff of any allergies or dietary requirements.</p>
                    </div>
                </AnimatedSection>
            </section>
        </div>
    );
}

export default Menu;
