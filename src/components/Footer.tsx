'use client'

import Link from 'next/link'
import { Shield, FileText, HelpCircle, MessageCircle, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-amber-500 mb-4">mistani.lol</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Your gateway to anime discovery. Track, watch, and explore thousands of anime titles 
              with personalized recommendations and watch history tracking.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://ko-fi.com/mistlol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/mistani" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-500 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-amber-500 transition-colors flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@mistani.lol" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="mailto:legal@mistani.lol" className="text-gray-400 hover:text-amber-500 transition-colors">
                  Legal Inquiries
                </a>
              </li>
              <li>
                <a href="mailto:dmca@mistani.lol" className="text-gray-400 hover:text-amber-500 transition-colors">
                  DMCA Notices
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} mistani.lol. All rights reserved.
            </p>
            <div className="text-gray-400 text-sm">
              <p className="mb-1">
                <strong>Disclaimer:</strong> mistani.lol is an aggregation service. We do not host or distribute content.
              </p>
              <p>
                All anime content is the property of their respective copyright owners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
