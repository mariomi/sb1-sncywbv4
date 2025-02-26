import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { Shield, Mail, Cookie, Database, Clock, Download } from 'lucide-react';

export function PrivacyPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-venetian-sandstone/20 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/95 dark:bg-venetian-brown/90 rounded-2xl shadow-xl p-8"
          >
            <h1 className="text-4xl font-serif text-venetian-brown dark:text-venetian-sandstone mb-8">
              Privacy Policy
            </h1>

            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-6 h-6 text-venetian-gold" />
                  <h2 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">
                    Overview
                  </h2>
                </div>
                <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70">
                  This Privacy Policy explains how Al Gobbo di Rialto ("we", "our", or "us") collects, uses, and protects 
                  your personal information when you use our website and services. We are committed to ensuring that your 
                  privacy is protected in accordance with the General Data Protection Regulation (GDPR).
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-6 h-6 text-venetian-gold" />
                  <h2 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">
                    Information We Collect
                  </h2>
                </div>
                <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-venetian-brown/70 dark:text-venetian-sandstone/70">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Reservation details (date, time, number of guests, special requests)</li>
                  <li>Communication preferences</li>
                  <li>Feedback and correspondence</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Cookie className="w-6 h-6 text-venetian-gold" />
                  <h2 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">
                    Use of Cookies
                  </h2>
                </div>
                <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 mb-4">
                  Our website uses cookies to enhance your experience and analyze website traffic. Cookies are small text 
                  files stored on your device. We use:
                </p>
                <ul className="list-disc list-inside space-y-2 text-venetian-brown/70 dark:text-venetian-sandstone/70">
                  <li>Essential cookies for website functionality</li>
                  <li>Analytics cookies to understand user behavior</li>
                  <li>Preference cookies to remember your settings</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-6 h-6 text-venetian-gold" />
                  <h2 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">
                    Data Retention
                  </h2>
                </div>
                <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                  Privacy Policy, unless a longer retention period is required by law. Reservation data is kept for 24 
                  months from the date of your last visit.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Download className="w-6 h-6 text-venetian-gold" />
                  <h2 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">
                    Your Rights
                  </h2>
                </div>
                <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70 mb-4">
                  Under GDPR, you have the following rights:
                </p>
                <ul className="list-disc list-inside space-y-2 text-venetian-brown/70 dark:text-venetian-sandstone/70">
                  <li>Right to access your personal data</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to erasure ("right to be forgotten")</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-6 h-6 text-venetian-gold" />
                  <h2 className="text-2xl font-serif text-venetian-brown dark:text-venetian-sandstone">
                    Contact Us
                  </h2>
                </div>
                <p className="text-venetian-brown/70 dark:text-venetian-sandstone/70">
                  For any privacy-related questions or to exercise your rights, please contact our Data Protection Officer at{' '}
                  <a href="mailto:privacy@ristorantealgobbodirialto.com" className="text-venetian-gold hover:underline">
                    privacy@ristorantealgobbodirialto.com
                  </a>
                </p>
              </section>

              <div className="text-sm text-venetian-brown/60 dark:text-venetian-sandstone/60 pt-8 border-t border-venetian-brown/10 dark:border-venetian-sandstone/10">
                Last updated: March 1, 2025
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}