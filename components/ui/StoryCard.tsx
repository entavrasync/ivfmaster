interface StoryCardProps {
  title: string;
  description: string;
  quote: string;
  icon: string;
}

export function StoryCard({ title, description, quote, icon }: StoryCardProps) {
  return (
    <div className="group bg-ivf-white border-2 border-ivf-border rounded-xl p-8 hover:border-ivf-pink hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="text-5xl mb-4">{icon}</div>

      <h3 className="text-xl font-semibold text-ivf-dark mb-2 group-hover:text-ivf-pink transition-colors">
        {title}
      </h3>

      <p className="text-sm text-ivf-dark/70 mb-4 flex-grow">
        {description}
      </p>

      <div className="border-l-2 border-ivf-pink pl-4 py-2">
        <p className="text-sm italic text-ivf-dark">
          "{quote}"
        </p>
      </div>

      <div className="mt-4 text-ivf-pink font-semibold text-sm group-hover:translate-x-1 transition-transform">
        That&apos;s exactly us →
      </div>
    </div>
  );
}
