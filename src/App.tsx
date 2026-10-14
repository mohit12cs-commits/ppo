import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InternshipTracks } from './components/InternshipTracks';
import { WhyChooseUs } from './components/WhyChooseUs';
import { HiringPartners } from './components/HiringPartners';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { ApplyModal } from './components/ApplyModal';
import { CertificateVerifier } from './components/CertificateVerifier';
import { InternshipTrack } from './types';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<InternshipTrack | null>(null);

  const handleOpenApply = (track?: InternshipTrack) => {
    setSelectedTrack(track || null);
    setApplyModalOpen(true);
  };

  const handleSelectTrack = (track: InternshipTrack) => {
    setSelectedTrack(track);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        onOpenApply={() => handleOpenApply()}
        onOpenVerify={() => setVerifyModalOpen(true)}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        <Hero
          onSearch={(query) => setSearchQuery(query)}
          onOpenApply={() => handleOpenApply()}
          onOpenVerify={() => setVerifyModalOpen(true)}
        />

        <InternshipTracks
          searchQuery={searchQuery}
          onSelectTrack={handleSelectTrack}
        />

        <WhyChooseUs />

        <HiringPartners />

        <Testimonials />

        <FAQ />
      </main>

      {/* Footer */}
      <Footer
        onOpenApply={() => handleOpenApply()}
        onOpenVerify={() => setVerifyModalOpen(true)}
      />

      {/* Modals */}
      <ApplyModal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        initialTrack={selectedTrack}
      />

      <CertificateVerifier
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />
    </div>
  );
}

export default App;
