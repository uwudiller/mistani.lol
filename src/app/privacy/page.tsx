import { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Eye, Lock, Database } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - mistani.lol',
  description: 'Privacy policy for mistani.lol anime streaming platform',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-amber-500 hover:text-amber-400 transition-colors mb-4 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 prose prose-invert max-w-none">
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-amber-500" />
              Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed">
              mistani.lol ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our anime 
              streaming platform and services.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              By using mistani.lol, you acknowledge that you have read, understood, and agree to the collection 
              and use of your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-amber-500" />
              Information We Collect
            </h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Account Information</h3>
            <p className="text-gray-300 leading-relaxed">
              When you create an account, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Email address (for account creation and authentication)</li>
              <li>Hashed password (encrypted, not stored in plain text)</li>
              <li>Account creation date and last login timestamps</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Usage Data</h3>
            <p className="text-gray-300 leading-relaxed">
              We automatically collect information about your interaction with our service:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Anime viewing history and watch progress</li>
              <li>Search queries and browsing behavior</li>
              <li>IP address and general location (country/city level)</li>
              <li>Device information and browser type</li>
              <li>Session duration and frequency of use</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Technical Data</h3>
            <p className="text-gray-300 leading-relaxed">
              For service optimization and security:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Cookies and similar tracking technologies</li>
              <li>Error logs and crash reports</li>
              <li>Performance metrics and loading times</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-amber-500" />
              How We Use Your Information
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded p-4">
                <h3 className="font-semibold text-amber-400 mb-2">Service Provision</h3>
                <p className="text-gray-300">
                  To provide and maintain our anime streaming service, including personalized recommendations 
                  and watch history tracking.
                </p>
              </div>
              <div className="bg-gray-700 rounded p-4">
                <h3 className="font-semibold text-amber-400 mb-2">Account Management</h3>
                <p className="text-gray-300">
                  To authenticate users, manage accounts, and provide customer support.
                </p>
              </div>
              <div className="bg-gray-700 rounded p-4">
                <h3 className="font-semibold text-amber-400 mb-2">Service Improvement</h3>
                <p className="text-gray-300">
                  To analyze usage patterns, improve features, and optimize performance.
                </p>
              </div>
              <div className="bg-gray-700 rounded p-4">
                <h3 className="font-semibold text-amber-400 mb-2">Security</h3>
                <p className="text-gray-300">
                  To detect and prevent fraud, abuse, and security threats.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-amber-500" />
              Data Security and Protection
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>SSL/TLS encryption for all data transmissions</li>
              <li>Bcrypt password hashing for authentication</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication for our systems</li>
              <li>Data backups in secure, encrypted storage</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect 
              your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Data Sharing and Third Parties</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We only share data in 
              these limited circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li><strong>Service Providers:</strong> Trusted third-party services for hosting, analytics, and support</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              <li><strong>Safety:</strong> To protect our rights, property, or safety, or that of our users</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
            <p className="text-gray-300 leading-relaxed">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
              <li><strong>Opt-out:</strong> Disable certain data collection features</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@mistani.lol. We'll respond within 30 days.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your information only as long as necessary to provide our services and comply with 
              legal obligations. Account deletion removes most data immediately, but some information may be 
              retained for:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Legal compliance and regulatory requirements</li>
              <li>Fraud prevention and security purposes</li>
              <li>Resolving disputes and enforcing our agreements</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              mistani.lol is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If we become aware that we have collected information 
              from a child under 13, we will take steps to delete such information immediately.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
            <p className="text-gray-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure 
              appropriate safeguards are in place for international data transfers in accordance with applicable 
              data protection laws.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Posting the updated policy on our website</li>
              <li>Sending email notifications for significant changes</li>
              <li>Displaying prominent notices within our service</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
            </p>
            <div className="bg-gray-700 rounded p-4 mt-4">
              <p className="text-gray-300">
                <strong>Email:</strong> privacy@mistani.lol<br />
                <strong>Website:</strong> https://mistani.lol<br />
                <strong>Response Time:</strong> Within 30 days
              </p>
            </div>
          </section>

          <div className="bg-amber-500/20 border border-amber-500 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-amber-400 mb-3">Important Disclaimer</h2>
            <p className="text-gray-300 leading-relaxed">
              mistani.lol is an aggregator service that provides links to anime content from third-party sources. 
              We do not host, upload, or store any video content on our servers. All anime content is the property 
              of their respective owners and is used under fair use principles for discovery and recommendation purposes.
            </p>
            <p className="text-gray-300 leading-relaxed mt-3">
              Users are responsible for ensuring they have the legal right to access any content through our service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
