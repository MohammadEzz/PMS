import { Chip, TextField } from "@mui/material";
import { InstantSearch, Hits, Highlight, Panel, Configure } from 'react-instantsearch-dom';
import DebouncedSearchBox from './SearchBox';
import algoliasearch from 'algoliasearch/lite';
import react, { createRef, useEffect, useRef, useState } from "react";
import { Box } from "@mui/system";
import React from "react";

const searchClient = algoliasearch('HN7Z9OTE32', '04e5d4bef117a551f0f5e03cba900b0a');

export default function PurchaseBillSearchBlock(props) {

    const [hitStatus, setHitStatus] = useState(false);
    const[searchBy, setSearchBy] = useState('barcode');
    
    function hitComponent ({hit}) {
        return (
            <div className="hitItem" onClick={()=>{
                props.actions.fetchDrugById(hit.id);
                setHitStatus(false);
                }}>
                <Highlight 
                attribute='name'
                hit={hit}
                tagName = 'span'
                />
            </div>
        )   
    }
    
    function handleKeyUp(event) {
        if(event.code === 'Enter' || event.code === 'NumpadEnter') {
            (event.target.value)
            ? props.actions.fetchDrugByBarCode(event.target.value)
            : alert('Barcode Not Correct');
        }
    }

    function handleFocus() {
        setHitStatus(true);
    }

    // useEffect(()=>{
    //     document.onclick = function(e) {
    //         let searchFieldTarget = null;
    //         if (e.path.length >= 3)  searchFieldTarget =  e.path[2];
    //         if(
    //             (e.target.className)
    //             &&
    //             e.target.className !== 'hitItem' 
    //             && 
    //             (searchFieldTarget == null || searchFieldTarget.className.search('search-field') === -1)) {
    //                 setHitStatus(false);
    //         }
    //     }  
    // }, []);
    return (
            <div className="search-block">
                {
                    (searchBy === 'name')
                    ?
                    <Panel className="search-full-text">
                        <InstantSearch 
                        searchClient={searchClient} 
                        indexName="drugs">
                            <DebouncedSearchBox 
                            autoFocus
                            onFocus={handleFocus}
                            placeholder="Select From Drugs ..."
                            delay={500}
                            />
                            {
                                hitStatus
                                &&
                                <Hits 
                                className='refine-result-container'
                                hitComponent={hitComponent}/>
                            }
                        </InstantSearch>
                    </Panel>
                    :
                    <TextField
                        fullWidth
                        size="small"
                        name="drugcode"
                        onKeyUp={handleKeyUp}
                        sx={{width: "300px"}}
                    />
                }
                
                <Chip sx={{ml:"5px"}} 
                variant={(searchBy === 'barcode') ? "contained" : "outlined"} 
                color="primary" 
                label="Barcode" 
                onClick={()=>setSearchBy('barcode')}
                />
                <Chip 
                sx={{ml:"5px"}} 
                variant={(searchBy === 'name') ? "contained" : "outlined"} 
                color="primary" 
                label="Drug Name"
                onClick={()=>setSearchBy('name')}
                />
            </div>
    );
}