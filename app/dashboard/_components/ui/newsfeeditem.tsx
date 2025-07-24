import React from 'react'
import { newsFeedItemType } from '../types'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { formatTimeAgo } from '../../_lib/displaytime'

function NewsFeedItem({newsItem}:{newsItem:newsFeedItemType}) {
  return (
    <div className='flex flex-row  justify-between'>
        <div>
            <div className='text-primary font-medium text-sm'>
                <span>{newsItem.subject}</span> • <span> {formatTimeAgo(newsItem.delay)}</span>
            </div>
            <div className='text-xs'>
                {newsItem.title}
            </div>
        </div>
            
        
        <div className="w-fit  flex *:data-[slot=avatar]:ring-background  -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            {newsItem.cryptosImgRelated.map(
                (cryptoIcon)=>{
                    return <Avatar key={cryptoIcon.label}  >
                                <AvatarImage src={cryptoIcon.imgUrl} alt="@shadcn" className="rounded-full h-4 border-1 bg-white shadow-xl" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                }
            )}
        </div>
    </div>
  )
}

export default NewsFeedItem
