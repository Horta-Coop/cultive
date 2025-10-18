import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className='relative '>
            <div className='w-20 border-emerald-200 border-2 rounded-full'>                
                <div className='w-20 border-emerald-500 border-t-2 rounded-full animate-spin absolute left-0 top-0'>
                    <div className='sr-only'>Carregando</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default LoadingSpinner