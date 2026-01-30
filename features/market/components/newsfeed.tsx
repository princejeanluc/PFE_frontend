import React from "react";
import NewsFeedItem from "./newsfeeditem";
import { useLatestNews } from "@/features/market/hooks/market";

function NewsFeed() {
  const { data, isLoading, error } = useLatestNews();

  if (isLoading) return <div>Chargement des actualités...</div>;
  if (error || !data) return <div>Erreur lors du chargement.</div>;

  return (
    <div className="flex flex-col gap-1">
      {data.map((news: any) => (
        <NewsFeedItem newsItem={news} key={news.id} />
      ))}
    </div>
  );
}

export default NewsFeed;
