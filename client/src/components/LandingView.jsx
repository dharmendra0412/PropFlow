import React, { useState } from 'react';
import {
  Building2,
  Wrench,
  Calendar,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  MessageSquare,
  Users,
  ArrowRight,
  Database,
  Sparkles,
  Star,
  ShieldAlert,
  LogIn,
  UserPlus,
  Home,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  TrendingUp,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';

export const LandingView = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState('maintenance');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const featureShowcase = {
    maintenance: {
      tag: 'Work Order Management',
      title: 'Real-Time Maintenance Request Lifecycle',
      headline: 'Resolve tenant repair requests faster with complete transparency and tracking',
      description:
        'Just like Zillow Rental Manager streamlines maintenance intake, PropFlow digitizes the entire repair lifecycle. Residents report issues with photos and urgency ratings; managers assign qualified technicians and transition tickets through verified states.',
      bullets: [
        'Multi-category intake: Plumbing, HVAC, Electrical, Appliance, Structural, General',
        'Urgency prioritization: Low, Medium, High, and Emergency alerts',
        'Visual status machine: Pending ➔ In Progress ➔ Completed',
        'Turnaround tracking: Built to resolve routine tickets promptly within 48 hours',
        'Threaded two-way discussion attached directly to each work order',
      ],
      cardTag: 'Service Standard',
      cardTitle: 'Fast Repair Turnaround',
      cardDesc: 'Digitized from initial resident ticket to manager sign-off with clear accountability.',
      cardMetrics: [
        { label: 'Digital Intake', value: '24/7 Available' },
        { label: 'Issue Prioritization', value: '4 Urgency Levels' },
        { label: 'Two-Way Chat', value: 'Threaded per Ticket' },
      ],
    },
    amenities: {
      tag: 'Facility Scheduling',
      title: 'Zero-Conflict Amenity Booking Engine',
      headline: 'Eliminate double bookings for shared spaces with automated reservation logic',
      description:
        'Shared luxury amenities are a major resident perk. PropFlow ensures community gyms, lap pools, rooftop lounges, and conference rooms operate with zero scheduling clashes and verified attendance.',
      bullets: [
        'Automated collision prevention: Overlapping reservations are automatically rejected',
        '1-click Check-In on arrival and Check-Out on departure with exact timestamps',
        'Custom operating hours, time slot durations, and capacity limits per facility',
        'Popular presets: Fitness Center, Swimming Pool, Clubhouse, Conference Room, BBQ Pavilion',
        'Live daily schedule calendar for residents and building management',
      ],
      cardTag: 'Resident Convenience',
      cardTitle: 'Conflict-Free Booking',
      cardDesc: 'Residents easily reserve shared spaces without awkward overlaps or double bookings.',
      cardMetrics: [
        { label: 'Double Bookings', value: '0 Clashes Guaranteed' },
        { label: 'Arrival Attendance', value: '1-Click Check-In' },
        { label: 'Booking Confirmation', value: 'Instant' },
      ],
    },
    communication: {
      tag: 'Resident Engagement',
      title: 'Direct, Transparent Resident Communication',
      headline: 'End phone tag, lost emails, and miscommunication on work orders',
      description:
        'Keep landlords, property managers, and residents completely aligned. Every maintenance ticket includes a live discussion feed with instant updates.',
      bullets: [
        'Instant message delivery directly attached to active work orders',
        'Verified role badges distinguishing Property Management from Residents',
        'Live notifications when tickets are assigned or progress',
        'Permanent audit trail: Created date, assignment history, and closure notes',
      ],
      cardTag: 'Communication',
      cardTitle: 'Real-Time Resident Chat',
      cardDesc: 'Clear, documented communication between residents and management on every issue.',
      cardMetrics: [
        { label: 'Paperwork Required', value: 'None (100% Digital)' },
        { label: 'User Roles', value: 'Verified Landlord / Tenant' },
        { label: 'History & Notes', value: 'Permanent Audit Trail' },
      ],
    },
    analytics: {
      tag: 'Operational Intelligence',
      title: 'Zillow-Grade Property Analytics',
      headline: 'Actionable real-time insights into property health, repair turnaround, and facility usage',
      description:
        'Monitor your entire rental portfolio from one centralized command center. Gauge maintenance turnaround, track resolved ticket ratios, and analyze community facility popularity.',
      bullets: [
        'Turnaround overview tracking average resolution hours',
        'Live ticket completion rate percentage across all managed units',
        'Service category breakdown and urgency distribution charts',
        'Real-time facility utilization and attendance ratios',
        'Multi-property portfolio switching from a single login',
      ],
      cardTag: 'Manager Command Center',
      cardTitle: 'Complete Portfolio Visibility',
      cardDesc: 'All key operational numbers in one place to keep properties running smoothly.',
      cardMetrics: [
        { label: 'Portfolio Overview', value: 'Multi-Building' },
        { label: 'Resolution Tracking', value: 'Active SLA Telemetry' },
        { label: 'Facility Usage', value: 'Live Attendance' },
      ],
    },
  };

  const comparisonRows = [
    {
      feature: 'Maintenance Request Intake',
      traditional: 'Paper slips, messy email threads, voice calls',
      propflow: 'Digital intake with category, urgency, and live dispatching',
    },
    {
      feature: 'Status Visibility',
      traditional: 'Tenant left guessing if anyone saw the request',
      propflow: 'Live status stepper: Pending ➔ In Progress ➔ Completed',
    },
    {
      feature: 'Amenity Scheduling',
      traditional: 'Physical clipboards, frequent double bookings',
      propflow: 'Algorithmic collision prevention with 0 double bookings',
    },
    {
      feature: 'Facility Attendance',
      traditional: 'No record of who used the gym or pool',
      propflow: '1-click Check-In and Check-Out with audit timestamps',
    },
    {
      feature: 'Turnaround Benchmark',
      traditional: 'No accountability, repairs take weeks',
      propflow: 'Strict ≤ 48-hour resolution SLA telemetry',
    },
    {
      feature: 'Record Keeping & Auditing',
      traditional: 'Scattered paper slips, messy spreadsheets, lost records',
      propflow: 'Unified digital portal with automated audit trails',
    },
  ];

  const faqs = [
    {
      q: 'How does the platform compare to Zillow Rental Manager?',
      a: 'Zillow Rental Manager is the industry benchmark for digital rental operations. PropFlow builds directly upon Zillow’s standards by providing a specialized, real-time operating system focused on the two most critical operational pain points: Real-Time Maintenance Request SLA tracking and Conflict-Free Amenity Scheduling with live check-in/out timestamps.',
    },
    {
      q: 'How does the Collision Prevention Engine ensure zero double bookings?',
      a: 'When any resident selects a date and time interval [Start, End], the backend executes an atomic interval collision check against all active reservations for that facility. If max(Start1, Start2) < min(End1, End2), the request is mathematically blocked with HTTP 409 Conflict, ensuring that double bookings are strictly impossible.',
    },
    {
      q: 'How is the 48-Hour Maintenance Resolution SLA calculated?',
      a: 'The moment a resident submits a work order, an immutable createdAt timestamp is recorded. When the property manager enters closure resolution notes and marks the ticket Completed, resolvedAt is captured. The system calculates the exact elapsed hours and updates the SLA compliance percentage on the Manager Command Center.',
    },
    {
      q: 'Can property managers oversee multiple buildings?',
      a: 'Yes! Property owners can register multiple properties (e.g. high-rises, boutique lofts, residential complexes), switch between properties seamlessly via the top navigation, and monitor separate facility schedules and repair queues for each building.',
    },
    {
      q: 'Can residents track the live status of their maintenance requests?',
      a: 'Yes! Residents can view real-time status updates (Pending, In Progress, Completed), see assigned technicians, and chat directly with property management within each work order.',
    },
  ];

  const activeFeature = featureShowcase[activeTab];

  return (
    <div className="space-y-16 py-4 font-sans text-slate-900">
      {/* 1. Zillow-Inspired Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900 to-zillow-950 text-white p-8 sm:p-14 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-zillow-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zillow-500/20 border border-zillow-400/30 text-zillow-200 text-xs font-semibold backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5 text-zillow-300" />
            <span>Modern Property Operations Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            Centralized Rental Operations with{' '}
            <span className="bg-gradient-to-r from-zillow-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Zero Conflicts & Instant Tracking
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            An all-in-one property rental, maintenance, and amenity management platform. Simplify residential operations, resolve repairs with a verified <strong>≤ 48-hour SLA</strong>, and guarantee <strong>zero amenity double bookings</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-3.5 bg-zillow-500 hover:bg-zillow-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-zillow-500/30 transition flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Get Started — Create Account</span>
            </button>
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold transition backdrop-blur-md border border-white/10 flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Portal</span>
            </button>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Resident Accounts</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-zillow-400" />
              <span>Instant Live Updates</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>0 Amenity Conflicts Guaranteed</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>≤ 48h Maintenance SLA</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Interactive Zillow-Style Feature Showcase */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zillow-600">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Modern Rental Ecosystems
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Click through our core modules to see how PropFlow handles rental operations in real time:
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl max-w-3xl mx-auto border border-slate-200">
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'maintenance'
                ? 'bg-white text-zillow-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Maintenance & Repairs</span>
          </button>
          <button
            onClick={() => setActiveTab('amenities')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'amenities'
                ? 'bg-white text-zillow-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Amenity Scheduling</span>
          </button>
          <button
            onClick={() => setActiveTab('communication')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'communication'
                ? 'bg-white text-zillow-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Resident Communication</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'analytics'
                ? 'bg-white text-zillow-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Manager Insights</span>
          </button>
        </div>

        {/* Active Feature Detail Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-zillow-50 text-zillow-700 uppercase tracking-wider">
              {activeFeature.tag}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {activeFeature.title}
            </h3>
            <p className="text-sm font-semibold text-zillow-700">
              {activeFeature.headline}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {activeFeature.description}
            </p>

            <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700">
              {activeFeature.bullets.map((b, i) => (
                <li key={i} className="flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-zillow-950 text-white rounded-2xl p-6 sm:p-8 space-y-5 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zillow-300 uppercase tracking-wider block">
                {activeFeature.cardTag}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeFeature.cardTitle}
              </div>
              <p className="text-xs text-slate-300">
                {activeFeature.cardDesc}
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2.5 text-xs">
              {activeFeature.cardMetrics.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-300">
                  <span>{m.label}</span>
                  <span className="font-semibold text-emerald-400">{m.value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenAuth}
              className="w-full py-2.5 bg-zillow-500 hover:bg-zillow-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md shadow-zillow-500/20"
            >
              <span>Explore Platform Features</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>



      {/* 4. Comparison Table: Traditional Systems vs. PropFlow */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zillow-600">
            Industry Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Traditional Rental Tools vs. PropFlow
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            See how our real-time architecture transforms manual property operations:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="py-3 px-4 font-bold rounded-l-xl">Operational Feature</th>
                <th className="py-3 px-4 font-bold text-rose-700">Traditional Systems</th>
                <th className="py-3 px-4 font-bold text-zillow-700 rounded-r-xl">PropFlow Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonRows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.feature}</td>
                  <td className="py-3.5 px-4 text-slate-500">{row.traditional}</td>
                  <td className="py-3.5 px-4 font-medium text-zillow-800 bg-zillow-50/40">
                    <span className="flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{row.propflow}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Frequently Asked Questions (FAQ) Accordion */}
      <section className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zillow-600">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Know
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Common questions about technical architecture, conflict prevention, and workflows:
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 hover:text-zillow-600"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-zillow-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>



      {/* 7. Bottom Call to Action */}
      <section className="text-center bg-gradient-to-r from-zillow-600 via-zillow-700 to-indigo-800 rounded-3xl p-8 sm:p-14 text-white shadow-xl space-y-4">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Ready to experience modern real-time property management?
        </h2>
        <p className="text-xs sm:text-sm text-zillow-100 max-w-xl mx-auto leading-relaxed">
          Create an account today to start managing residential properties, dispatching repair work orders, and scheduling community amenities conflict-free.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={onOpenAuth}
            className="px-7 py-3.5 bg-white text-zillow-700 hover:bg-zillow-50 rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Free Account</span>
          </button>
          <button
            onClick={onOpenAuth}
            className="px-7 py-3.5 bg-zillow-900/80 hover:bg-zillow-950 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 border border-white/10"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Portal</span>
          </button>
        </div>
      </section>
    </div>
  );
};
