

var ArtistsBlock = React.createClass({

    loadCommentsFromServer: function() {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data});
          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
     },

    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
            <div className="artistsBlock">
            <h1>Artists</h1>
            <ArtistList data={this.state.data} />
            </div>

        );
    }
});

var Artist = React.createClass({
    render: function(){
        return(
            <div className= "col-md-4">
                <div className="row">
                <h3> {this.props.data.artistName}</h3>
                {this.props.data.artistDescription}
                <img src={this.props.data.imageUrl} className="img-responsive thumbnail"/>
                </div>
            </div>
        );

    }
});

var ArtistList = React.createClass({

        render: function(){
            var artists = this.props.data.map(function(artist) {

                return (

                        <Artist key={artist.artistId} data={artist}/>

                );

            });
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
