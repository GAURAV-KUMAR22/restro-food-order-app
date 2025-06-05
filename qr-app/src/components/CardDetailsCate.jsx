
import React from 'react'
export const CardDetailsCate = ({ dishName, price, handleQuantity }) => {
    return (
        <card className='detail-card-specil'>
            <img src='/assets/image 2.png' alt='food' />
            <h3>{dishName}</h3>
            <p>Rs. {price}</p>
            <button onClick={handleQuantity}>Add to cart</button>
        </card>
    )
}
