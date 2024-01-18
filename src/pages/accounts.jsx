import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import './style.css'

import {accountData} from "../data/accountData.js";

function Accounts() {

    const [sort, setSort] = useState(true);
    const [objFilter, setObjFilter] = useState({accountId: '', email: '', authToken: '', creationDate: ''});
    const [filteredAccounts, setFilteredAccounts] = useState(accountData);
    const [isFilter, setIsFilter] = useState(false);
    const [numPage, setNumPage] = useState(1);

    const sortedData = [...filteredAccounts].sort((a, b) => {
        const dateA = new Date(
            parseInt(a.creationDate.slice(6, 10)),
            parseInt(a.creationDate.slice(3, 5)) - 1,
            parseInt(a.creationDate.slice(0, 2))
        );

        const dateB = new Date(
            parseInt(b.creationDate.slice(6, 10)),
            parseInt(b.creationDate.slice(3, 5)) - 1,
            parseInt(b.creationDate.slice(0, 2))
        );

        return sort ? dateA - dateB : dateB - dateA;
    });

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
        const filteredData = accountData.filter(profile =>
            Object.entries(objFilter).every(([key, value]) => value === '' || profile[key].toString() === value.toString())
        );
        setFilteredAccounts(filteredData);
    }

    function IsClear() {
        setFilteredAccounts(accountData);
        setObjFilter({accountId: '', email: '', authToken: '', creationDate: ''});
    }

    function IsClose() {
        setFilteredAccounts(accountData);
        setObjFilter({accountId: '', email: '', authToken: '', creationDate: ''});
        setIsFilter(!isFilter)
    }

    useEffect(() => {
        setNumPage(1)
    },[sort])

    return (
        <div className='page-wrapp'>
            <div className='title'>Accounts</div>
            {sortedData.length > 0 && (
                <>
                    <div className='sort-filter-wrapp'>
                        <select id="dropdown" value={sort} onChange={ChangeSort} className='button sort'>
                            <option value="true">Спочатку створені раніше</option>
                            <option value="false">Спочатку створені пізніше</option>
                        </select>
                        <button style={isFilter ? {backgroundColor: '#e184ad'} : {}} className='button'
                                onClick={() => IsClose()}>{isFilter ? 'Close' : 'Filter'}</button>
                    </div>

                    {isFilter && (
                        <div className='filter-wrap'>
                            <div className='inputs-wrapp'>
                                <input placeholder={'accountId'} value={objFilter.accountId}
                                       onChange={(e) => FilterChange(e, 'accountId')} className='input'/>
                                <input placeholder={'email'} value={objFilter.email}
                                       onChange={(e) => FilterChange(e, 'email')}
                                       className='input'/>
                                <input placeholder={'authToken'} value={objFilter.authToken}
                                       onChange={(e) => FilterChange(e, 'authToken')} className='input'/>
                                <input placeholder={'creationDate (DD-MM-YYYY)'} value={objFilter.creationDate}
                                       onChange={(e) => FilterChange(e, 'creationDate')} className='input'
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
                <div className='no-data'>NO ACCOUNTS</div>
            ) : (
                <div className='headers'>
                    <div className='headers-item'>ACCOUNT ID</div>
                    <div className='headers-item'>EMAIL</div>
                    <div className='headers-item'>AUTH TOKEN</div>
                    <div className='headers-item'>CREATION DATE</div>
                </div>
            )}
            {sortedData.slice(firstElem, lastElem).map(account => (
                <NavLink key={account.accountId} className='line' to={`/profiles?accountId=${account.accountId}`}>
                    <div className='line-item'>{account.accountId}</div>
                    <div className='line-item'>{account.email}</div>
                    <div className='line-item'>{account.authToken}</div>
                    <div className='line-item'>{account.creationDate}</div>
                </NavLink>
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
    );
}

export default Accounts