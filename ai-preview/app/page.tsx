import Head from 'next/head';

export default function HomePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold">Todo List</h1>
      <ul className="list-disc ml-4">
        {/* Todo list items will be rendered here */}
      </ul>
    </div>
  );
}