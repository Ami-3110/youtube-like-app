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
          className={`rounded-full border border-(--border) px-3 py-1 text-xs font-bold ${
            isActive
              ? "bg-(--accent) text-(--accent-text)"
              : "bg-(--surface-2) text-(--text-main) hover:bg-(--surface-3)"
          }`}
        >
          {topic} ×
        </button>
      );
    })}
  </div>
);
}