import React from 'react';
import { Hero } from '../components/Hero';
import { Gallery } from '../components/Gallery';
import { PageTransition } from '../components/PageTransition';

export function Home() {
  return (
    <PageTransition>
      <Hero />
      <Gallery />
    </PageTransition>
  );
}