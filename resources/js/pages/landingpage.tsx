import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/components/landing page/Navbar';
import Hero from '@/components/landing page/Hero';
import Features from '@/components/landing page/features'; 
import CTA from '@/components/landing page/CTA';
import Footer from '@/components/landing page/footer';     

export default function LandingPage() {
    return (
        <div className="min-h-screen w-full bg-[#141414]">
            <Head title="Acevia - Personal Expense Tracker" />
            
            <Navbar />
            
            <main>
                <Hero />
                <Features />
                <CTA />
            </main>

            <Footer />
        </div>
    );
}