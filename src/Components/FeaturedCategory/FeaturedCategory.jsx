import React, { useEffect, useState } from 'react';
import SingleFeaturedCategory from './SingleFeaturedCategory';

const FeaturedCategory = () => {
    const [categories, setCategories] = useState([]); 

    useEffect(() => {
        fetch('FeaturedCategory.json') 
            .then(res => res.json())
            .then(data => {
        
                setCategories(data);
            });
    }, []);

    return (
        <div className='relative w-10/12 mx-auto my-10 top-16 md:top-24'>
            <h1 className='text-lg text-center md:text-2xl font-bold'>Featured Category</h1>
            <p className='text-center text-gray-600 text'>
                Get Your Desired Product from Featured Category!
            </p>
            <div className='flex flex-wrap justify-center gap-2 mx-auto my-4 md:gap-4'>
                {
                    categories.map((category, idx) => (
                        <SingleFeaturedCategory category={category} key={idx} />
                    ))
                }
            </div>
        </div>
    );
};

export default FeaturedCategory;
