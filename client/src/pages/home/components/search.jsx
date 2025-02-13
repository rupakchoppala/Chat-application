const Search=({searchkey,setSearchKey})=>{
    return(
        <>
        <div className="user-search-area ">
   <input type="text" className="user-search-text" 
   value={searchkey} onChange={(e)=>setSearchKey(e.target.value)}/>
   <i className="fa fa-search user-search-btn" aria-hidden="true"></i>
</div>
        </>
    )
}
export default Search;