import React, { useState } from 'react'
import Graph from './Graph'
import { useStoreContext } from '../../contextApi/ContextApi'
import { useFetchMyShortUrls, useFetchTotalClicks } from '../../hooks/useQuery'
import ShortenPopUp from './ShortenPopUp'
import { FaLink, FaChartBar, FaPlus } from 'react-icons/fa'
import ShortenUrlList from './ShortenUrlList'
import { useNavigate } from 'react-router-dom'

const DashboardLayout = () => {
    const { token } = useStoreContext();
    const navigate = useNavigate();
    const [shortenPopUp, setShortenPopUp] = useState(false);

    const {isLoading, data: myShortenUrls, refetch } = useFetchMyShortUrls(token, onError)
    const {isLoading: loader, data: totalClicks} = useFetchTotalClicks(token, onError)

    function onError() {
      navigate("/error");
    }

    // Calculate metrics
    const totalLinksCount = myShortenUrls?.length || 0;
    const totalClicksCount = totalClicks?.reduce((acc, curr) => acc + (curr.count || 0), 0) || 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-bgColor pb-20 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-textMain tracking-tight">Dashboard</h1>
                    <p className="text-sm text-textSecondary mt-1">Manage your links and view their performance.</p>
                </div>
                <button
                    className="flex items-center gap-2 bg-accent hover:bg-indigo-700 px-5 py-2.5 rounded-lg font-medium text-white shadow-soft transition-colors"
                    onClick={() => setShortenPopUp(true)}
                >
                    <FaPlus className="text-sm" /> Create Link
                </button>
            </div>

            {loader || isLoading ? ( 
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
                    <p className="mt-4 text-textSecondary font-medium">Loading your dashboard...</p>
                </div>
            ) : ( 
            <div className="space-y-8">
                
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-borderColor shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-accent">
                                <FaLink />
                            </div>
                            <h3 className="text-textSecondary font-medium text-sm">Total Links</h3>
                        </div>
                        <p className="text-3xl font-bold text-textMain">{totalLinksCount}</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-borderColor shadow-sm">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-accentBlue">
                                <FaChartBar />
                            </div>
                            <h3 className="text-textSecondary font-medium text-sm">Total Clicks</h3>
                        </div>
                        <p className="text-3xl font-bold text-textMain">{totalClicksCount}</p>
                    </div>
                </div>

                {/* Graph Section */}
                <div className="bg-white p-6 rounded-2xl border border-borderColor shadow-sm">
                    <h3 className="text-lg font-semibold text-textMain mb-6">Engagement Overview</h3>
                    <div className="h-72 relative">
                        {totalClicks.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center bg-slate-50/50 rounded-lg">
                                <FaChartBar className="text-slate-300 text-4xl mb-3" />
                                <h4 className="text-textMain font-medium mb-1">No analytics data yet</h4>
                                <p className="text-textSecondary text-sm max-w-sm">
                                    Share your short links to start tracking engagement metrics across your URLs.
                                </p>
                            </div>
                        ) : (
                            <Graph graphData={totalClicks} />
                        )}
                    </div>
                </div>

                {/* Links Table Section */}
                <div className="bg-white rounded-2xl border border-borderColor shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-borderColor">
                        <h3 className="text-lg font-semibold text-textMain">Recent Links</h3>
                    </div>
                    
                    {myShortenUrls.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <FaLink className="text-slate-400 text-2xl" />
                            </div>
                            <h4 className="text-textMain font-medium mb-1">No links created</h4>
                            <p className="text-textSecondary text-sm max-w-sm mb-6">
                                You haven't created any short links yet. Get started by creating your first link.
                            </p>
                            <button
                                className="bg-white border border-borderColor hover:bg-slate-50 text-textMain px-5 py-2 rounded-lg font-medium shadow-sm transition-colors"
                                onClick={() => setShortenPopUp(true)}
                            >
                                Create your first link
                            </button>
                        </div>
                    ) : (
                        <ShortenUrlList data={myShortenUrls} />
                    )}
                </div>
            </div>
            )}
        </div>

        <ShortenPopUp
          refetch={refetch}
          open={shortenPopUp}
          setOpen={setShortenPopUp}
        />
    </div>
  )
}

export default DashboardLayout
