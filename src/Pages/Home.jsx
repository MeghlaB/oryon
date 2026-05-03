import React from 'react';
import Banner from '../Components/Banner/Banner';
import FeaturedCategory from '../Components/FeaturedCategory/FeaturedCategory';
import FeaturedProduct from '../Components/FeaturedProduct/FeaturedProduct';
import WhatsAppButton from '../Components/WhatsAppButton/WhatsAppButton';
import PolicyComponent from '../Components/Policies/Policies';

const Home = () => {
    return (
        <div>
            <div>
                <Banner></Banner>
            </div>
            <div>
                <FeaturedCategory></FeaturedCategory>
                <FeaturedProduct />
            </div>
            <div>
                <PolicyComponent></PolicyComponent>
            </div>
            <WhatsAppButton />
        </div>
    );
};

export default Home;