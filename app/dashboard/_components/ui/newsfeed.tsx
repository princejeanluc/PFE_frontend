import { newsFeedList } from '../constants/constants'
import React from 'react'
import NewsFeedItem from './newsfeeditem'

function NewsFeed() {
  return (
    <div className='flex flex-col gap-2'>
        {newsFeedList.map((news)=>{
        return <NewsFeedItem newsItem={news} key={news.subject}></NewsFeedItem>
        })}
        
    </div>
  )
}

export default NewsFeed