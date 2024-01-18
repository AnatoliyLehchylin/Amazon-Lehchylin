import {NavLink, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import './style.css'

import {campaignData} from "../data/campaignData.js";

function Campaigns() {

    const location = useLocation();
    const queryString = location.search;
    const searchParams = new URLSearchParams(queryString);
    const accountId = searchParams.get('accountId');
    const profileId = searchParams.get('profileId');

    const currentCampaigns = campaignData.filter(campaign => campaign.profileId === +profileId);

    const [sort, setSort] = useState(true);
    const [objFilter, setObjFilter] = useState({campaignId: '', clicks: '', coast: '', date: ''});
    const [filteredCampaigns, setFilteredCampaigns] = useState(currentCampaigns);
    const [isFilter, setIsFilter] = useState(false);
    const [numPage, setNumPage] = useState(1);

    const sortedData = filteredCampaigns.sort((a, b) => (sort ? a.coast - b.coast : b.coast - a.coast));

    const elemInPage = 3;
    const totalPages = Math.ceil(sortedData.length / elemInPage);
    const firstElem = (numPage - 1) * elemInPage;
    const lastElem = (numPage - 1) * elemInPage + elemInPage;

    function ChangePages(index) {
        setNumPage(index + 1)
    }

    function ChangePagesLeft() {
        numPage > 1 && setNumPage(numPage - 1)
    }

    function ChangePagesRight() {
        numPage < totalPages && setNumPage(numPage + 1)
    }

    function ChangeSort(event) {
        setSort(event.target.value === "true");
    }

    function FilterChange(e, property) {
        setObjFilter(prevFilter => ({...prevFilter, [property]: e.target.value}));
    }

    function Filtration() {
        const filteredData = currentCampaigns.filter(profile =>
            Object.entries(objFilter).every(([key, value]) => value === '' || profile[key].toString() === value.toString())
        );
        setFilteredCampaigns(filteredData);
    }

    function IsClear() {
        setFilteredCampaigns(currentCampaigns);
        setObjFilter({campaignId: '', clicks: '', coast: '', date: ''});
    }

    function IsClose() {
        setFilteredCampaigns(currentCampaigns);
        setObjFilter({campaignId: '', clicks: '', coast: '', date: ''});
        setIsFilter(!isFilter)
    }

    useEffect(() => {
        setNumPage(1)
    }, [sort])

    return (
        <div className='page-wrapp'>
            <div className='navlink-wrapp'>
                <div className='navlink'>
                    <NavLink to={'/accounts'} className='navlink-item'>to accounts</NavLink>
                </div>
                <div className='navlink'>
                    <NavLink to={`/profiles?accountId=${accountId}`} className='navlink-item'>to profiles</NavLink>
                </div>
            </div>
            <div className='title'>Campaigns</div>
            <div className='title-description'>(accountId: <span
                className='span-number'>{accountId}</span> profileId: <span className='span-number'>{profileId}</span>)
            </div>

            {sortedData.length > 0 && (
                <>
                    <div className='sort-filter-wrapp'>
                        <select id="dropdown" value={sort} onChange={ChangeSort} className='button sort'>
                            <option value="true">Спочатку coast меньше</option>
                            <option value="false">Спочатку coast більше</option>
                        </select>
                        <button style={isFilter ? {backgroundColor: '#e184ad'} : {}} className='button'
                                onClick={() => IsClose()}>{isFilter ? 'Close' : 'Filter'}</button>
                    </div>

                    {isFilter && (
                        <div className='filter-wrap'>
                            <div className='inputs-wrapp'>
                                <input placeholder={'campaignId'} value={objFilter.campaignId}
                                       onChange={(e) => FilterChange(e, 'campaignId')} className='input'/>
                                <input placeholder={'clicks'} value={objFilter.clicks}
                                       onChange={(e) => FilterChange(e, 'clicks')}
                                       className='input'/>
                                <input placeholder={'coast'} value={objFilter.coast}
                                       onChange={(e) => FilterChange(e, 'coast')} className='input'/>
                                <input placeholder={'Date (DD-MM-YY)'} value={objFilter.date}
                                       onChange={(e) => FilterChange(e, 'date')} className='input'
                                       style={{marginRight: '0'}}/>
                            </div>
                            <div>
                                <button className='button' onClick={() => Filtration()}>Filtration</button>
                                <button className='button button-delete' onClick={() => IsClear()}>Clear</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {sortedData.length < 1 ? (
                <div className='no-data'>NO CAMPAIGNS</div>
            ) : (
                <div className='headers'>
                    <div className='headers-item'>CAMPAIGN ID</div>
                    <div className='headers-item'>CLICKS</div>
                    <div className='headers-item'>COAST</div>
                    <div className='headers-item'>DATE</div>
                </div>
            )}
            {sortedData.slice(firstElem, lastElem).map(campaign => (
                <div key={campaign.campaignId} className='line'>
                    <div className='line-item'>{campaign.campaignId} </div>
                    <div className='line-item'>{campaign.clicks}</div>
                    <div className='line-item'>{campaign.coast}</div>
                    <div className='line-item'>{campaign.date}</div>
                </div>
            ))}
            {totalPages > 1 && (
                <div className='pagination-wrapp'>
                    <button className={numPage < 2 ? 'pagination-item pagination-item-noactive' : 'pagination-item'} onClick={() => ChangePagesLeft()}>{'<'}</button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button className={(index + 1) === numPage ? 'pagination-item pagination-item-active' : 'pagination-item'} key={index} onClick={() => ChangePages(index)}>{index + 1}</button>
                    ))}
                    <button className={numPage < totalPages ? 'pagination-item' : 'pagination-item pagination-item-noactive'} onClick={() => ChangePagesRight()}>{'>'}</button>
                </div>
            )}
        </div>
    )
}

export default Campaigns