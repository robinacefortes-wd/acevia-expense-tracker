import { Head } from '@inertiajs/react';
import React from 'react';
import CTA from '@/components/landing page/CTA';
import Features from '@/components/landing page/features'; 
import Footer from '@/components/landing page/footer';     
import Hero from '@/components/landing page/Hero';
import Navbar from '@/components/landing page/Navbar';

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