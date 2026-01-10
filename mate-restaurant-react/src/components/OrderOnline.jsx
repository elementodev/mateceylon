import AnimatedSection from './AnimatedSection';
import './OrderOnline.css';

const OrderOnline = () => {
    return (
        <section className="order-online">
            <div className="container">
                <AnimatedSection animationType="fade-up">
                    <h2>Enjoy Mate at Home</h2>
                    <p>Order now through our delivery partners</p>
                    <div className="order-buttons">
                        <a href="#" className="btn-outline">
                            <img src="/ubereats.png" alt="Uber Eats" className="delivery-logo" />
                            <span>Uber Eats</span>
                        </a>
                        <a href="#" className="btn-outline">
                            <img src="/pickmefood.png" alt="PickMe Food" className="delivery-logo" />
                            <span>PickMe Food</span>
                        </a>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}

export default OrderOnline;
