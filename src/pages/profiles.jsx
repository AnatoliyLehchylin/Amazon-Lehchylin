import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import './style.css'

import {profileData} from "../data/profileData.js";

function Profiles() {

    const navigate = useNavigate();
    const location = useLocation();
    const queryString = location.search;
    const searchParams = new URLSearchParams(queryString);
    const accountId = searchParams.get('accountId');

    const currentProfiles = profileData.filter(profile => profile.accountId === +accountId);

    const [sort, setSort] = useState(true);
    const [objFilter, setObjFilter] = useState({profileId: '', country: '', marketplace: ''});
    const [filteredProfiles, setFilteredProfiles] = useState(currentProfiles);
    const [isFilter, setIsFilter] = useState(false);
    const [numPage, setNumPage] = useState(1);

    const sortedData = filteredProfiles.sort((a, b) => (sort ? a.profileId - b.profileId : b.profileId - a.profileId));

    const elemInPage = 4;
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
        const filteredData = currentProfiles.filter(profile =>
            Object.entries(objFilter).every(([key, value]) => value === '' || profile[key].toString() === value.toString())
        );
        setFilteredProfiles(filteredData);
    }

    function IsClear() {
        setFilteredProfiles(currentProfiles);
        setObjFilter({profileId: '', country: '', marketplace: ''});
    }

    function IsClose() {
        setFilteredProfiles(currentProfiles);
        setObjFilter({profileId: '', country: '', marketplace: ''});
        setIsFilter(!isFilter)
    }

    function AddQueryParams(newId) {
        const newParams = `${queryString}&profileId=${newId}`;
        navigate(`/campaigns${newParams}`);
    }

    useEffect(() => {
        setNumPage(1)
    },[sort])

    return (
        <div className='page-wrapp'>
            <NavLink to={'/'} className='navlink-profile navlink'>to accounts</NavLink>
            <div className='title'>Profiles</div>
            <div className='title-description'>(accountId: <span className='span-number'>{accountId}</span>)</div>

            {sortedData.length > 0 && (
                <>
                    <div className='sort-filter-wrapp sort-filter-profile'>
                        <select id="dropdown" value={sort} onChange={ChangeSort} className='button sort sort-profile'>
                            <option value="true">Спочатку ID меньше</option>
                            <option value="false">Спочатку ID більше</option>
                        </select>
                        <button style={isFilter ? {backgroundColor: '#e184ad'} : {}} className='button'
                                onClick={() => IsClose()}>{isFilter ? 'Close' : 'Filter'}</button>
                    </div>

                    {isFilter && (
                        <div className='filter-wrap'>
                            <div className='inputs-wrapp inputs-wrapp-profile'>
                                <input placeholder={'profileId'} value={objFilter.profileId}
                                       onChange={(e) => FilterChange(e, 'profileId')} className='input'/>
                                <input placeholder={'country'} value={objFilter.country}
                                       onChange={(e) => FilterChange(e, 'country')}
                                       className='input'/>
                                <input placeholder={'marketplace'} value={objFilter.marketplace}
                                       onChange={(e) => FilterChange(e, 'marketplace')} className='input' style={{marginRight: '0'}}/>
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
                <div className='no-data'>NO PROFILES</div>
            ) : (
                <div className='headers'>
                    <div className='headers-item'>PROFILE ID</div>
                    <div className='headers-item'>COUNTRY</div>
                    <div className='headers-item'>MARKETPLACE</div>
                </div>
            )}
            {sortedData.slice(firstElem, lastElem).map(profile => (
                <div key={profile.profileId}
                     className='line' onClick={() => AddQueryParams(profile.profileId)}>
                    <div className='line-item'>{profile.profileId} </div>
                    <div className='line-item'>{profile.country}</div>
                    <div className='line-item'>{profile.marketplace}</div>
                </div>
            ))}
            {totalPages > 1 && (
                <div className='pagination-wrapp pagination-profile'>
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

export default Profiles