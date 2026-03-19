import React from 'react';

interface FooterProps {
  lang?: string;
}

export default function Footer({ lang = 'en' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const base = `/${lang}`;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">StreamBits</h3>
            <p className="text-gray-400">Premium IPTV streaming. 10,000+ live channels, 4K/HD, no cable.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><a href={`${base}/channels`} className="text-gray-400 hover:text-white">Channels</a></li>
              <li><a href={`${base}/pricing`} className="text-gray-400 hover:text-white">Pricing</a></li>
              <li><a href={`${base}/packages`} className="text-gray-400 hover:text-white">Packages</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href={`${base}/contact`} className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href={`${base}/faq`} className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href={`${base}/help`} className="text-gray-400 hover:text-white">Help</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href={`${base}/about`} className="text-gray-400 hover:text-white">About</a></li>
              <li><a href={`${base}/privacy`} className="text-gray-400 hover:text-white">Privacy</a></li>
              <li><a href={`${base}/terms`} className="text-gray-400 hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} StreamBits. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
