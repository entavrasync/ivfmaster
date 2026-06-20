import Link from 'next/link';
import { doctors } from '@/lib/content/team';

export function MeetTeam() {
  return (
    <section className="relative bg-gradient-to-b from-ivf-cream to-ivf-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-ivf-mauve/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 section-max-width px-6 sm:px-8 lg:px-16 py-24 sm:py-32 lg:py-40">
        {/* Header - Editorial */}
        <div className="mb-24 space-y-6 max-w-3xl">
          <p className="text-sm font-light tracking-widest uppercase text-ivf-mauve/70">Meet the Guides</p>
          <h2 className="headline-lg text-ivf-dark mb-6">
            Experienced Doctors. Genuine Humans.
          </h2>
          <p className="body-lg text-ivf-dark/75">
            {"Our doctors aren't just experts in reproductive medicine. They're listeners, advisors, and partners in your fertility journey. Each brings decades of experience, a personal philosophy, and a commitment to understanding your dreams."}
          </p>
        </div>

        {/* Team Showcase - Large Premium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {doctors.slice(0, 4).map((doctor) => (
            <Link
              key={doctor.id}
              href={`/team/${doctor.slug}`}
              className="group"
            >
              <div className="relative mb-6 overflow-hidden rounded-3xl">
                {/* Hero Placeholder with Premium Styling */}
                <div className="w-full h-80 bg-gradient-to-br from-ivf-pink/12 to-ivf-mauve/8 flex items-center justify-center relative overflow-hidden">
                  <div className="text-9xl opacity-50 group-hover:scale-125 transition-transform duration-500">
                    👨‍⚕️
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ivf-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Doctor Information */}
              <div className="space-y-3">
                <div>
                  <h3 className="headline-md text-ivf-dark group-hover:text-ivf-pink transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-sm font-light text-ivf-mauve uppercase tracking-wider mt-1">
                    {doctor.title}
                  </p>
                </div>

                <p className="text-sm text-ivf-dark/60 italic">
                  {doctor.specialization}
                </p>

                <p className="body-lg text-ivf-dark/75 line-clamp-4 leading-relaxed">
                  {doctor.shortBio}
                </p>

                <div className="pt-4 flex items-center gap-2 text-ivf-pink font-semibold group-hover:gap-3 transition-all">
                  <span>Read Full Story</span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Team Message */}
        <div className="mt-12 text-center">
          <p className="text-ivf-dark/80 mb-6">
            Want to learn more about our doctors and their approaches?
          </p>
          <Link
            href="/team"
            className="inline-block btn-primary"
          >
            Meet The Full Team
          </Link>
        </div>
      </div>
    </section>
  );
}
