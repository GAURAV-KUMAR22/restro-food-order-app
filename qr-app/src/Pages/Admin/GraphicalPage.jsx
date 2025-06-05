import React from 'react'
import DoughnutChart from '../../components/DoughnutChart'
import { Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'

export const GraphicalPage = () => {
    return (
        <div>
            <div className='flex m-1 text-xl mb-4 '>
                <Link to={'/admin'} className='flex flex-row justify-center items-center text-center'> <IoIosArrowBack /><span>Admin</span></Link>
            </div>
            <div>
                <h2 className=' text-center text-2xl bg-amber-600 mx-2 mb-4'>Data Visualization</h2>
                <DoughnutChart />
            </div>

        </div>

    )
}
