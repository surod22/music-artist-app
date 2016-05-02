var ArtistsBlock = React.createClass({

    loadArtistsFromServer: function() {

        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({
                data: data,
                query: '',
                filteredData: this.state.filteredData
                });
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });

    },

    updateState: function(){
        this.setState({
            query: this.refs.box.value,
            filteredData: this.state.filteredData,
            data: this.state.data
        });
    },

    clearQueryState: function(){
        this.setState({
            query:'',
            filteredData: this.state.filteredData,
            data: this.state.data
        })
    },

    handleSubmit: function(event) {

        var query = this.refs.box.value;
        var urlSearch = this.props.url + "/search" + "?keywords="+ query;

        event.preventDefault();

        this.updateState();

        this.refs.box.value = "";

        $.ajax({
            url: urlSearch,
            dataType: 'json',
            success: function(filteredData){
                this.setState({
                    data: this.state.data,
                    filteredData: filteredData,
                    query: query
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

        this.clearQueryState();


    },

    getInitialState: function() {

        return {
            data: [],
            filteredData: [],
            query: ''
         };
    },

    handleQueryChange: function(event){

        this.setState({query: event.target.value});
    },

    componentDidMount: function() {

        this.loadArtistsFromServer();
        setInterval(this.loadArtistsFromServer, this.props.pollInterval);

    },

    render: function() {

        return (

            <div className="artistsBlock">
                <div className="row">
                    <h1>Artists</h1>
                    <section>
                        <form  onSubmit={this.handleSubmit}  >
                            <input
                                type="text"
                                placeholder="Search here"
                                value={this.state.value}
                                onChange={this.handleQueryChange}
                                ref="box"
                            />
                            <input type="submit" value="Search" />
                        </form>
                    </section>
                </div>

                <ArtistList data={this.state.data} filteredData={this.state.filteredData} />

            </div>

        );
    }
});

var FilteredData = React.createClass({

    render:function(){

        var imageUrl = "http://iscale.iheart.com/catalog/artist/" + this.props.data.artistId + "?ops=fit(250,0)";

        return(

            <div className="responsive">
                <div className="row">
                    <div className="text">
                        <h3> {this.props.data.artistName}</h3>
                    </div>
                </div>

                <div className= "margin-img" > <img src={imageUrl} className="responsive-img wrapper" /> </div>
            </div>
        );
    }

});

var Artist = React.createClass({

    render: function(){

        return(
            <div className="responsive">
                <div className="text">
                    <h3> {this.props.data.artistName}</h3>
                    {this.props.data.artistDescription}
                </div>
                <div className= "margin-img" > <img src={this.props.data.imageUrl} className="responsive-img wrapper" /> </div>
            </div>
        );

    }
});

var ArtistList = React.createClass({

        getDefaultArtistsFormat(){
            var defaultArtists = this.props.data.map(function(artist) {
                return (
                    <Artist key={artist.artistId} data={artist}/>
                );
            });

            return defaultArtists;
        },

        getFilteredArtistsFormat(){

             var artists;

             if(this.props.filteredData.artists.length==0){

                 artists = <h3> No artists found. </h3>;

             }else {

                 artists = this.props.filteredData.artists.map(function(artistAllData, index){
                        if(index<6){
                            return ( <FilteredData key={index} data={artistAllData} index={index}/> );
                        }else{
                            return;
                        }
                    });
             }
             return artists;
        },

        artists(queryValue){

            var artistsFormat;

            if(queryValue === undefined &&
                            (this.props.filteredData == null
                            || this.props.filteredData.length == 0
                            || this.props.filteredData.artists == null )){

                artistsFormat = this.getDefaultArtistsFormat();
            }else{
                artistsFormat = this.getFilteredArtistsFormat();
            }

            return artistsFormat;
        },

        render: function(){
            return (

                <div className="container">
                    <div className="artistList">

                        {this.artists(this.props.query)}

                    </div>
                </div>
            );
        }
});

ReactDOM.render(
        <ArtistsBlock url="/api/artists" pollInterval={2000} />,
        document.getElementById('example')
        );
