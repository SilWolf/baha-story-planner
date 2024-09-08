const StoryLineTextareaCard = () => {
  return (
    <div className="p-2 rounded border-l-4 border-gray-700 bg-gray-100 hover:bg-gray-200 focus-within:!bg-green-100">
      <textarea className="w-full block bg-transparent m-0 resize-none"></textarea>
    </div>
  );
};

export default function StoriesByIdPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-2">
        <StoryLineTextareaCard />
        <StoryLineTextareaCard />
        <StoryLineTextareaCard />
        <StoryLineTextareaCard />
        <StoryLineTextareaCard />
        <StoryLineTextareaCard />
        <StoryLineTextareaCard />
        <StoryLineTextareaCard />
      </div>
    </div>
  );
}
