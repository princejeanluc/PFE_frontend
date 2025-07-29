import React from 'react'
import { newsFeedItemType } from '../types'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { formatTimeAgo } from '../../_lib/displaytime'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import _ from 'lodash'

function NewsFeedItem({ newsItem }: { newsItem: any }) {
  return (
    <div className="flex flex-row justify-between">
      <div>
        <div className="text-primary font-medium text-sm">
          <span>{newsItem.source?.name}</span> • <span>{formatDistanceToNow(new Date(newsItem.datetime))}</span>
        </div>
        <div className="text-xs">{_.truncate(newsItem.title, {length:100, omission : "..."})}</div>
      </div>
      <div className="w-fit flex -space-x-2">
        {newsItem.cryptos.map((crypto: any) => (
          <Avatar key={crypto.id}>
            <AvatarImage
              src={crypto.image_url}
              alt={crypto.symbol}
              className="rounded-full h-4 border-1 bg-white shadow-xl"
            />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
}
export default NewsFeedItem
