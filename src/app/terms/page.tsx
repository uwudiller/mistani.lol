import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, AlertTriangle, Shield, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - mistani.lol',
  description: 'Terms of service for mistani.lol anime streaming platform',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-amber-500 hover:text-amber-400 transition-colors mb-4 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-400 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Legal Notice */}
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-red-400 mb-3 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            IMPORTANT LEGAL NOTICE
          </h2>
          <p className="text-gray-300 leading-relaxed">
            By accessing or using mistani.lol ("the Service"), you acknowledge that you have read, understood, 
            and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, 
            you must not access or use our Service.
          </p>
          <p className="text-gray-300 leading-relaxed mt-3">
            These Terms constitute a legally binding agreement between you and mistani.lol. Violation of these 
            Terms may result in immediate termination of your account and potential legal action.
          </p>
        </div>

        <div className="space-y-8 prose prose-invert max-w-none">
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-amber-500" />
              Acceptance of Terms
            </h2>
            <p className="text-gray-300 leading-relaxed">
              By creating an account, accessing, or using mistani.lol, you:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Confirm that you are at least 13 years of age or the minimum age in your jurisdiction</li>
              <li>Have the legal capacity to enter into these Terms</li>
              <li>Agree to comply with all applicable laws and regulations</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              If you are using the Service on behalf of an organization, you represent that you have the 
              authority to bind that organization to these Terms.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
            <p className="text-gray-300 leading-relaxed">
              mistani.lol is an anime discovery and streaming aggregation platform that:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Provides information about anime series and movies</li>
              <li>Aggregates links to anime content from third-party sources</li>
              <li>Offers user account management and watch history tracking</li>
              <li>Provides search and recommendation features</li>
            </ul>
            <div className="bg-amber-500/20 border border-amber-500 rounded p-4 mt-4">
              <h3 className="font-semibold text-amber-400 mb-2">CRITICAL DISCLAIMER</h3>
              <p className="text-gray-300">
                mistani.lol does NOT host, upload, store, or distribute any video content. We are an 
                information service that aggregates links to content hosted by third parties. All content 
                is the property of their respective copyright owners.
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-amber-500" />
              User Responsibilities and Prohibited Activities
            </h2>
            <p className="text-gray-300 leading-relaxed">
              As a user of mistani.lol, you agree to:
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Permitted Activities</h3>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Use the Service for personal, non-commercial purposes only</li>
              <li>Provide accurate information when creating your account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Report violations of these Terms to our support team</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3 text-red-400">STRICTLY PROHIBITED ACTIVITIES</h3>
            <div className="bg-red-500/20 border border-red-500 rounded p-4">
              <p className="text-gray-300 mb-3">You are strictly prohibited from:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Accessing or distributing copyrighted content without proper authorization</li>
                <li>Using automated tools, bots, or scrapers to access our Service</li>
                <li>Attempting to reverse engineer, decompile, or hack our systems</li>
                <li>Interfering with or disrupting the Service or servers</li>
                <li>Impersonating any person or entity or misrepresenting your affiliation</li>
                <li>Using the Service for any illegal or unauthorized purpose</li>
                <li>Violating any applicable laws or regulations</li>
                <li>Sharing your account credentials with others</li>
                <li>Attempting to circumvent any security measures</li>
              </ul>
            </div>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property and Content</h2>
            <p className="text-gray-300 leading-relaxed">
              Our intellectual property policy is designed to protect all parties:
            </p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Our Content</h3>
            <p className="text-gray-300 leading-relaxed">
              All content created by mistani.lol, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Website design, layout, and user interface</li>
              <li>Original text, graphics, and artwork</li>
              <li>Algorithms, software, and code</li>
              <li>Trademarks, logos, and brand elements</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-3">
              Is owned by mistani.lol and protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">Third-Party Content</h3>
            <p className="text-gray-300 leading-relaxed">
              Anime information and video content linked from our Service:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Is the property of their respective copyright owners</li>
              <li>Is used under fair use principles for informational purposes</li>
              <li>May be removed at the request of copyright holders</li>
              <li>Is not hosted, stored, or distributed by mistani.lol</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">DMCA Policy</h3>
            <p className="text-gray-300 leading-relaxed">
              We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). 
              If you believe your copyrighted work is being infringed through our Service, please contact us at:
            </p>
            <div className="bg-gray-700 rounded p-4 mt-3">
              <p className="text-gray-300">
                <strong>DMCA Agent:</strong> legal@mistani.lol<br />
                <strong>Subject Line:</strong> DMCA Takedown Notice<br />
                <strong>Required Information:</strong> Detailed description of allegedly infringing content
              </p>
            </div>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">User Accounts and Security</h2>
            <p className="text-gray-300 leading-relaxed">
              Account security is your responsibility:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>You must provide accurate, complete, and current information</li>
              <li>You are responsible for maintaining the confidentiality of your password</li>
              <li>You must notify us immediately of any unauthorized use</li>
              <li>You are responsible for all activities under your account</li>
              <li>We reserve the right to suspend or terminate accounts for violations</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              We are not liable for any loss or damage arising from unauthorized access to your account.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-amber-500" />
              User Content and Conduct
            </h2>
            <p className="text-gray-300 leading-relaxed">
              While using our Service, you agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Submit content that is illegal, harmful, threatening, or abusive</li>
              <li>Upload or transmit viruses, malware, or malicious code</li>
              <li>Violate the rights of others, including privacy and publicity rights</li>
              <li>Engage in spam, harassment, or abusive behavior</li>
              <li>Post false or misleading information</li>
              <li>Interfere with other users' enjoyment of the Service</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              We reserve the right to remove any content that violates these terms and to terminate 
              accounts of users who repeatedly violate our community standards.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Disclaimers and Limitations of Liability</h2>
            <div className="bg-red-500/20 border border-red-500 rounded p-4 mb-4">
              <h3 className="font-semibold text-red-400 mb-2">IMPORTANT LIABILITY LIMITATIONS</h3>
              <p className="text-gray-300">
                Your use of mistani.lol is at your sole risk. The Service is provided "AS IS" and "AS AVAILABLE" 
                without warranties of any kind, either express or implied.
              </p>
            </div>
            
            <h3 className="text-xl font-medium mt-6 mb-3">No Warranties</h3>
            <p className="text-gray-300 leading-relaxed">
              We disclaim all warranties, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Accuracy, reliability, or availability of the Service</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement of intellectual property rights</li>
              <li>Security or data protection</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Limitation of Liability</h3>
            <p className="text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, mistani.lol shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages arising from content accessed through third-party links</li>
              <li>Damages exceeding the amount you paid for the Service (if any)</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p className="text-gray-300 leading-relaxed">
              You agree to indemnify, defend, and hold harmless mistani.lol and its affiliates, officers, 
              directors, employees, and agents from and against any and all claims, liabilities, damages, 
              losses, and expenses, including reasonable attorneys' fees, arising from or in any way related 
              to:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another</li>
              <li>Your violation of applicable laws or regulations</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-gray-300 leading-relaxed">
              We may terminate or suspend your account and bar access to the Service immediately, without 
              prior notice or liability, under the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>You breach any provision of these Terms</li>
              <li>You engage in fraudulent or illegal activities</li>
              <li>Your use of the Service causes harm to others or the Service</li>
              <li>Required by law or legal authorities</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Upon termination, your right to use the Service ceases immediately. We may delete your 
              account and all associated data without liability.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Governing Law and Dispute Resolution</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              where mistani.lol operates, without regard to conflict of law principles.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Any disputes arising from these Terms or your use of the Service shall be resolved through 
              binding arbitration in accordance with the rules of the relevant arbitration association, 
              rather than in court, except that you may assert claims in small claims court if your claims 
              qualify.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately 
              upon posting. Your continued use of the Service after changes constitutes acceptance of the 
              updated Terms.
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Material changes will be highlighted and users will be notified via email or prominent 
              in-app notices.
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-700 rounded p-4 mt-4">
              <p className="text-gray-300">
                <strong>Legal Inquiries:</strong> legal@mistani.lol<br />
                <strong>General Support:</strong> support@mistani.lol<br />
                <strong>DMCA Notices:</strong> dmca@mistani.lol<br />
                <strong>Response Time:</strong> Within 30 business days
              </p>
            </div>
          </section>

          <div className="bg-amber-500/20 border border-amber-500 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-amber-400 mb-3">Final Agreement</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms of Service, together with our Privacy Policy, constitute the entire agreement 
              between you and mistani.lol regarding the use of our Service. By using mistani.lol, you 
              acknowledge that you have read, understood, and agree to be bound by these Terms.
            </p>
            <p className="text-gray-300 leading-relaxed mt-3">
              If you do not agree to these Terms, you must immediately cease using our Service and delete 
              your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
