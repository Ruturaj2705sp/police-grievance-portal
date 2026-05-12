/**
 * Footer Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 dark:bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-900" />
              </div>
              <div>
                <div className="font-heading font-bold text-white">Police Grievance</div>
                <div className="text-xs text-blue-200">Portal | GOI</div>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              A citizen-centric platform enabling transparent, efficient grievance redressal through
              technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-amber-400 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/services', label: 'Services' },
                { to: '/register', label: 'File Complaint' },
                { to: '/faq', label: 'FAQ' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-blue-200 hover:text-amber-400 text-sm transition-colors"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Helplines */}
          <div>
            <h4 className="font-heading font-semibold text-amber-400 mb-4">Emergency Helplines</h4>
            <ul className="space-y-3">
              {[
                { label: 'Police Emergency', number: '100' },
                { label: 'Women Helpline', number: '1091' },
                { label: 'Child Helpline', number: '1098' },
                { label: 'Cyber Crime', number: '1930' },
                { label: 'Disaster Management', number: '108' },
              ].map((item) => (
                <li key={item.number} className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-blue-200">{item.label}:</span>
                  <span className="font-semibold text-white">{item.number}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-amber-400 mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-blue-200">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                Central Police Station, New Delhi - 110001
              </li>
              <li className="flex items-center gap-2 text-blue-200">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                grievance@police.gov.in
              </li>
              <li className="flex items-center gap-2 text-blue-200">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                1800-XXX-XXXX (Toll Free)
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-800 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-blue-300">
          <p>© {currentYear} Police Grievance Portal. Government of India. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-amber-400 transition-colors">Terms of Use</Link>
            <a href="#" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
              Sitemap <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
