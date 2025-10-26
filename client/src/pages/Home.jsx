import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'

const Home = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <AiTools />
            <Testimonial />
            <Plan />
            <Footer />
            {/* Experience the power of Al with QuickAi.
Transform your content creation with our suite of premium Al tools. Write articles, generate images, and enhance your workflow. */}
        </div>
    )
}

export default Home