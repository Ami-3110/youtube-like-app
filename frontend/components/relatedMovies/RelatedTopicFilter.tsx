// frontend/components/RelatedMovies/RelatedTopicFilter.tsx


type Props = {
  topics: string[];
  activeTopics: string[];
  onToggleTopic: (topicId: string) => void;
};

export default function RelatedTopicFilter({
  topics,
  activeTopics,
  onToggleTopic,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((topic) => {
        const isActive = activeTopics.includes(topic);

        return (
          <button
            key={topic}
            type="button"
            onClick={() => onToggleTopic(topic)}
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isActive
                ? "bg-white text-black"
                : "bg-slate-700 text-slate-400"
            }`}
          >
            {topic} ×
          </button>
        );
      })}
    </div>
  );
}