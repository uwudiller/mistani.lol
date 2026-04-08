import { Metadata } from 'next'
import Link from 'next/link'
import { 
  HelpCircle, 
  Shield, 
  Play, 
  User, 
  Video, 
  Database, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'FAQ - mistani.lol',
  description: 'Frequently asked questions about mistani.lol anime streaming platform',
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-amber-500 hover:text-amber-400 transition-colors mb-4 inline-block">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <HelpCircle className="w-10 h-10 mr-3 text-amber-500" />
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-lg">
            Everything you need to know about mistani.lol
          </p>
        </div>

        {/* Legal Notice */}
        <div className="bg-amber-500/20 border border-amber-500 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-amber-400 mb-3 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Important Legal Notice
          </h2>
          <p className="text-gray-300 leading-relaxed">
            mistani.lol is an information and aggregation service only. We do not host, upload, or distribute 
            any video content. All anime content is the property of their respective copyright owners. 
            Users are responsible for ensuring they have the legal right to access any content.
          </p>
        </div>

        <div className="space-y-6">
          {/* Getting Started */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Play className="w-6 h-6 mr-2 text-amber-500" />
              Getting Started
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  What is mistani.lol?
                </h3>
                <p className="text-gray-300">
                  mistani.lol is an anime discovery and streaming aggregation platform that helps you find 
                  and watch anime from various sources. We provide information about anime series, track your 
                  watch history, and offer personalized recommendations.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Is mistani.lol free to use?
                </h3>
                <p className="text-gray-300">
                  Yes, mistani.lol is completely free to use. We don't charge for account creation, anime 
                  discovery, or watch history tracking. Some linked streaming sources may have their own 
                  subscription requirements.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  How do I create an account?
                </h3>
                <p className="text-gray-300">
                  Click the "Sign Up" button on our homepage, provide your email address and create a secure 
                  password. You'll need to verify your email address to activate your account.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  What are the system requirements?
                </h3>
                <p className="text-gray-300">
                  mistani.lol works on any modern web browser (Chrome, Firefox, Safari, Edge) on desktop or 
                  mobile devices. A stable internet connection is required for streaming.
                </p>
              </div>
            </div>
          </section>

          {/* Content and Streaming */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Video className="w-6 h-6 mr-2 text-amber-500" />
              Content and Streaming
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Where does the anime content come from?
                </h3>
                <p className="text-gray-300">
                  mistani.lol does NOT host any video content. We aggregate links to anime from various 
                  third-party streaming sources. All content is the property of their respective copyright owners.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Is the content legal to watch?
                </h3>
                <p className="text-gray-300">
                  We cannot guarantee the legality of content accessed through third-party links. Users are 
                  responsible for ensuring they have the legal right to access any content. We recommend using 
                  official streaming services when available.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Why can't I find a specific anime?
                </h3>
                <p className="text-gray-300">
                  Our database includes thousands of anime titles, but some may not be available due to:
                  licensing restrictions, lack of available streaming sources, or the content not being in our 
                  database yet. We're constantly updating our catalog.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  What video quality is available?
                </h3>
                <p className="text-gray-300">
                  Video quality depends on the source streaming service. Most content is available in HD (720p) 
                  or Full HD (1080p), with some titles offering 4K quality. Quality is determined by the 
                  original content provider.
                </p>
              </div>
            </div>
          </section>

          {/* Account and Privacy */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <User className="w-6 h-6 mr-2 text-amber-500" />
              Account and Privacy
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  What information do you collect?
                </h3>
                <p className="text-gray-300">
                  We collect your email address, watch history, search queries, and basic usage analytics. 
                  All passwords are securely encrypted. See our Privacy Policy for detailed information.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Can I delete my account?
                </h3>
                <p className="text-gray-300">
                  Yes, you can delete your account at any time from your account settings. Deletion removes 
                  your personal information, watch history, and search data from our active systems.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Is my watch history private?
                </h3>
                <p className="text-gray-300">
                  Yes, your watch history is private and only visible to you. We use it to provide personalized 
                  recommendations and continue watching functionality. We never share individual viewing data.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Can I change my email or password?
                </h3>
                <p className="text-gray-300">
                  Yes, you can update your email address and password from your account settings. You'll need 
                  to verify your email address if you change it.
                </p>
              </div>
            </div>
          </section>

          {/* Features and Functionality */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-amber-500" />
              Features and Functionality
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  How does "Continue Watching" work?
                </h3>
                <p className="text-gray-300">
                  We automatically track your viewing progress for each anime. When you return to mistani.lol, 
                  you'll see your recently watched shows with progress indicators, allowing you to resume where 
                  you left off.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  What are the recommendation features?
                </h3>
                <p className="text-gray-300">
                  Our recommendation system analyzes your watch history, ratings, and viewing patterns to 
                  suggest anime you might enjoy. Recommendations improve over time as you use the service more.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Can I create watchlists or favorites?
                </h3>
                <p className="text-gray-300">
                  Yes, you can add anime to your favorites list for easy access. We're also working on additional 
                  playlist and watchlist features for future updates.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Does mistani.lol have mobile apps?
                </h3>
                <p className="text-gray-300">
                  Currently, mistani.lol is optimized for mobile web browsers. We're developing native mobile 
                  apps for iOS and Android, which will be announced when available.
                </p>
              </div>
            </div>
          </section>

          {/* Legal and Safety */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-amber-500" />
              Legal and Safety
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Is mistani.lol legal?
                </h3>
                <p className="text-gray-300">
                  mistani.lol operates as an information and aggregation service. We do not host or distribute 
                  copyrighted content. However, users should ensure they have legal rights to access any content 
                  through linked sources.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  What about copyright infringement?
                </h3>
                <p className="text-gray-300">
                  We respect intellectual property rights and comply with DMCA takedown notices. If you believe 
                  your copyrighted work is being infringed, please contact our legal team at legal@mistani.lol.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  How do you handle user data security?
                </h3>
                <p className="text-gray-300">
                  We use industry-standard encryption, secure password hashing, and regular security audits. 
                  All data transmissions use SSL/TLS encryption. We never store passwords in plain text.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  What if I encounter inappropriate content?
                </h3>
                <p className="text-gray-300">
                  While we strive to provide appropriate content, some linked sources may contain material 
                  not suitable for all audiences. Users should exercise discretion and report inappropriate 
                  content to our support team.
                </p>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2 text-amber-500" />
              Troubleshooting
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Why can't I stream certain episodes?
                </h3>
                <p className="text-gray-300">
                  Streaming issues may be caused by: source server problems, regional restrictions, or expired 
                  links. Try refreshing the page or checking back later as sources are regularly updated.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Why is the video buffering or loading slowly?
                </h3>
                <p className="text-gray-300">
                  Buffering issues are typically related to your internet connection or the source server's 
                  performance. Try checking your connection speed, closing other applications, or trying a 
                  different streaming source if available.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  I forgot my password. How do I reset it?
                </h3>
                <p className="text-gray-300">
                  Click "Forgot Password" on the sign-in page, enter your email address, and follow the 
                  instructions in the reset email. Password reset links expire after 24 hours for security.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  The website isn't loading correctly. What should I do?
                </h3>
                <p className="text-gray-300">
                  Try clearing your browser cache, disabling ad blockers, updating your browser, or trying a 
                  different browser. If issues persist, contact our support team with details about your 
                  browser and device.
                </p>
              </div>
            </div>
          </section>

          {/* Contact and Support */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact and Support</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  How can I contact support?
                </h3>
                <p className="text-gray-300">
                  Email us at support@mistani.lol for technical issues, account problems, or general questions. 
                  We typically respond within 24-48 hours.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  How do I report bugs or suggest features?
                </h3>
                <p className="text-gray-300">
                  We welcome feedback! Send bug reports and feature suggestions to feedback@mistani.lol. 
                  Include detailed information about the issue or suggestion.
                </p>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="text-lg font-medium text-white mb-2">
                  Do you have a social media presence?
                </h3>
                <p className="text-gray-300">
                  Follow us on Twitter @mistani_lol for updates, announcements, and community discussions. 
                  Join our Discord server for real-time chat with other users.
                </p>
              </div>
            </div>
          </section>

          {/* Quick Reference */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Reference</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-white">What We Do</h3>
                  <p className="text-gray-300 text-sm">Anime discovery, watch tracking, recommendations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-white">What We Don't Do</h3>
                  <p className="text-gray-300 text-sm">Host content, guarantee legality, provide official streams</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-white">Your Responsibility</h3>
                  <p className="text-gray-300 text-sm">Ensure legal access, secure your account, respect copyright</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-white">Support Response Time</h3>
                  <p className="text-gray-300 text-sm">24-48 hours for most inquiries</p>
                </div>
              </div>
            </div>
          </section>

          {/* Final Notice */}
          <div className="bg-amber-500/20 border border-amber-500 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-amber-400 mb-3">Still Have Questions?</h2>
            <p className="text-gray-300 leading-relaxed">
              If you couldn't find the answer you're looking for in this FAQ, don't hesitate to reach out to 
              our support team. We're here to help you get the most out of your mistani.lol experience.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-gray-300">
                <strong>General Support:</strong> support@mistani.lol
              </p>
              <p className="text-gray-300">
                <strong>Legal Questions:</strong> legal@mistani.lol
              </p>
              <p className="text-gray-300">
                <strong>DMCA Notices:</strong> dmca@mistani.lol
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
