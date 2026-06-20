export function FacilityExperience() {
  const facilities = [
    {
      id: 'consultation',
      name: 'Private Consultation Rooms',
      description: 'Comfortable, private spaces for confidential conversations about your fertility journey.',
      icon: '🔒',
    },
    {
      id: 'lab',
      name: 'Advanced Embryology Lab',
      description: 'State-of-the-art laboratory with time-lapse imaging and ideal embryo culture conditions.',
      icon: '🔬',
    },
    {
      id: 'ultrasound',
      name: 'Advanced Ultrasound Suite',
      description: 'High-resolution ultrasound for detailed monitoring and egg retrieval procedures.',
      icon: '📡',
    },
    {
      id: 'recovery',
      name: 'Comfortable Recovery Areas',
      description: 'Peaceful recovery spaces where your partner can be with you after procedures.',
      icon: '😌',
    },
  ];

  return (
    <section className="section-padding bg-ivf-cream">
      <div className="section-max-width">
        <div className="mb-16 text-center">
          <p className="text-ivf-pink font-semibold text-sm mb-2 uppercase tracking-wide">
            Your Experience Matters
          </p>
          <h2 className="text-4xl font-bold text-ivf-dark mb-4">
            Premium Facility, Compassionate Care
          </h2>
          <p className="text-lg text-ivf-dark/70 max-w-2xl mx-auto">
            We've designed every space around the patient experience—not just medical protocols. 
            When you visit IVF Master, you&apos;ll feel the difference.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {facilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-ivf-white rounded-xl p-8 border border-ivf-border hover:border-ivf-pink hover:shadow-lg transition-all"
            >
              <div className="text-5xl mb-4">{facility.icon}</div>
              <h3 className="text-xl font-semibold text-ivf-dark mb-2">{facility.name}</h3>
              <p className="text-ivf-dark/70">{facility.description}</p>
            </div>
          ))}
        </div>

        {/* Experience Message */}
        <div className="bg-gradient-to-r from-ivf-pink/10 to-ivf-mauve/10 border border-ivf-border rounded-xl p-8">
          <p className="text-lg text-ivf-dark leading-relaxed">
            <span className="font-semibold">Our Approach:</span> {" Every detail—from the calming colors to the comfortable seating to the respectful staff—is designed to reduce anxiety and create a supportive environment. You won't feel like a patient here. You'll feel like a valued person on an important journey."}
          </p>
        </div>
      </div>
    </section>
  );
}
