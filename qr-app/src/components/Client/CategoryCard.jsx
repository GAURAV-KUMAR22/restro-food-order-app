import React from 'react'
import { Link } from 'react-router-dom'
import { CardItem } from '../CardItem'

export const CategoryCard = ({ uniqueCategories, products }) => {
    return (
        <div className='flex flex-row overflow-x-auto gap-2 ml-4 mb-3'  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {uniqueCategories?.map((category) => (
                <Link key={category?.name} to={`/${category?.name}`} state={{ items: products }} >
                    <CardItem key={category?.index} imgPath={category?.imageUrl} name={category?.name} />
                </Link>
            ))}
        </div>
    )
}
