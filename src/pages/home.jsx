import React from 'react'
import PageDivider from '../components/page-divider/page-divider'
import Common from '../components/common/common'
import Offers from '../components/offers/offers'
import NewStocks from '../components/new-stocks/new-stocks'
import NewsLetter from '../components/news-letter/news-letter'

function Home() {

  window.scrollTo(0,0); // scrolls the page back to the top
  
  return (
    <div>
        <PageDivider/>
        <Common/>
        <Offers/>
        <NewStocks/>
        <NewsLetter/>
    </div>
  )
}

export default Home