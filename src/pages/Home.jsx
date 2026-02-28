import React from 'react';
import Hero from '../components/Hero';
import PracticeAreas from '../components/PracticeAreas';
import HowItWorks from '../components/HowItWorks';
import FeaturedLawyers from '../components/FeaturedLawyers';
import QASection from '../components/QASection';
import LegalGuides from '../components/LegalGuides';
import ReviewsSection from '../components/ReviewsSection';

const Home = () => {
    return (
        <main>
            <Hero />
            <PracticeAreas />
            <HowItWorks />
            <FeaturedLawyers />
            <QASection />
            <LegalGuides />
            <ReviewsSection />
        </main>
    );
};

export default Home;
