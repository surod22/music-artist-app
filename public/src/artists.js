

var ArtistsBlock = React.createClass({

    loadArtistsFromServer: function() {
        console.log("Checking Filtered at load" + this.state.filteredData);
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


    handleSubmit: function(event) {
        event.preventDefault();

        this.setState({
            query:this.state.query,
            filteredData: this.state.filteredData,
            data: this.state.data
        });

        console.log("QUERY value:" + this.state.query)
        var query = this.state.query;

        console.log("Hello, is this what youare looking for?" + this.state.query);

        var urlSearch = this.props.url + "/search" + "?keywords="+ query;
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

        this.setState({
            query:'',
            filteredData: this.filteredData,
            data: this.state.data
        })

        console.log("Filtered Updated" + this.state.filteredData)
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
        console.log("THIS query:" + this.state.query);

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
                        <input   type="text"
                            placeholder="Search here"
                            value={this.state.value}
                            onChange={this.handleQueryChange}
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
        var artistProperties = this.props.data;
        return(

            <div className="responsive">
                    <div>{this.props.index}
                    <pre className="responsive-img wrapper">{JSON.stringify(artistProperties, null, 15)}</pre></div>
            </div>
        );
    }
});

var Artist = React.createClass({
    render: function(){

        return(
            <div className="responsive">
                <div class="text">
                    <h3> {this.props.data.artistName}</h3>
                    {this.props.data.artistDescription}
                </div>
                <div className= "margin-img" > <img src={this.props.data.imageUrl} className="responsive-img wrapper" /> </div>
            </div>
        );

    }
});

var ArtistList = React.createClass({

        render: function(){
            var queryValue = this.props.query;
            var artists;

            if(queryValue === undefined &&
                (this.props.filteredData == null
                || this.props.filteredData.length == 0
                || this.props.filteredData.artists == null )){

                console.log("Default artists");
                     artists = this.props.data.map(function(artist) {
                        return (
                            <Artist key={artist.artistId} data={artist}/>
                        );

                     });
            }else{

                console.log("Returning filtered artists");
                console.log(this.props.filteredData);
                if(this.props.filteredData.artists.length==0){
                    console.log("NO RESUTS");
                    artists = <h3> No artists found. </h3>;
                }else {
                    artists = this.props.filteredData.artists.map(function(artistAllData, index){
                        if(index<6){
                            return (
                            <FilteredData key={index} data={artistAllData} index={index}/>
                            );
                        }else
                            return;
                    });
                }
            }

            return (
                <div className="container">
                    <div className="artistList">
                    <div className="row">
                        {artists}
                    </div>
                    </div>
                </div>
            );
        }
});

ReactDOM.render(
        <ArtistsBlock url="/api/artists" pollInterval={2000} />,
        document.getElementById('example')
        );
