import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { formatDistanceToNow } from 'date-fns'
import _ from 'lodash'
import Link from 'next/link'

function NewsFeedItem({ newsItem }: { newsItem: any }) {
  return (
    <Link href={newsItem.url}>
    <div className="flex flex-row justify-between">
      <div>
        <div className="text-primary font-medium text-sm">
          <span>{newsItem.source?.name}</span> • <span>{formatDistanceToNow(new Date(newsItem.datetime))}</span>
        </div>
        <div className="text-xs">{_.truncate(newsItem.title, {length:80, omission : "..."})}</div>
      </div>
      <div className="w-fit flex -space-x-2">
        {newsItem.cryptos.map((crypto: any) => (
          <Avatar key={crypto.id}>
            <AvatarImage
              src={crypto.image_url}
              alt={crypto.symbol}
              className="rounded-full h-6 border-1 bg-white shadow-xl"
            />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
    </Link>
  );
}
export default NewsFeedItem
