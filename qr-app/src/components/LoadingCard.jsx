import React from 'react';

export const LoadingCard = () => {
    return (
        <div className='min-w-[140px] w-[140px] h-[169px] shadow-sm border ml-1 p-2 overflow-y-hidden animate-pulse'>
            <div className='w-full h-[80px] bg-gray-300 rounded'></div>
            <div className='h-4 bg-gray-300 mt-3 rounded w-3/4'></div>
            <div className='h-4 bg-gray-300 mt-2 rounded w-1/2'></div>
            <div className='w-28 bg-gray-300 rounded-md h-8 mt-3'></div>
        </div>
    );
};
